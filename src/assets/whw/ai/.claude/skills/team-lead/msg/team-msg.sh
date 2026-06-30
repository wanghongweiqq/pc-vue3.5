#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# team-msg.sh  —  AI 开发团队 SQLite 消息队列
#
# 用法：
#   team-msg.sh init                          初始化数据库（建表）
#   team-msg.sh send <from> <to> <content>    发送消息，可附加产物文件路径
#                    [file1 file2 ...]
#   team-msg.sh recv <role>                   读取未读消息并标记为已读
#   team-msg.sh peek <role>                   读取未读消息但不标记已读
#   team-msg.sh watch <role>                  阻塞等待新消息（每秒轮询）
#   team-msg.sh history                       显示全部消息记录
#   team-msg.sh status                        显示各角色未读消息数
#   team-msg.sh clear                         清空所有消息（危险）
#
# 环境变量：
#   TEAM_MSG_DB   数据库路径，默认 ./specs/.messages.db
#
# 依赖：sqlite3（系统自带）
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── 颜色 ──────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; YELLOW='\033[1;33m'; GREEN='\033[0;32m'
CYAN='\033[0;36m'; BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'

# ── 角色 → 颜色映射 ────────────────────────────────────────────────────────────
role_color() {
  case "$1" in
    pm)       echo '\033[44;1;37m' ;;   # 蓝底白字
    arch)     echo '\033[42;1;30m' ;;   # 绿底黑字
    dev)      echo '\033[43;1;30m' ;;   # 黄底黑字
    qa)       echo '\033[45;1;37m' ;;   # 紫底白字
    reviewer) echo '\033[41;1;37m' ;;   # 红底白字
    *)        echo '\033[0m'        ;;
  esac
}

role_emoji() {
  case "$1" in
    pm)       echo "👤" ;;
    arch)     echo "🏗" ;;
    dev)      echo "💻" ;;
    qa)       echo "🧪" ;;
    reviewer) echo "🔍" ;;
    *)        echo "📬" ;;
  esac
}

# ── 数据库路径 ─────────────────────────────────────────────────────────────────
DB="${TEAM_MSG_DB:-./specs/.messages.db}"

# ── 工具函数 ───────────────────────────────────────────────────────────────────
die()  { echo -e "${RED}[team-msg] error: $*${NC}" >&2; exit 1; }
info() { echo -e "${CYAN}[team-msg]${NC} $*"; }

# 确保 sqlite3 可用
require_sqlite() {
  command -v sqlite3 >/dev/null 2>&1 || die "sqlite3 未找到，请先安装：brew install sqlite"
}

# 确保 DB 存在
require_db() {
  [[ -f "$DB" ]] || die "数据库不存在：$DB\n请先运行：team-msg.sh init"
}

# 执行 SQL，始终输出竖线分隔
sql() {
  sqlite3 -separator '|' "$DB" "$@"
}

# ── 子命令实现 ─────────────────────────────────────────────────────────────────

cmd_init() {
  require_sqlite
  mkdir -p "$(dirname "$DB")"
  sql <<'SQL'
CREATE TABLE IF NOT EXISTS messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  from_role   TEXT    NOT NULL,
  to_role     TEXT    NOT NULL,
  content     TEXT    NOT NULL,
  artifacts   TEXT    DEFAULT '',      -- 空格分隔的产物文件路径列表
  created_at  TEXT    DEFAULT (datetime('now','localtime')),
  read        INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_to_read ON messages(to_role, read);
SQL
  info "✅ 数据库已就绪：${BOLD}$DB${NC}"
}

cmd_send() {
  require_sqlite
  require_db
  local from="${1:-}"; shift || true
  local to="${1:-}";   shift || true
  local content="${1:-}"; shift || true
  local artifacts="${*:-}"      # 剩余参数为产物文件路径

  [[ -n "$from" ]]    || die "缺少 <from> 参数"
  [[ -n "$to" ]]      || die "缺少 <to> 参数"
  [[ -n "$content" ]] || die "缺少 <content> 参数"

  local id
  id=$(sql "INSERT INTO messages(from_role, to_role, content, artifacts)
             VALUES('$from', '$to', '$(echo "$content" | sed "s/'/''/g")', '$(echo "$artifacts" | sed "s/'/''/g")');
             SELECT last_insert_rowid();")

  local from_c; from_c=$(role_color "$from")
  local to_c;   to_c=$(role_color "$to")
  local emoji_from; emoji_from=$(role_emoji "$from")
  local emoji_to;   emoji_to=$(role_emoji "$to")

  echo -e "${BOLD}#${id}${NC} ${from_c} ${emoji_from} $(echo "$from" | tr '[:lower:]' '[:upper:]') ${NC} → ${to_c} ${emoji_to} $(echo "$to" | tr '[:lower:]' '[:upper:]') ${NC}"
  echo -e "   ${DIM}$(date '+%H:%M:%S')${NC} $content"
  [[ -n "$artifacts" ]] && echo -e "   ${DIM}📎 $artifacts${NC}"
}

_print_rows() {
  # 每行格式: id|from|to|content|artifacts|created_at|read
  while IFS='|' read -r id from to content artifacts created_at read_flag; do
    local from_c; from_c=$(role_color "$from")
    local to_c;   to_c=$(role_color "$to")
    local emoji_from; emoji_from=$(role_emoji "$from")
    local emoji_to;   emoji_to=$(role_emoji "$to")
    local read_mark; read_mark=$([[ "$read_flag" == "1" ]] && echo "${DIM}[已读]${NC}" || echo "${GREEN}[NEW]${NC}")

    echo -e "${BOLD}#${id}${NC} ${DIM}${created_at}${NC} ${read_mark}"
    echo -e "   ${from_c} ${emoji_from} $(echo "$from" | tr '[:lower:]' '[:upper:]') ${NC} → ${to_c} ${emoji_to} $(echo "$to" | tr '[:lower:]' '[:upper:]') ${NC}"
    echo -e "   ${content}"
    [[ -n "$artifacts" ]] && echo -e "   ${DIM}📎 $artifacts${NC}"
    echo ""
  done
}

cmd_recv() {
  require_sqlite; require_db
  local role="${1:-}"; [[ -n "$role" ]] || die "缺少 <role> 参数"

  local rows
  rows=$(sql "SELECT id, from_role, to_role, content, artifacts, created_at, read
              FROM messages
              WHERE to_role='$role' AND read=0
              ORDER BY id ASC;")

  if [[ -z "$rows" ]]; then
    info "$(role_emoji "$role") $role 暂无未读消息"
    return 0
  fi

  echo -e "\n${BOLD}📬 $(echo "$role" | tr '[:lower:]' '[:upper:]') 的未读消息${NC}\n"
  echo "$rows" | _print_rows

  # 标记为已读
  sql "UPDATE messages SET read=1 WHERE to_role='$role' AND read=0;"
  info "已标记为已读 ✓"
}

cmd_peek() {
  require_sqlite; require_db
  local role="${1:-}"; [[ -n "$role" ]] || die "缺少 <role> 参数"

  local rows
  rows=$(sql "SELECT id, from_role, to_role, content, artifacts, created_at, read
              FROM messages
              WHERE to_role='$role' AND read=0
              ORDER BY id ASC;")

  if [[ -z "$rows" ]]; then
    info "$(role_emoji "$role") $role 暂无未读消息"
    return 0
  fi

  echo -e "\n${BOLD}📬 $(echo "$role" | tr '[:lower:]' '[:upper:]') 的未读消息（未标记已读）${NC}\n"
  echo "$rows" | _print_rows
}

cmd_watch() {
  require_sqlite; require_db
  local role="${1:-}"; [[ -n "$role" ]] || die "缺少 <role> 参数"

  local emoji; emoji=$(role_emoji "$role")
  echo -e "${DIM}[team-msg] ${emoji} 监听 $role 的消息... (Ctrl+C 退出)${NC}"

  while true; do
    local count
    count=$(sql "SELECT COUNT(*) FROM messages WHERE to_role='$role' AND read=0;")
    if [[ "$count" -gt 0 ]]; then
      # 触发系统通知（macOS）
      osascript -e "display notification \"$role 有 $count 条新消息\" with title \"🤖 AI 团队\"" 2>/dev/null || true
      # 打印消息
      cmd_recv "$role"
      return 0
    fi
    sleep 1
  done
}

cmd_history() {
  require_sqlite; require_db

  local rows
  rows=$(sql "SELECT id, from_role, to_role, content, artifacts, created_at, read
              FROM messages ORDER BY id ASC;")

  if [[ -z "$rows" ]]; then
    info "暂无消息记录"
    return 0
  fi

  echo -e "\n${BOLD}📜 完整消息记录${NC}\n"
  echo "$rows" | _print_rows
}

cmd_status() {
  require_sqlite; require_db

  echo -e "\n${BOLD}📊 各角色未读消息数${NC}\n"
  sql "SELECT to_role, COUNT(*) as unread
       FROM messages WHERE read=0
       GROUP BY to_role
       ORDER BY to_role;" \
  | while IFS='|' read -r role count; do
      local emoji; emoji=$(role_emoji "$role")
      local color; color=$(role_color "$role")
      echo -e "  ${color} ${emoji} $(printf '%-10s' "$(echo "$role" | tr '[:lower:]' '[:upper:]')") ${NC}  ${BOLD}${count}${NC} 条未读"
    done

  # 如果没有任何未读，也提示一下
  local total
  total=$(sql "SELECT COUNT(*) FROM messages WHERE read=0;")
  [[ "$total" -eq 0 ]] && info "✅ 所有角色均无未读消息"
  echo ""
}

cmd_clear() {
  require_sqlite; require_db
  echo -e "${YELLOW}⚠️  即将清空所有消息，确认？(y/N)${NC} " >&2
  read -r confirm
  if [[ "$confirm" =~ ^[yY]$ ]]; then
    sql "DELETE FROM messages;"
    info "✅ 消息队列已清空"
  else
    info "取消"
  fi
}

# ── 路由 ───────────────────────────────────────────────────────────────────────
CMD="${1:-help}"; shift 2>/dev/null || true

case "$CMD" in
  init)    cmd_init ;;
  send)    cmd_send "$@" ;;
  recv)    cmd_recv "$@" ;;
  peek)    cmd_peek "$@" ;;
  watch)   cmd_watch "$@" ;;
  history) cmd_history ;;
  status)  cmd_status ;;
  clear)   cmd_clear ;;
  help|--help|-h)
    cat <<'HELP'
用法：team-msg.sh <command> [args...]

  init                          初始化数据库
  send <from> <to> <msg> [files...]  发送消息，可附加产物文件路径
  recv <role>                   读取未读消息（标记已读）
  peek <role>                   读取未读消息（不标记）
  watch <role>                  阻塞等待新消息（每秒轮询）
  history                       显示全部消息记录
  status                        显示各角色未读数
  clear                         清空所有消息

环境变量：
  TEAM_MSG_DB   DB 路径，默认 ./specs/.messages.db

示例：
  team-msg.sh init
  team-msg.sh send pm arch "PRD 已完成" specs/prd/login.md
  team-msg.sh recv arch
  team-msg.sh watch dev    # 阻塞直到 dev 有新消息
  team-msg.sh status
HELP
    ;;
  *)
    die "未知命令：$CMD\n运行 team-msg.sh help 查看用法"
    ;;
esac
