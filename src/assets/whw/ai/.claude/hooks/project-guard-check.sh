#!/bin/bash
# project-guard 白名单检查
# 读取 stdin JSON，提取 file_path，白名单内的路径不注入 project-guard 提醒

python3 -c "
import json, sys, os

data = json.load(sys.stdin)
ti = data.get('tool_input', {})
fp = ti.get('file_path', '') or ti.get('notebook_path', '')
fp = os.path.expanduser(fp) if fp else ''

# 白名单：这些目录下的文件不需要 project-guard 检查
whitelist = [
    os.path.expanduser('~/.claude/'),   # Claude 配置/技能/内存文件
]

if fp and any(fp.startswith(w) for w in whitelist):
    # 白名单内，静默通过
    print(json.dumps({}))
else:
    # 非白名单，注入 project-guard 提醒
    print(json.dumps({
        'hookSpecificOutput': {
            'hookEventName': 'PreToolUse',
            'additionalContext': '[project-guard] 在执行写文件操作前，请先调用 project-guard skill 进行前置检查（如已在本次任务中执行过则无需重复）。'
        }
    }))
"
