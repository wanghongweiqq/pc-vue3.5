#!/usr/bin/env python3
"""
单角色启动脚本 - 为指定角色创建 iTerm2 标签页，自动集成消息队列
集成 watch.sh + role-agent.sh，收到消息自动 claude -p 处理并回复

用法：
  python3 launch-single-role.py <role> [workdir]

角色可选值：pm / arch / dev / qa / reviewer / lead
示例：
  python3 launch-single-role.py qa
  python3 launch-single-role.py dev ~/my-project
"""
import subprocess
import sys
import os
import time
import tempfile

# ── 参数解析 ──────────────────────────────────────────────────────────────────
if len(sys.argv) < 2:
    print("用法：python3 launch-single-role.py <role> [workdir]")
    print("角色：pm / arch / dev / qa / reviewer / lead")
    sys.exit(1)

ROLE_ID  = sys.argv[1].lower()
WORKDIR  = os.path.realpath(sys.argv[2]) if len(sys.argv) > 2 else os.getcwd()

SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
MSG_DIR    = os.path.join(SCRIPT_DIR, "msg")
TEAM_MSG   = os.path.join(MSG_DIR, "team-msg.sh")
WATCH_SH   = os.path.join(MSG_DIR, "watch.sh")
AGENT_SH   = os.path.join(SCRIPT_DIR, "role-agent.sh")
LEAD_WATCH = os.path.join(SCRIPT_DIR, "lead-watch.sh")
DB_PATH    = os.path.join(WORKDIR, "specs", ".messages.db")

# ── 角色元信息 ────────────────────────────────────────────────────────────────
ROLE_META = {
    "pm":       {"tab": "PM",       "display": "👤 PM·产品经理",  "color": "44;1;37"},
    "arch":     {"tab": "Arch",     "display": "🏗 Arch·架构师",  "color": "42;1;30"},
    "dev":      {"tab": "Dev",      "display": "💻 Dev·开发",     "color": "43;1;30"},
    "qa":       {"tab": "QA",       "display": "🧪 QA·测试",      "color": "45;1;37"},
    "reviewer": {"tab": "Reviewer", "display": "🔍 Reviewer",     "color": "41;1;37"},
    "lead":     {"tab": "Lead",     "display": "📋 Tech Lead",    "color": "47;1;30"},
}

if ROLE_ID not in ROLE_META:
    print(f"❌ 未知角色：{ROLE_ID}")
    print(f"可用角色：{', '.join(ROLE_META.keys())}")
    sys.exit(1)

meta     = ROLE_META[ROLE_ID]
TAB_NAME = meta["tab"]
DISPLAY  = meta["display"]
COLOR    = meta["color"]

# ── 需要继承的认证环境变量 ─────────────────────────────────────────────────────
AUTH_ENV_KEYS = [
    "ANTHROPIC_BASE_URL", "ANTHROPIC_AUTH_TOKEN", "ANTHROPIC_API_KEY",
    "ANTHROPIC_CUSTOM_HEADERS", "CLAUDE_CODE_ENTRYPOINT", "CLAUDE_CODE_EXECPATH",
    "CLAUDE_CODE_TMPDIR", "AI_AGENT", "X_CLIENT_TOKEN", "DASHSCOPE_API_KEY",
    "TMPDIR", "PATH", "HOME", "USER", "LANG", "TERM",
]

env_exports = []
for key in AUTH_ENV_KEYS:
    val = os.environ.get(key)
    if val:
        safe_val = val.replace("'", "'\\''")
        env_exports.append(f"export {key}='{safe_val}'")
env_block = "\n".join(env_exports)

# ── 初始化消息 DB ─────────────────────────────────────────────────────────────
specs_dir = os.path.join(WORKDIR, "specs")
os.makedirs(specs_dir, exist_ok=True)
result = subprocess.run(
    ["bash", TEAM_MSG, "init"],
    env={**os.environ, "TEAM_MSG_DB": DB_PATH},
    capture_output=True, text=True
)
if result.returncode == 0:
    print(f"  ✓ 消息队列 DB 已就绪：{DB_PATH}")
else:
    print(f"  ⚠️  消息队列初始化：{result.stderr.strip() or '已存在，跳过'}")

# ── 读取角色 SKILL.md，追加消息队列回复指令，写入临时 prompt 文件 ──────────────
skill_md = os.path.join(os.path.expanduser("~"), ".claude", "skills", f"team-{ROLE_ID}", "SKILL.md")
prompt_file = ""
if os.path.exists(skill_md):
    with open(skill_md) as f:
        skill_content = f.read()

    # 追加消息队列自动回复指令
    skill_content += f"""

---
## 消息队列协作规则

你在一个多角色 AI 团队中工作。当你收到以「【来自 <角色名>】」开头的消息时，这是来自队友通过消息队列发来的任务。

**处理规则：**
1. 正常回复该消息
2. 回复完成后，**必须立即执行以下 Bash 命令**，把你的回复写回消息队列：
   ```
   TEAM_MSG_DB='{DB_PATH}' bash '{TEAM_MSG}' send {ROLE_ID} <发送方角色名> "<你的回复内容>"
   ```
   - 发送方角色名从「【来自 xxx】」中提取
   - 回复内容是你刚才输出的核心内容（单行，不含 markdown）

**示例：**
收到「【来自 lead】今天工作状态怎么样？」后，回复完毕执行：
```
TEAM_MSG_DB='{DB_PATH}' bash '{TEAM_MSG}' send {ROLE_ID} lead "状态良好，随时待命！"
```
"""

    prompt_file = f"/tmp/team_{ROLE_ID}_prompt.md"
    with open(prompt_file, "w") as f:
        f.write(skill_content)

claude_cmd = (
    f"claude --append-system-prompt \"$(cat '{prompt_file}')\" --dangerously-skip-permissions --add-dir '{WORKDIR}'"
    if prompt_file
    else f"claude --dangerously-skip-permissions --add-dir '{WORKDIR}'"
)

# ── 构建标签页启动脚本 ─────────────────────────────────────────────────────────
if ROLE_ID == "lead":
    # Tech Lead：启动 lead-watch（路由器）+ 交互式 Claude
    bg_block = f"""
# ── 后台启动 lead-watch（监听所有角色回复，自动路由）────────────────────────
bash '{LEAD_WATCH}' '{WORKDIR}' > /tmp/team_lead_watch.log 2>&1 &
_LEAD_WATCH_PID=$!
trap 'kill $_LEAD_WATCH_PID 2>/dev/null; exit' INT TERM EXIT
"""
    agent_hint = "  ✓ lead-watch 已启动 (PID=$_LEAD_WATCH_PID) — 自动路由各角色回复"
    agent_log  = "  ✓ 路由日志：/tmp/team_lead_watch.log"
else:
    # 普通角色：启动 watch（通知）+ role-agent（自动处理，输出同时显示在终端）
    bg_block = f"""
# ── 后台启动消息守护进程（通知 + inbox）──────────────────────────────────────
bash '{WATCH_SH}' '{ROLE_ID}' '{DB_PATH}' &
_WATCH_PID=$!

# ── 后台启动角色自治代理（收到消息自动 claude -p 处理，输出同时打印到终端）────
_AGENT_TTY=$(tty)
bash '{AGENT_SH}' '{ROLE_ID}' '{WORKDIR}' '{DB_PATH}' 2>&1 | tee /tmp/team_{ROLE_ID}_agent.log > "$_AGENT_TTY" &
_AGENT_PID=$!

trap 'kill $_WATCH_PID $_AGENT_PID 2>/dev/null; exit' INT TERM EXIT
"""
    agent_hint = "  ✓ 消息代理已启动 (watch=$_WATCH_PID agent=$_AGENT_PID)"
    agent_log  = f"  ✓ 收到消息时将在此窗口直接显示处理过程"

# ── session 文件路径（与 role-agent 共享同一个）─────────────────────────────
SESSION_FILE_PATH = os.path.join(os.path.dirname(DB_PATH), f"session_{ROLE_ID}.id")

# ── 上方 pane：交互式 Claude（优先 resume 同一 session）─────────────────────
claude_script = f"""#!/bin/bash
printf '\\033]1;{TAB_NAME}\\007'
printf '\\033]0;{TAB_NAME}\\007'
export PS1='[{TAB_NAME}] $ '
{env_block}
export TEAM_MSG_DB='{DB_PATH}'
mkdir -p "$(dirname '{DB_PATH}')"
bash '{TEAM_MSG}' init 2>/dev/null || true

clear
printf '\\033[{COLOR}m                                          \\033[0m\\n'
printf '\\033[{COLOR}m   {DISPLAY:<38}\\033[0m\\n'
printf '\\033[{COLOR}m   工作目录: {WORKDIR:<28}\\033[0m\\n'
printf '\\033[{COLOR}m                                          \\033[0m\\n'
echo ""
echo "  交互模式 — 与下方消息代理共享同一对话上下文"
echo "  工作目录: {WORKDIR}"
echo ""

# ── 把上方 pane 的 tty 写入文件，供 role-agent 注入消息使用 ──────────────────
echo "$(tty)" > '{SESSION_FILE_PATH}.tty'

# ── 优先 resume 已有 session，保持与 role-agent 上下文一致 ──────────────────
_SESSION_FILE='{SESSION_FILE_PATH}'
if [[ -f "$_SESSION_FILE" ]]; then
  _SESSION_ID=$(cat "$_SESSION_FILE")
  echo "  ↩ 接续会话 ${{_SESSION_ID:0:8}}..."
  echo ""
  claude --resume "$_SESSION_ID" --dangerously-skip-permissions --add-dir '{WORKDIR}'
else
  echo "  ✨ 新建会话"
  echo ""
  {claude_cmd}
fi

printf '\\n\\033[{COLOR}m  {DISPLAY} — 已退出，按 Enter 重启  \\033[0m\\n'
read -r
exec "$0"
"""

# ── 下方 pane：role-agent（或 lead-watch）────────────────────────────────────
if ROLE_ID == "lead":
    agent_script = f"""#!/bin/bash
export PS1='[Lead-Watch] $ '
{env_block}
export TEAM_MSG_DB='{DB_PATH}'
printf '\\033[47;1;30m  📋 Tech Lead — 消息路由                    \\033[0m\\n'
echo ""
bash '{LEAD_WATCH}' '{WORKDIR}'
"""
else:
    agent_script = f"""#!/bin/bash
export PS1='[{TAB_NAME}-Agent] $ '
{env_block}
export TEAM_MSG_DB='{DB_PATH}'
bash '{WATCH_SH}' '{ROLE_ID}' '{DB_PATH}' &
_WATCH_PID=$!
trap 'kill $_WATCH_PID 2>/dev/null; exit' INT TERM EXIT
bash '{AGENT_SH}' '{ROLE_ID}' '{WORKDIR}' '{DB_PATH}'
"""

# 写两个临时脚本
claude_tmp = tempfile.NamedTemporaryFile(mode='w', suffix='.sh', delete=False, encoding='utf-8')
claude_tmp.write(claude_script)
claude_tmp.close()
os.chmod(claude_tmp.name, 0o755)

agent_tmp = tempfile.NamedTemporaryFile(mode='w', suffix='.sh', delete=False, encoding='utf-8')
agent_tmp.write(agent_script)
agent_tmp.close()
os.chmod(agent_tmp.name, 0o755)

print(f"  Starting {DISPLAY}...")

# osascript：新建标签页 → 上方跑 claude → 水平分割 → 下方跑 role-agent
open_tab = f"""tell application "iTerm2"
    activate
    tell current window
        create tab with default profile
        tell current tab
            tell current session
                set name to "{TAB_NAME}"
                write text "bash {claude_tmp.name}"
                set newPane to (split horizontally with default profile)
            end tell
            tell newPane
                write text "bash {agent_tmp.name}"
            end tell
        end tell
    end tell
end tell"""
subprocess.run(["osascript", "-e", open_tab], check=False)
time.sleep(1)

print(f"✅ {DISPLAY} 窗口已启动（上：交互式 Claude｜下：消息代理）")
print(f"💡 消息队列 DB：{DB_PATH}")
print()
print("💬 发消息给此角色：")
print(f"   TEAM_MSG_DB='{DB_PATH}' bash '{TEAM_MSG}' send lead {ROLE_ID} \"你的消息\"")
