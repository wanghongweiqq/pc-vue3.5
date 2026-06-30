#!/usr/bin/env python3
"""
AI 团队启动脚本 - 为每个角色创建 iTerm2 标签页，带持久化配色 banner 和标签标题
集成 SQLite 消息队列：自动初始化 DB，每个 tab 启动后台 watcher，注入快捷命令 tm
"""
import subprocess
import sys
import time
import tempfile
import os
import plistlib
import shutil

WORKDIR    = sys.argv[1] if len(sys.argv) > 1 else "."
SCRIPT_DIR = os.path.dirname(os.path.realpath(__file__))
MSG_DIR    = os.path.join(SCRIPT_DIR, "msg")
TEAM_MSG   = os.path.join(MSG_DIR, "team-msg.sh")
WATCH_SH   = os.path.join(MSG_DIR, "watch.sh")
DB_PATH    = os.path.join(WORKDIR, "specs", ".messages.db")

ROLES = [
    {"tab": "PM",       "role": "pm",       "display": "👤 PM·产品经理", "color": "44;1;37"},
    {"tab": "Arch",     "role": "arch",     "display": "🏗 Arch·架构师", "color": "42;1;30"},
    {"tab": "Dev",      "role": "dev",      "display": "💻 Dev·开发",    "color": "43;1;30"},
    {"tab": "QA",       "role": "qa",       "display": "🧪 QA·测试",     "color": "45;1;37"},
    {"tab": "Reviewer", "role": "reviewer", "display": "🔍 Reviewer",    "color": "41;1;37"},
]

ITERM2_PLIST = os.path.expanduser("~/Library/Preferences/com.googlecode.iterm2.plist")

# ── iTerm2 标题配置修复 ────────────────────────────────────────────────────────

def fix_iterm2_title_setting():
    """将 iTerm2 Default Profile 的 Title Components 改为 Name 模式"""
    if not os.path.exists(ITERM2_PLIST):
        return False
    try:
        with open(ITERM2_PLIST, 'rb') as f:
            plist = plistlib.load(f)
        bookmarks = plist.get("New Bookmarks", [])
        changed = False
        for profile in bookmarks:
            if profile.get("Name") == "Default":
                current = profile.get("Title Components", 1)
                if current != 2:
                    profile["Title Components"] = 2
                    changed = True
                    print(f"  ✓ 已修复 iTerm2 Default Profile Title: {current} → 2 (Name)")
                else:
                    print(f"  ✓ iTerm2 Default Profile Title 已是 Name 模式，无需修改")
        if changed:
            shutil.copy2(ITERM2_PLIST, ITERM2_PLIST + ".bak")
            with open(ITERM2_PLIST, 'wb') as f:
                plistlib.dump(plist, f)
            subprocess.run(["killall", "-HUP", "iTerm2"], capture_output=True)
            time.sleep(0.5)
        return True
    except Exception as e:
        print(f"  ⚠️  修复 iTerm2 配置失败: {e}")
        return False


# ── 消息队列初始化 ─────────────────────────────────────────────────────────────

def init_message_db():
    """在工作目录创建 specs/.messages.db"""
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
        print(f"  ⚠️  消息队列初始化失败：{result.stderr.strip()}")


# ── 生成每个 tab 的启动脚本 ────────────────────────────────────────────────────

AGENT_SH = os.path.join(SCRIPT_DIR, "role-agent.sh")

# 需要传递给子 tab 的认证相关环境变量
AUTH_ENV_KEYS = [
    "ANTHROPIC_BASE_URL",
    "ANTHROPIC_AUTH_TOKEN",
    "ANTHROPIC_API_KEY",
    "ANTHROPIC_CUSTOM_HEADERS",
    "CLAUDE_CODE_ENTRYPOINT",
    "CLAUDE_CODE_EXECPATH",
    "CLAUDE_CODE_TMPDIR",
    "AI_AGENT",
    "X_CLIENT_TOKEN",
    "DASHSCOPE_API_KEY",
    "TMPDIR",
    "PATH",
    "HOME",
    "USER",
    "LANG",
    "TERM",
]

def make_tab_script(role: dict) -> str:
    tab_name = role["tab"]
    role_id  = role["role"]
    display  = role["display"]
    color    = role["color"]

    # 收集当前进程中存在的认证环境变量，注入到子 tab
    env_exports = []
    for key in AUTH_ENV_KEYS:
        val = os.environ.get(key)
        if val:
            safe_val = val.replace("'", "'\\''")
            env_exports.append(f"export {key}='{safe_val}'")
    env_block = "\n".join(env_exports)

    # 读取角色 SKILL.md 作为 system prompt
    skill_md = os.path.join(os.path.expanduser("~"), ".claude", "skills", f"team-{role_id}", "SKILL.md")
    if os.path.exists(skill_md):
        with open(skill_md, "r") as f:
            skill_content = f.read()
        # 转义反引号和双引号，写入临时文件
        prompt_file = os.path.join("/tmp", f"team_{role_id}_prompt.md")
        with open(prompt_file, "w") as f:
            f.write(skill_content)
    else:
        prompt_file = ""

    # 构建 claude 启动命令
    if prompt_file:
        claude_cmd = f"claude --append-system-prompt \"$(cat '{prompt_file}')\" --add-dir '{WORKDIR}'"
    else:
        claude_cmd = f"claude --add-dir '{WORKDIR}'"

    return f"""#!/bin/bash
# ── 标签标题 ──────────────────────────────────────────────────────────────────
printf '\\033]1;{tab_name}\\007'
printf '\\033]0;{tab_name}\\007'
export PS1='[{tab_name}] $ '

# ── 继承认证环境变量 ───────────────────────────────────────────────────────────
{env_block}

# ── 消息队列 DB 路径 ───────────────────────────────────────────────────────────
export TEAM_MSG_DB='{DB_PATH}'

# ── 初始化消息 DB（如尚未创建）────────────────────────────────────────────────
mkdir -p "$(dirname '{DB_PATH}')"
bash '{TEAM_MSG}' init 2>/dev/null || true

# ── 后台启动消息守护进程 ────────────────────────────────────────────────────────
bash '{WATCH_SH}' '{role_id}' '{DB_PATH}' &
_WATCH_PID=$!

# ── 后台启动角色自治代理（收到消息自动 claude -p 处理，输出同时打印到终端）────
_AGENT_TTY=$(tty)
bash '{AGENT_SH}' '{role_id}' '{WORKDIR}' '{DB_PATH}' 2>&1 | tee /tmp/team_{role_id}_agent.log > "$_AGENT_TTY" &
_AGENT_PID=$!

# 退出时清理后台进程
trap 'kill $_WATCH_PID $_AGENT_PID 2>/dev/null; exit' INT TERM EXIT

# ── 打印角色 banner ────────────────────────────────────────────────────────────
clear
printf '\\033[{color}m                                          \\033[0m\\n'
printf '\\033[{color}m   {display:<38}\\033[0m\\n'
printf '\\033[{color}m   工作目录: {WORKDIR:<28}\\033[0m\\n'
printf '\\033[{color}m                                          \\033[0m\\n'
echo ""
echo "  交互模式 — 直接与 Claude 对话，角色已预加载"
echo "  工作目录: {WORKDIR}"
echo "  ✓ 消息代理已启动 (watch=$_WATCH_PID agent=$_AGENT_PID)"
echo "  ✓ 收到消息将自动处理并回复 Tech Lead"
echo ""

# ── 启动交互式 Claude（预加载角色 system prompt）─────────────────────────────
{claude_cmd}

# Claude 退出后提示重启
printf '\\n\\033[{color}m  {display} — 已退出，按 Enter 重启  \\033[0m\\n'
read -r
exec "$0"
"""


# ── 主流程 ─────────────────────────────────────────────────────────────────────

print("🔧 检查 iTerm2 配置...")
fix_iterm2_title_setting()
print()

print("📦 初始化消息队列...")
init_message_db()
print()

print(f"🚀 AI Dev Team Starting... (workdir: {WORKDIR})")
print()

for role in ROLES:
    tab_name = role["tab"]
    display  = role["display"]

    # 写临时启动脚本
    tmpfile = tempfile.NamedTemporaryFile(
        mode='w', suffix='.sh', delete=False, encoding='utf-8'
    )
    tmpfile.write(make_tab_script(role))
    tmpfile.close()
    os.chmod(tmpfile.name, 0o755)

    print(f"  Starting {display}...")

    open_tab = f"""tell application "iTerm2"
    activate
    tell current window
        create tab with default profile
        tell current session
            set name to "{tab_name}"
            write text "bash {tmpfile.name}"
        end tell
    end tell
end tell"""
    subprocess.run(["osascript", "-e", open_tab], check=False)
    time.sleep(2)

print()

# ── 启动 Tech Lead 标签页（lead-watch + 交互式 Claude）───────────────────────
LEAD_WATCH_SH = os.path.join(SCRIPT_DIR, "lead-watch.sh")
LEAD_SKILL_MD = os.path.join(os.path.expanduser("~"), ".claude", "skills", "team-lead", "SKILL.md")

# 写 Tech Lead system prompt 临时文件
lead_prompt_file = ""
if os.path.exists(LEAD_SKILL_MD):
    with open(LEAD_SKILL_MD, "r") as f:
        lead_skill = f.read()
    lead_prompt_file = "/tmp/team_lead_prompt.md"
    with open(lead_prompt_file, "w") as f:
        f.write(lead_skill)

lead_claude_cmd = (
    f"claude --append-system-prompt \"$(cat '{lead_prompt_file}')\" --add-dir '{WORKDIR}'"
    if lead_prompt_file
    else f"claude --add-dir '{WORKDIR}'"
)

# 收集环境变量
env_exports_lead = []
for key in AUTH_ENV_KEYS:
    val = os.environ.get(key)
    if val:
        safe_val = val.replace("'", "'\\''")
        env_exports_lead.append(f"export {key}='{safe_val}'")
env_block_lead = "\n".join(env_exports_lead)

lead_script = f"""#!/bin/bash
printf '\\033]1;Lead\\007'
printf '\\033]0;Lead\\007'
export PS1='[Lead] $ '

{env_block_lead}

export TEAM_MSG_DB='{DB_PATH}'

# ── 后台启动 lead-watch（监听所有角色回复，自动路由）────────────────────────
bash '{LEAD_WATCH_SH}' '{WORKDIR}' > /tmp/team_lead_watch.log 2>&1 &
_LEAD_WATCH_PID=$!
trap 'kill $_LEAD_WATCH_PID 2>/dev/null; exit' INT TERM EXIT

clear
printf '\\033[47;1;30m                                          \\033[0m\\n'
printf '\\033[47;1;30m   📋 Tech Lead                            \\033[0m\\n'
printf '\\033[47;1;30m   工作目录: {WORKDIR:<28}\\033[0m\\n'
printf '\\033[47;1;30m                                          \\033[0m\\n'
echo ""
echo "  交互模式 — 直接与 Claude 对话，Tech Lead 角色已预加载"
echo "  ✓ lead-watch 已启动 (PID=$_LEAD_WATCH_PID) — 自动路由各角色回复"
echo "  ✓ 日志：/tmp/team_lead_watch.log"
echo ""

{lead_claude_cmd}

printf '\\n\\033[47;1;30m  Tech Lead — 已退出，按 Enter 重启  \\033[0m\\n'
read -r
exec "$0"
"""

lead_tmpfile = tempfile.NamedTemporaryFile(
    mode='w', suffix='.sh', delete=False, encoding='utf-8'
)
lead_tmpfile.write(lead_script)
lead_tmpfile.close()
os.chmod(lead_tmpfile.name, 0o755)

print("  Starting 📋 Tech Lead...")
open_lead_tab = f"""tell application "iTerm2"
    activate
    tell current window
        create tab with default profile
        tell current session
            set name to "Lead"
            write text "bash {lead_tmpfile.name}"
        end tell
    end tell
end tell"""
subprocess.run(["osascript", "-e", open_lead_tab], check=False)
time.sleep(2)

print()
print("✅ All roles launched! (包含 Tech Lead 窗口)")
print(f"💡 消息队列 DB：{DB_PATH}")
print( "💬 发消息：tm send <from> <to> \"<content>\"")
print( "📬 查收件：tm recv <role>")
print( "📊 全队状态：tm status")
print( "📝 Lead 路由日志：/tmp/team_lead_watch.log")
