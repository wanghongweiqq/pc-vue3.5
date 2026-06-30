#!/usr/bin/env python3
"""
即梦AI API 图片生成脚本
优先使用4.6（jimeng_seedream46_cvtob），失败自动降级到4.0（jimeng_t2i_v40）
"""

import argparse
import base64
import os
import sys
import time
import urllib.request
from pathlib import Path

RATIO_MAP = {
    "1:1":  (1024, 1024),
    "16:9": (1280, 720),
    "9:16": (720, 1280),
    "4:3":  (1024, 768),
    "3:4":  (768, 1024),
}

# 4.6 使用 req_json 格式提交，返回 image_urls
# 4.0 使用普通格式提交，返回 binary_data_base64
MODELS = [
    {"key": "jimeng_seedream46_cvtob", "version": "4.6", "use_req_json": True},
    {"key": "jimeng_t2i_v40",          "version": "4.0", "use_req_json": False},
]


def get_credentials():
    ak = os.environ.get("VOLC_ACCESS_KEY", "").strip()
    sk = os.environ.get("VOLC_SECRET_KEY", "").strip()
    if not ak or not sk:
        print("错误：未找到 VOLC_ACCESS_KEY 或 VOLC_SECRET_KEY 环境变量。")
        print("请前往 https://console.volcengine.com/iam/keymanage/ 创建凭证，")
        print("并在 shell 配置文件中添加：")
        print("  export VOLC_ACCESS_KEY=your_access_key")
        print("  export VOLC_SECRET_KEY=your_secret_key")
        sys.exit(1)
    return ak, sk


def submit_task(service, model: dict, prompt: str, width: int, height: int, count: int) -> str:
    import json as _json
    req_key = model["key"]

    if model["use_req_json"]:
        req_json_obj = {
            "prompt": prompt,
            "width": width,
            "height": height,
            "return_url": True,
            "seed": -1,
            "scale": 3.5,
        }
        if count > 1:
            req_json_obj["batch_size"] = count
        body = {
            "req_key": req_key,
            "req_json": _json.dumps(req_json_obj),
            "logo_info": _json.dumps({"add_logo": False}),
        }
    else:
        body = {
            "req_key": req_key,
            "prompt": prompt,
            "width": width,
            "height": height,
            "return_url": True,
            "seed": -1,
            "scale": 3.5,
            "logo_info": {"add_logo": False},
        }
        if count > 1:
            body["batch_size"] = count

    resp = service.cv_sync2async_submit_task(body)
    code = resp.get("code")
    if code != 10000:
        raise RuntimeError(f"提交失败（code={code}）：{resp.get('message', resp)}")

    task_id = resp["data"].get("task_id") or resp["data"].get("req_id")
    return task_id


def poll_result(service, model: dict, task_id: str, timeout: int = 120):
    req_key = model["key"]
    query_body = {"req_key": req_key, "task_id": task_id}
    interval = 5
    elapsed = 0
    consecutive_errors = 0

    print("等待生成结果", end="", flush=True)
    while elapsed < timeout:
        time.sleep(interval)
        elapsed += interval
        print(".", end="", flush=True)

        try:
            result = service.cv_sync2async_get_result(query_body)
            consecutive_errors = 0
        except Exception as e:
            err = str(e)
            if any(c in err for c in ["50500", "50501", "Internal Error", "Internal RPC"]):
                consecutive_errors += 1
                # 连续10次服务端错误，认为该模型不可用
                if consecutive_errors >= 10:
                    print(f"\n模型 {model['version']} 查询接口持续报错，触发降级。")
                    raise RuntimeError(f"模型 {model['version']} 不可用")
                continue
            raise

        data = result.get("data", {})
        status = data.get("status")

        if status == "done":
            print(" 完成！")
            b64_list = data.get("binary_data_base64", [])
            if b64_list:
                return ("base64", b64_list)
            urls = data.get("image_urls", [])
            if urls:
                return ("url", urls)
            raise RuntimeError("生成成功但未返回图片数据")
        elif status == "failed":
            raise RuntimeError(f"生成失败：{result}")

    raise RuntimeError(f"超时（{timeout}s）")


def save_images(result_type: str, data_list: list, output_dir: Path, count: int) -> list:
    output_dir = Path(output_dir).expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    saved = []
    timestamp = int(time.time())

    for i, item in enumerate(data_list[:count]):
        if result_type == "base64":
            filename = output_dir / f"jimeng_{timestamp}_{i+1}.png"
            print(f"保存图片 {i+1}/{min(len(data_list), count)}: {filename}")
            try:
                filename.write_bytes(base64.b64decode(item))
                saved.append(str(filename))
            except Exception as e:
                print(f"  保存失败：{e}")
        else:
            filename = output_dir / f"jimeng_{timestamp}_{i+1}.jpg"
            print(f"下载图片 {i+1}/{min(len(data_list), count)}: {filename}")
            try:
                urllib.request.urlretrieve(item, filename)
                saved.append(str(filename))
            except Exception as e:
                print(f"  下载失败：{e}")

    return saved


def main():
    parser = argparse.ArgumentParser(description="即梦AI API 图片生成（4.6优先，自动降级4.0）")
    parser.add_argument("prompt", help="英文图片提示词")
    parser.add_argument("--output", default="~/Desktop", help="图片保存目录（默认：~/Desktop）")
    parser.add_argument("--ratio", default="1:1", choices=list(RATIO_MAP.keys()), help="图片比例")
    parser.add_argument("--count", type=int, default=1, choices=range(1, 5), help="生成数量（1-4）")
    args = parser.parse_args()

    try:
        from volcengine.visual.VisualService import VisualService
    except ImportError:
        print("错误：未安装 volcengine SDK，请运行：pip install volcengine")
        sys.exit(1)

    ak, sk = get_credentials()
    service = VisualService()
    service.set_ak(ak)
    service.set_sk(sk)

    width, height = RATIO_MAP[args.ratio]
    print(f"提示词：{args.prompt}")
    print(f"尺寸：{width}×{height}（{args.ratio}），数量：{args.count}")

    for model in MODELS:
        print(f"\n[尝试模型 {model['version']}]")
        try:
            task_id = submit_task(service, model, args.prompt, width, height, args.count)
            print(f"任务已提交，task_id: {task_id}")
            result_type, data_list = poll_result(service, model, task_id)
            saved = save_images(result_type, data_list, args.output, args.count)
            print(f"\n生成完成！使用模型：{model['version']}，共保存 {len(saved)} 张图片：")
            for path in saved:
                print(f"  {path}")
            return
        except RuntimeError as e:
            print(f"模型 {model['version']} 失败：{e}")
            if model is not MODELS[-1]:
                print("自动切换到下一个模型...")

    print("\n所有模型均失败，请检查网络或账号状态。")
    sys.exit(1)


if __name__ == "__main__":
    main()
