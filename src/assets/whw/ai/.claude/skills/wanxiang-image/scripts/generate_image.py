#!/usr/bin/env python3
"""
通义万象图片生成脚本
使用阿里云 DashScope API 生成图片
"""

import argparse
import json
import os
import sys
import time
import requests
from pathlib import Path


API_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis"
TASK_URL = "https://dashscope.aliyuncs.com/api/v1/tasks/{task_id}"


def get_api_key():
    key = os.environ.get("DASHSCOPE_API_KEY", "").strip()
    if not key:
        print("错误：未找到 DASHSCOPE_API_KEY 环境变量。", file=sys.stderr)
        print("请先设置 API Key：export DASHSCOPE_API_KEY=\"your_api_key_here\"", file=sys.stderr)
        sys.exit(1)
    return key


def submit_task(prompt: str, size: str, api_key: str) -> str:
    """提交图片生成任务，返回 task_id"""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "X-DashScope-Async": "enable",
    }
    payload = {
        "model": "wanx2.1-t2i-turbo",
        "input": {
            "prompt": prompt,
        },
        "parameters": {
            "size": size,
            "n": 1,
        },
    }

    resp = requests.post(API_URL, headers=headers, json=payload, timeout=30)
    data = resp.json()

    if resp.status_code != 200:
        code = data.get("code", "")
        message = data.get("message", str(data))
        print(f"错误：提交任务失败 [{code}] {message}", file=sys.stderr)
        sys.exit(1)

    task_id = data.get("output", {}).get("task_id")
    if not task_id:
        print(f"错误：未获取到 task_id，响应：{data}", file=sys.stderr)
        sys.exit(1)

    return task_id


def poll_task(task_id: str, api_key: str, max_wait: int = 120) -> str:
    """轮询任务状态，返回图片 URL"""
    headers = {"Authorization": f"Bearer {api_key}"}
    url = TASK_URL.format(task_id=task_id)
    start = time.time()

    print(f"任务已提交（ID: {task_id}），等待生成中...", flush=True)

    while time.time() - start < max_wait:
        time.sleep(3)
        resp = requests.get(url, headers=headers, timeout=30)
        data = resp.json()
        output = data.get("output", {})
        status = output.get("task_status", "")

        if status == "SUCCEEDED":
            results = output.get("results", [])
            if results:
                return results[0].get("url", "")
            print("错误：任务成功但未返回图片 URL", file=sys.stderr)
            sys.exit(1)
        elif status == "FAILED":
            code = output.get("code", "")
            message = output.get("message", str(output))
            print(f"错误：任务失败 [{code}] {message}", file=sys.stderr)
            sys.exit(1)
        elif status in ("PENDING", "RUNNING"):
            elapsed = int(time.time() - start)
            print(f"  等待中... ({elapsed}s)", flush=True)
        else:
            print(f"  未知状态: {status}", flush=True)

    print(f"错误：等待超时（{max_wait}秒）", file=sys.stderr)
    sys.exit(1)


def download_image(url: str, output_dir: str) -> str:
    """下载图片到指定目录，返回保存路径"""
    output_path = Path(output_dir).expanduser()
    output_path.mkdir(parents=True, exist_ok=True)

    filename = f"wanxiang_{int(time.time())}.png"
    save_path = output_path / filename

    resp = requests.get(url, timeout=60)
    resp.raise_for_status()

    with open(save_path, "wb") as f:
        f.write(resp.content)

    return str(save_path)


def main():
    parser = argparse.ArgumentParser(description="通义万象图片生成")
    parser.add_argument("prompt", help="图片描述（英文效果更好）")
    parser.add_argument("--output", default="~/Desktop", help="图片保存目录（默认：~/Desktop）")
    parser.add_argument("--size", default="1024*1024",
                        choices=["1024*1024", "720*1280", "1280*720", "768*1152", "1152*768"],
                        help="图片尺寸（默认：1024*1024）")
    args = parser.parse_args()

    api_key = get_api_key()

    print(f"提示词：{args.prompt}")
    print(f"尺寸：{args.size}")
    print(f"保存目录：{args.output}")
    print()

    # 提交任务
    task_id = submit_task(args.prompt, args.size, api_key)

    # 轮询结果
    image_url = poll_task(task_id, api_key)

    # 下载图片
    print("下载图片中...")
    save_path = download_image(image_url, args.output)

    print(f"\n✓ 图片已保存到：{save_path}")
    return save_path


if __name__ == "__main__":
    main()
