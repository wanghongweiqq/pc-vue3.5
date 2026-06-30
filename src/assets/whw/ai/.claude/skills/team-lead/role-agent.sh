#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# role-agent.sh — 自治角色代理
#
# 持续监听消息队列，收到任务后自动调用 claude -p 处理，无需人工干预
#
# 用法：role-agent.sh <role> <workdir> <db_path>
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

ROLE="${1:-}"
WORKDIR="${2:-$PWD}"
DB="${3:-$WORKDIR/specs/.messages.db}"

[[ -n "$ROLE" ]] || { echo "用法：role-agent.sh <role> <workdir> [db_path]" >&2; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEAM_MSG="$SCRIPT_DIR/msg/team-msg.sh"
SKILL_MD="$HOME/.claude/skills/team-$ROLE/SKILL.md"

export TEAM_MSG_DB="$DB"

# ── Session 持久化路径（存到 specs/ 目录，重启后继续上下文）──────────────────
SESSION_DIR="$(dirname "$DB")"
SESSION_FILE="${SESSION_DIR}/session_${ROLE}.id"

# ── 颜色 ──────────────────────────────────────────────────────────────────────
role_color() {
  case "$1" in
    pm)       printf '\033[44;1;37m' ;;
    arch)     printf '\033[42;1;30m' ;;
    dev)      printf '\033[43;1;30m' ;;
    qa)       printf '\033[45;1;37m' ;;
    reviewer) printf '\033[41;1;37m' ;;
    *)        printf '\033[0m' ;;
  esac
}
role_emoji() {
  case "$1" in
    pm)       echo "👤 PM·产品经理" ;;
    arch)     echo "🏗 Arch·架构师" ;;
    dev)      echo "💻 Dev·开发工程师" ;;
    qa)       echo "🧪 QA·测试工程师" ;;
    reviewer) echo "🔍 Reviewer·代码审查" ;;
    *)        echo "$1" ;;
  esac
}

NC='\033[0m'; BOLD='\033[1m'; DIM='\033[2m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'

COLOR=$(role_color "$ROLE")
DISPLAY=$(role_emoji "$ROLE")

# ── 加载角色系统提示 ───────────────────────────────────────────────────────────
if [[ -f "$SKILL_MD" ]]; then
  ROLE_CONTEXT=$(cat "$SKILL_MD")
else
  ROLE_CONTEXT="你是 AI 开发团队中的 $ROLE 角色，请按职责完成任务。"
fi

# 追加工具提示
ROLE_CONTEXT="${ROLE_CONTEXT}

---
## 工作目录与消息队列
- 工作目录：${WORKDIR}
- specs/ 目录用于团队共享上下文
- 消息队列命令（在 Bash 中执行）：
  \`TEAM_MSG_DB=${DB} bash ${TEAM_MSG} send ${ROLE} <to> \"<消息>\"\`
  例如通知 arch：\`TEAM_MSG_DB=${DB} bash ${TEAM_MSG} send ${ROLE} arch \"PRD已完成，请查收specs/prd/login.md\"\`
- 可用角色：pm / arch / dev / qa / reviewer
"

# ── 等待 DB 就绪 ───────────────────────────────────────────────────────────────
wait_db() {
  local i=0
  while [[ ! -f "$DB" ]]; do
    (( i++ )); [[ $i -gt 30 ]] && { echo "超时：DB 未就绪" >&2; exit 1; }
    sleep 1
  done
}

# ── 打印 banner ────────────────────────────────────────────────────────────────
print_banner() {
  clear
  printf "${COLOR}                                          ${NC}\n"
  printf "${COLOR}   %-38s ${NC}\n" "$DISPLAY"
  printf "${COLOR}   %-38s ${NC}\n" "WORKDIR: $WORKDIR"
  printf "${COLOR}                                          ${NC}\n"
  echo ""
  echo -e "${DIM}  自治模式 — 收到消息后自动调用 Claude 处理${NC}"
  echo -e "${DIM}  消息队列：$DB${NC}"
  echo ""
}

# ── 处理单条消息：用 claude -p --resume 接续 session，回复写回队列 ─────────────
handle_message() {
  local id="$1" from="$2" content="$3"

  echo ""
  echo -e "${BOLD}${COLOR} 📬 收到消息 #${id} 来自 ${from} ${NC}${BOLD}"
  echo -e "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${content}"
  echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "${YELLOW}⚡ 正在处理（接续上方 Claude 的对话）...${NC}"
  echo ""

  # ── 构建 claude -p 调用，resume 上方 Claude 的 session ──────────────────────
  CLAUDE_ARGS=(
    -p "${content}"
    --dangerously-skip-permissions
    --add-dir "${WORKDIR}"
    --output-format json
  )

  if [[ -f "${SESSION_FILE}" ]]; then
    SAVED_SESSION=$(cat "${SESSION_FILE}")
    CLAUDE_ARGS+=(--resume "${SAVED_SESSION}")
    echo -e "${DIM}  ↩ 接续会话 ${SAVED_SESSION:0:8}...${NC}"
  else
    CLAUDE_ARGS+=(--append-system-prompt "${ROLE_CONTEXT}")
  fi

  RAW_JSON=$(claude "${CLAUDE_ARGS[@]}" 2>&1)

  # 解析 session_id，更新到文件（上方 Claude 下次 resume 时也会看到最新历史）
  NEW_SESSION=$(echo "${RAW_JSON}" | python3 -c \
    "import sys,json; d=json.load(sys.stdin); print(d.get('session_id',''))" 2>/dev/null || true)
  if [[ -n "${NEW_SESSION}" ]]; then
    echo "${NEW_SESSION}" > "${SESSION_FILE}"
  fi

  # 解析回复文本并展示
  REPLY=$(echo "${RAW_JSON}" | python3 -c \
    "import sys,json; d=json.load(sys.stdin); print(d.get('result',''))" 2>/dev/null || echo "${RAW_JSON}")
  echo -e "${REPLY}"

  # 写回消息队列
  if [[ -n "${REPLY}" ]]; then
    REPLY_SINGLE=$(echo "${REPLY}" | tr '\n' ' ' | sed 's/  */ /g; s/^ //; s/ $//')
    bash "${TEAM_MSG}" send "${ROLE}" "${from}" "${REPLY_SINGLE}" 2>/dev/null || true
    echo -e "${DIM}  → 回复已写入消息队列 (to: ${from})${NC}"
  fi

  echo ""
  echo -e "${GREEN}✅ 消息 #${id} 处理完毕${NC}"
  echo -e "${DIM}──────────────────────────────────────────${NC}"
  echo -e "${DIM}  提示：上方 Claude 退出后重启可看到最新对话${NC}"
  echo ""
}

# ── 主循环 ─────────────────────────────────────────────────────────────────────
print_banner
wait_db

# 从最后一条已读消息之后开始，确保未读消息能被捕获
LAST_ID=$(sqlite3 "$DB" \
  "SELECT COALESCE(MAX(id),0) FROM messages WHERE to_role='$ROLE' AND read=1;" 2>/dev/null || true)
LAST_ID="${LAST_ID:-0}"  # 防止空值导致后续 SQL 语法错误

echo -e "${DIM}  已就绪，从消息 ID>${LAST_ID} 开始监听（含未读）...${NC}"
echo ""

while true; do
  # 用 JSON 格式查询，避免内容含换行时分隔符解析错误
  ROW_JSON=$(sqlite3 -json "$DB" \
    "SELECT id, from_role, content FROM messages
     WHERE to_role='$ROLE' AND read=0 AND id > $LAST_ID
     ORDER BY id ASC LIMIT 1;" 2>/dev/null || true)

  if [[ -n "$ROW_JSON" && "$ROW_JSON" != "[]" ]]; then
    MSG_ID=$(echo "$ROW_JSON"      | python3 -c "import sys,json; r=json.load(sys.stdin); print(r[0]['id'])" 2>/dev/null || true)
    MSG_FROM=$(echo "$ROW_JSON"    | python3 -c "import sys,json; r=json.load(sys.stdin); print(r[0]['from_role'])" 2>/dev/null || true)
    MSG_CONTENT=$(echo "$ROW_JSON" | python3 -c "import sys,json; r=json.load(sys.stdin); print(r[0]['content'])" 2>/dev/null || true)

    if [[ -z "$MSG_ID" ]]; then
      sleep 2; continue
    fi

    # 标记已读
    sqlite3 "$DB" "UPDATE messages SET read=1 WHERE id=${MSG_ID};" 2>/dev/null || true
    LAST_ID=$MSG_ID

    # 发送系统通知
    osascript -e "display notification \"来自 ${MSG_FROM} 的新任务\" with title \"🤖 ${DISPLAY}\"" 2>/dev/null || true

    # 处理消息
    handle_message "$MSG_ID" "$MSG_FROM" "$MSG_CONTENT"
  fi

  sleep 2
done
