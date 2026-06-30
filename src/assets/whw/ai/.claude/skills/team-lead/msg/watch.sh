#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# watch.sh — AI 团队消息守护进程
#
# 在角色窗口后台运行，收到新消息时：
#   1. 打印彩色提醒到终端（即使 Claude 正在运行也会显示）
#   2. 发送 macOS 系统通知
#   3. 将消息写入 .inbox/<role>/latest.json 供 Claude 主动 poll
#
# 用法：
#   watch.sh <role> [db_path]
#   # 或通过环境变量：TEAM_MSG_DB=xxx watch.sh <role>
#
# 通常由 launch_team.py 在每个标签页后台自动启动。
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

ROLE="${1:-}"; [[ -n "$ROLE" ]] || { echo "用法：watch.sh <role> [db_path]" >&2; exit 1; }
DB="${2:-${TEAM_MSG_DB:-./specs/.messages.db}}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEAM_MSG="$SCRIPT_DIR/team-msg.sh"

# 颜色
BOLD='\033[1m'; YELLOW='\033[1;33m'; NC='\033[0m'; DIM='\033[2m'

# 等待 DB 文件出现（最多 30 秒）
wait_for_db() {
  local i=0
  while [[ ! -f "$DB" ]]; do
    (( i++ ))
    [[ $i -gt 30 ]] && { echo -e "${YELLOW}[watch] 超时：DB 未找到 $DB${NC}" >&2; exit 1; }
    sleep 1
  done
}

# 发送 macOS 系统通知（失败不报错）
notify_macos() {
  local title="$1" body="$2"
  osascript -e "display notification \"$body\" with title \"$title\"" 2>/dev/null || true
}

# 把最新未读消息写入 inbox 文件，供 Claude 在提示词里引用
write_inbox() {
  local inbox_dir; inbox_dir="$(dirname "$DB")/.inbox/$ROLE"
  mkdir -p "$inbox_dir"
  sqlite3 -json "$DB" \
    "SELECT id, from_role, content, artifacts, created_at
     FROM messages WHERE to_role='$ROLE' AND read=0
     ORDER BY id ASC;" \
  > "$inbox_dir/latest.json" 2>/dev/null || true
}

# ── 主循环 ─────────────────────────────────────────────────────────────────────
export TEAM_MSG_DB="$DB"

echo -e "${DIM}[watch:$ROLE] 启动，监听 $DB${NC}"
wait_for_db

LAST_ID=0
# 初始化：记录当前最大已处理 ID（避免重启后重复通知历史消息）
LAST_ID=$(sqlite3 "$DB" \
  "SELECT COALESCE(MAX(id),0) FROM messages WHERE to_role='$ROLE';" 2>/dev/null || echo 0)

while true; do
  # 查询比 LAST_ID 更新的未读消息
  NEW=$(sqlite3 -separator '|' "$DB" \
    "SELECT id, from_role, content, artifacts
     FROM messages
     WHERE to_role='$ROLE' AND read=0 AND id > $LAST_ID
     ORDER BY id ASC;" 2>/dev/null || true)

  if [[ -n "$NEW" ]]; then
    COUNT=$(echo "$NEW" | wc -l | tr -d ' ')

    # ── 终端打印 ──────────────────────────────────────────────────────────────
    echo ""
    echo -e "${BOLD}╔══════════════════════════════════════╗${NC}"
    echo -e "${BOLD}║  📬 $ROLE 收到 ${COUNT} 条新消息               ║${NC}"
    echo -e "${BOLD}╚══════════════════════════════════════╝${NC}"

    while IFS='|' read -r id from content artifacts; do
      echo -e "  ${BOLD}#${id}${NC} 来自 ${BOLD}${from}${NC}"
      echo -e "  📝 ${content}"
      [[ -n "$artifacts" ]] && echo -e "  📎 ${DIM}${artifacts}${NC}"
      echo ""
      LAST_ID=$id
    done <<< "$NEW"

    echo -e "  ${DIM}运行 team-msg.sh recv $ROLE 查看完整消息${NC}"
    echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    # ── 系统通知 ──────────────────────────────────────────────────────────────
    FIRST_FROM=$(echo "$NEW" | head -1 | cut -d'|' -f2)
    FIRST_MSG=$(echo  "$NEW" | head -1 | cut -d'|' -f3 | cut -c1-60)
    notify_macos "🤖 AI 团队 → $ROLE" "${FIRST_FROM}: ${FIRST_MSG}"

    # ── 写 inbox 文件 ─────────────────────────────────────────────────────────
    write_inbox
  fi

  sleep 1
done
