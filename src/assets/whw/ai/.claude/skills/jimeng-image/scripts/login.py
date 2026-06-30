#!/usr/bin/env python3
"""
即梦AI 登录脚本 - 单独运行此脚本完成登录并保存Cookie
使用方法: python3 login.py
"""

import asyncio
import json
from pathlib import Path

try:
    from playwright.async_api import async_playwright
except ImportError:
    print("ERROR: Playwright 未安装，请运行: pip3 install playwright && playwright install chromium")
    exit(1)

JIMENG_URL = "https://jimeng.jianying.com/ai-tool/image/generate"
COOKIE_FILE = Path.home() / ".claude" / "jimeng_cookies.json"


async def login():
    print("\n" + "="*50)
    print("即梦AI 登录工具")
    print("="*50)
    print("浏览器即将打开，请完成登录...")
    print("登录成功后，请回到此终端按回车键\n")

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            headless=False,
            args=["--no-sandbox"]
        )
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        await page.goto(JIMENG_URL)

        print("请在浏览器中完成登录（扫码或账号密码）...")
        input("登录完成后，按回车键保存登录状态...")

        # 保存 Cookie
        cookies = await context.cookies()
        COOKIE_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(COOKIE_FILE, 'w', encoding='utf-8') as f:
            json.dump(cookies, f, ensure_ascii=False, indent=2)

        print(f"\n登录状态已保存到: {COOKIE_FILE}")
        print("现在可以使用 generate_image.py 生成图片了！")

        await browser.close()


if __name__ == "__main__":
    asyncio.run(login())
