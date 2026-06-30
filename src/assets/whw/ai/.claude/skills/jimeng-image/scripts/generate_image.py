#!/usr/bin/env python3
"""
即梦AI图片生成脚本
使用 Playwright 自动化浏览器操作即梦AI生成图片
"""

import asyncio
import json
import os
import sys
import time
import re
from pathlib import Path
from datetime import datetime

try:
    from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
except ImportError:
    print("ERROR: Playwright 未安装，请运行: pip install playwright && playwright install chromium")
    sys.exit(1)

JIMENG_URL = "https://jimeng.jianying.com/ai-tool/image/generate"
COOKIE_FILE = Path.home() / ".claude" / "jimeng_cookies.json"


def sanitize_filename(text: str, max_len: int = 40) -> str:
    """将提示词转换为合法文件名"""
    text = re.sub(r'[^\w\u4e00-\u9fff\s-]', '', text)
    text = text.strip().replace(' ', '_')[:max_len]
    return text or "image"


async def save_cookies(context):
    """保存浏览器 Cookie 到文件"""
    cookies = await context.cookies()
    COOKIE_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(COOKIE_FILE, 'w', encoding='utf-8') as f:
        json.dump(cookies, f, ensure_ascii=False, indent=2)
    print(f"Cookie 已保存到: {COOKIE_FILE}")


async def load_cookies(context):
    """从文件加载 Cookie"""
    if not COOKIE_FILE.exists():
        return False
    try:
        with open(COOKIE_FILE, 'r', encoding='utf-8') as f:
            cookies = json.load(f)
        await context.add_cookies(cookies)
        print("已加载保存的登录状态")
        return True
    except Exception as e:
        print(f"加载 Cookie 失败: {e}")
        return False


async def check_logged_in(page):
    """检查是否已登录"""
    try:
        await page.goto(JIMENG_URL, timeout=30000)
        await page.wait_for_load_state("networkidle", timeout=15000)
        # 检查是否有登录按钮或跳转到登录页
        current_url = page.url
        if "login" in current_url or "passport" in current_url:
            return False
        # 检查是否有用户头像或创作区域
        try:
            await page.wait_for_selector('textarea, [class*="input"], [placeholder*="描述"]', timeout=8000)
            return True
        except:
            return False
    except Exception:
        return False


async def manual_login(playwright):
    """打开浏览器让用户手动登录，完成后保存 Cookie"""
    print("\n" + "="*50)
    print("首次使用需要登录即梦AI")
    print("浏览器将会打开，请手动完成登录")
    print("登录成功后，请回到终端按回车键继续")
    print("="*50 + "\n")

    browser = await playwright.chromium.launch(headless=False)
    context = await browser.new_context(
        viewport={"width": 1280, "height": 800},
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    page = await context.new_page()
    await page.goto(JIMENG_URL)

    print("请在浏览器中完成登录...")
    input("登录完成后，按回车键继续...")

    # 验证登录状态
    logged_in = await check_logged_in(page)
    if logged_in:
        await save_cookies(context)
        print("登录成功！Cookie 已保存。")
    else:
        print("警告：未能确认登录状态，但仍会保存当前 Cookie")
        await save_cookies(context)

    await browser.close()
    return logged_in


async def generate_image(prompt: str, output_dir: str = ".", ratio: str = "1:1", image_path: str = None):
    """
    使用即梦AI生成图片

    Args:
        prompt: 图片描述（英文效果更好，中文会自动处理）
        output_dir: 图片保存目录
        ratio: 图片比例，支持 1:1, 16:9, 9:16, 4:3, 3:4
        image_path: 参考图片路径（用于图生图/图片编辑）
    """
    output_path = Path(output_dir).expanduser().resolve()
    output_path.mkdir(parents=True, exist_ok=True)

    async with async_playwright() as playwright:
        # 检查是否有保存的 Cookie
        has_cookies = COOKIE_FILE.exists()

        if not has_cookies:
            print("ERROR: 未找到登录状态！")
            print(f"请先在终端运行登录脚本完成登录：")
            print(f"  python3 ~/.claude/skills/jimeng-image/scripts/login.py")
            sys.exit(1)

        # 启动浏览器（使用反检测配置）
        browser = await playwright.chromium.launch(
            headless=False,  # 非无头模式，避免被检测
            args=[
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-blink-features=AutomationControlled",
            ]
        )
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            java_script_enabled=True,
        )
        # 注入脚本隐藏自动化特征
        await context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
        """)

        # 加载 Cookie
        await load_cookies(context)

        page = await context.new_page()

        try:
            print(f"正在打开即梦AI...")
            await page.goto(JIMENG_URL, timeout=60000, wait_until="domcontentloaded")
            await asyncio.sleep(3)  # 等待页面 JS 执行

            # 检查是否需要重新登录
            current_url = page.url
            if "login" in current_url or "passport" in current_url:
                print("ERROR: Cookie 已过期，需要重新登录！")
                print("请在终端运行：")
                print("  python3 ~/.claude/skills/jimeng-image/scripts/login.py")
                await browser.close()
                sys.exit(1)

            print(f"输入提示词: {prompt}")

            # 刷新页面，清空上次生成的旧结果
            await page.reload(wait_until="domcontentloaded")
            await asyncio.sleep(3)

            # 如果有参考图，先上传图片（图生图模式）
            if image_path:
                ref_path = Path(image_path).expanduser().resolve()
                if not ref_path.exists():
                    print(f"ERROR: 参考图片不存在: {ref_path}")
                    await browser.close()
                    sys.exit(1)
                print(f"上传参考图片: {ref_path}")
                # 找到图片上传按钮（即梦的上传区域）
                try:
                    # 等待上传按钮出现（即梦图生图入口）
                    upload_input = await page.query_selector('input[type="file"]')
                    if upload_input:
                        await upload_input.set_input_files(str(ref_path))
                        print("已通过 file input 上传图片")
                        await asyncio.sleep(2)
                    else:
                        # 尝试找上传图标按钮并点击，触发 file input
                        upload_btn = await page.query_selector(
                            '[class*="upload"], [class*="image-upload"], [aria-label*="上传"], [aria-label*="upload"]'
                        )
                        if upload_btn:
                            await upload_btn.click()
                            await asyncio.sleep(1)
                            upload_input = await page.query_selector('input[type="file"]')
                            if upload_input:
                                await upload_input.set_input_files(str(ref_path))
                                print("已点击上传按钮并上传图片")
                                await asyncio.sleep(2)
                            else:
                                print("警告：找不到 file input，尝试继续...")
                        else:
                            print("警告：找不到上传按钮，尝试继续...")
                except Exception as e:
                    print(f"上传图片时出错: {e}，尝试继续...")

            # 先关闭可能出现的弹窗（模板选择/提示词建议框）
            try:
                modal = await page.query_selector('.lv-modal-wrapper')
                if modal:
                    print("检测到弹窗，尝试关闭...")
                    # 方法1: 按 Escape 键
                    await page.keyboard.press('Escape')
                    await asyncio.sleep(0.8)

                    # 方法2: 用 JavaScript 直接移除弹窗
                    modal = await page.query_selector('.lv-modal-wrapper')
                    if modal:
                        await page.evaluate("""
                            () => {
                                // 移除所有模态框
                                const modals = document.querySelectorAll('.lv-modal-wrapper');
                                modals.forEach(m => m.remove());
                                // 移除遮罩
                                const masks = document.querySelectorAll('.lv-modal-mask');
                                masks.forEach(m => m.remove());
                            }
                        """)
                        await asyncio.sleep(0.5)
                        print("已通过 JS 移除弹窗")
            except Exception as e:
                print(f"关闭弹窗时出错: {e}")
                pass

            # 找到提示词输入框（即梦使用 ProseMirror 富文本编辑器）
            print("等待输入框加载...")
            await page.wait_for_selector(
                'div.tiptap.ProseMirror',
                timeout=15000
            )
            await asyncio.sleep(1)  # 等待编辑器完全稳定
            print("找到输入框")

            # 第一步：先将生成数量设置为1张（即梦页面上有 "✦ N / 张" 的数量切换按钮）
            try:
                clicked = await page.evaluate("""
                    () => {
                        const all = document.querySelectorAll('*');
                        for (const el of all) {
                            const text = el.textContent.trim();
                            if ((text.includes('/') && text.includes('张')) && el.children.length <= 3) {
                                el.click();
                                return true;
                            }
                        }
                        return false;
                    }
                """)
                if clicked:
                    await asyncio.sleep(0.5)
                    selected = await page.evaluate("""
                        () => {
                            const all = document.querySelectorAll('*');
                            for (const el of all) {
                                const text = el.textContent.trim();
                                if (text === '1' || text === '1张') {
                                    el.click();
                                    return true;
                                }
                            }
                            return false;
                        }
                    """)
                    if selected:
                        print("已设置生成数量为1张")
                        await asyncio.sleep(0.5)
                    else:
                        print("未找到1张选项，继续...")
                else:
                    print("未找到数量切换按钮，继续...")
            except Exception as e:
                print(f"设置数量时出错: {e}，继续...")

            # 第二步：输入提示词
            focused = await page.evaluate(f"""
                () => {{
                    const editor = document.querySelector('div.tiptap.ProseMirror');
                    if (!editor) return false;
                    editor.focus();
                    document.execCommand('selectAll', false, null);
                    document.execCommand('delete', false, null);
                    return true;
                }}
            """)
            if not focused:
                raise Exception("无法聚焦到输入框")
            await asyncio.sleep(0.3)

            await page.keyboard.type(prompt, delay=30)
            print(f"已输入提示词")

            # 等待一下让页面响应
            await asyncio.sleep(1)

            # 等待生成按钮变为可用（输入文字后按钮会从 disabled 变为 enabled）
            print("等待生成按钮变为可用...")
            generate_btn = None

            # 等待主要的圆形 primary 按钮变为可用（即非 disabled 状态）
            try:
                # 等待 lv-btn-primary 且非 disabled 的按钮出现
                await page.wait_for_function("""
                    () => {
                        const btns = document.querySelectorAll('button.lv-btn-primary');
                        for (const btn of btns) {
                            if (!btn.disabled && !btn.classList.contains('lv-btn-disabled')) {
                                return true;
                            }
                        }
                        return false;
                    }
                """, timeout=10000)

                # 找到可用的 primary 按钮
                all_btns = await page.query_selector_all('button.lv-btn-primary')
                for btn in all_btns:
                    is_disabled = await btn.evaluate("el => el.disabled || el.classList.contains('lv-btn-disabled')")
                    if not is_disabled:
                        generate_btn = btn
                        print("找到可用的生成按钮")
                        break
            except Exception as e:
                print(f"等待生成按钮时出错: {e}")

            if not generate_btn:
                screenshot_path = output_path / f"debug_no_btn_{int(time.time())}.png"
                await page.screenshot(path=str(screenshot_path))
                raise Exception(f"找不到可用的生成按钮，已保存截图: {screenshot_path}")

            captured_image_urls = []

            # 点击前等待一下，确保页面稳定
            await asyncio.sleep(0.5)

            # 用 JavaScript 直接触发点击（绕过可见性检查）
            await page.evaluate("""
                () => {
                    const btns = document.querySelectorAll('button.lv-btn-primary');
                    for (const btn of btns) {
                        if (!btn.disabled && !btn.classList.contains('lv-btn-disabled')) {
                            btn.click();
                            return true;
                        }
                    }
                    return false;
                }
            """)
            print("已点击生成按钮，等待图片生成...")

            # 点击后再注册网络拦截，确保只捕获点击后的新图片
            async def handle_response(response):
                url = response.url
                if (('p3-bot' in url or 'p9-bot' in url or 'p26-bot' in url or 'tos-cn-i' in url)
                        and any(ext in url for ext in ['.jpg', '.jpeg', '.png', '.webp', '~tplv', 'image/'])):
                    if url not in captured_image_urls:
                        captured_image_urls.append(url)

            page.on("response", handle_response)

            # 等待图片生成（最多等待 120 秒）
            print("生成中，请稍候（最多等待2分钟）...")
            generated_images = []

            for attempt in range(24):  # 每5秒检查一次，最多120秒
                await asyncio.sleep(5)

                # 检测积分不足弹窗
                insufficient_modal = await page.evaluate("""
                    () => {
                        const texts = ['积分不足', '没有相关权益', '升级会员'];
                        const body = document.body.innerText || '';
                        return texts.some(t => body.includes(t));
                    }
                """)
                if insufficient_modal:
                    print("ERROR: 积分不足或没有相关权益，无法生成图片！")
                    print("请登录即梦AI网站充值积分或升级会员后再试。")
                    await browser.close()
                    sys.exit(2)

                # 优先使用网络拦截捕获的 URL
                new_count = 0
                for src in captured_image_urls:
                    if src not in generated_images:
                        generated_images.append(src)
                        new_count += 1

                # 如果网络拦截没有捕获到，降级为 DOM 扫描（但只取点击后新增的）
                if not generated_images:
                    # 记录点击前所有图片 URL（仅在第一次降级扫描时建立基线）
                    if attempt == 0:
                        # 已在点击前通过网络拦截，这里只作兜底
                        pass

                if new_count > 0:
                    print(f"检测到 {new_count} 张新生成的图片（共已有 {len(generated_images)} 张）")
                if generated_images:
                    # 等待稳定：如果已有4张则直接结束，否则再等一轮确认没有更多
                    if len(generated_images) >= 4:
                        break
                    # 少于4张时再等5秒看是否有更多
                    if attempt >= 2 and new_count == 0:
                        break

                if attempt % 3 == 0:
                    print(f"  等待中... ({(attempt+1)*5}秒)")

            # 如果网络拦截没有捕获到图片，降级为 DOM 扫描（以点击时间为界）
            if not generated_images:
                print("网络拦截未捕获到图片，尝试 DOM 扫描...")
                # 等待一下让 DOM 稳定
                await asyncio.sleep(3)
                # 扫描页面中最新的图片（取最后出现的，通常是刚生成的）
                dom_srcs = await page.evaluate("""
                    () => {
                        const srcs = [];
                        // 优先找结果容器内的图片
                        const containers = document.querySelectorAll(
                            '[class*="result"] img, [class*="generate"] img, [class*="output"] img'
                        );
                        containers.forEach(img => {
                            const src = img.src || img.getAttribute('src') || '';
                            if (src && src.startsWith('http')
                                && img.naturalWidth > 200
                                && img.naturalHeight > 200
                                && !src.includes('avatar')
                                && !src.includes('icon')
                                && !src.includes('logo')) {
                                srcs.push(src);
                            }
                        });
                        return [...new Set(srcs)];
                    }
                """)
                generated_images = dom_srcs[:4]
                if generated_images:
                    print(f"DOM 扫描找到 {len(generated_images)} 张图片")

            if not generated_images:
                # 尝试截图保存当前状态
                screenshot_path = output_path / f"debug_screenshot_{int(time.time())}.png"
                await page.screenshot(path=str(screenshot_path))
                print(f"未能找到生成的图片，已保存调试截图: {screenshot_path}")
                sys.exit(1)

            # 下载图片
            saved_files = []
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            safe_prompt = sanitize_filename(prompt)

            for i, img_url in enumerate(generated_images[:1]):  # 只保存1张
                filename = f"{safe_prompt}_{timestamp}_{i+1}.jpg"
                filepath = output_path / filename
                try:
                    # 用 Playwright 的 APIRequestContext 下载，自动携带浏览器 Cookie 和 Headers
                    api_response = await page.request.get(img_url)
                    content_type = api_response.headers.get("content-type", "")
                    body = await api_response.body()

                    # 检查是否是真实图片（不是 SVG 占位图）
                    if body[:4] in (b'\xff\xd8\xff\xe0', b'\xff\xd8\xff\xe1', b'\x89PNG') or \
                       (b'<svg' not in body[:100] and b'<?xml' not in body[:100] and len(body) > 10000):
                        ext = ".png" if b'\x89PNG' in body[:4] else ".jpg"
                        filepath = output_path / f"{safe_prompt}_{timestamp}_{i+1}{ext}"
                        with open(filepath, 'wb') as f:
                            f.write(body)
                        saved_files.append(str(filepath))
                        print(f"图片已保存: {filepath}")
                    else:
                        raise Exception(f"下载到非图片内容 ({len(body)} bytes, type={content_type})")

                except Exception as e:
                    print(f"保存第 {i+1} 张图片失败: {e}")

            # 更新 Cookie（保持登录状态）
            await save_cookies(context)

            if saved_files:
                print(f"\n成功生成并保存 {len(saved_files)} 张图片:")
                for f in saved_files:
                    print(f"  - {f}")
                return saved_files
            else:
                print("图片生成失败")
                sys.exit(1)

        except Exception as e:
            print(f"发生错误: {e}")
            # 保存调试截图
            try:
                screenshot_path = output_path / f"error_screenshot_{int(time.time())}.png"
                await page.screenshot(path=str(screenshot_path))
                print(f"已保存错误截图: {screenshot_path}")
            except:
                pass
            raise
        finally:
            await browser.close()


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="即梦AI图片生成工具")
    parser.add_argument("prompt", help="图片描述（建议使用英文）")
    parser.add_argument("--output", "-o", default=".", help="图片保存目录（默认当前目录）")
    parser.add_argument("--ratio", "-r", default="1:1",
                        choices=["1:1", "16:9", "9:16", "4:3", "3:4"],
                        help="图片比例（默认 1:1）")
    parser.add_argument("--image", "-i", default=None, help="参考图片路径（用于图生图/图片编辑）")
    parser.add_argument("--reset-login", action="store_true", help="重置登录状态，重新手动登录")

    args = parser.parse_args()

    if args.reset_login and COOKIE_FILE.exists():
        COOKIE_FILE.unlink()
        print("已清除登录状态，将重新登录")

    asyncio.run(generate_image(args.prompt, args.output, args.ratio, args.image))
