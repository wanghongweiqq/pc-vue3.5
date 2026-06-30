#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# lead-watch.sh — Tech Lead 消息监听与任务分发
#
# 监听所有角色发给 lead 的消息，自动路由并分配任务
#
# 用法：lead-watch.sh [workdir]
# ─────────────────────────────────────────────────────────────────────────────

WORKDIR="${1:-/Users/wb_wanghongwei06/Desktop/ai-project}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEAM_MSG="$SCRIPT_DIR/msg/team-msg.sh"
DB="$WORKDIR/specs/.messages.db"
export TEAM_MSG_DB="$DB"

# ── 颜色 ──────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'
BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'
LEAD_COLOR='\033[47;1;30m'  # 白底黑字

role_emoji() {
  case "$1" in
    pm)       echo "👤 PM" ;;
    arch)     echo "🏗 Arch" ;;
    dev)      echo "💻 Dev" ;;
    qa)       echo "🧪 QA" ;;
    reviewer) echo "🔍 Reviewer" ;;
    *)        echo "📬 $1" ;;
  esac
}

# ── Banner ─────────────────────────────────────────────────────────────────────
clear
printf "${LEAD_COLOR}                                              ${NC}\n"
printf "${LEAD_COLOR}   📋 Tech Lead — 消息监听 & 任务分发          ${NC}\n"
printf "${LEAD_COLOR}   工作目录: %-34s ${NC}\n" "$WORKDIR"
printf "${LEAD_COLOR}                                              ${NC}\n"
echo ""
echo -e "${DIM}  监听发给 lead 的消息，自动路由分配...${NC}"
echo -e "${DIM}  消息队列：$DB${NC}"
echo -e "${DIM}  按 Ctrl+C 退出${NC}"
echo ""

# ── 等待 DB ───────────────────────────────────────────────────────────────────
wait_db() {
  local i=0
  while [[ ! -f "$DB" ]]; do
    (( i++ )); [[ $i -gt 30 ]] && { echo "超时：DB 未就绪" >&2; exit 1; }
    echo -e "${DIM}  等待消息队列就绪...${NC}"
    sleep 1
  done
}
wait_db

# 从当前最大消息 ID 开始监听（只处理新消息）
LAST_ID=$(sqlite3 "$DB" \
  "SELECT COALESCE(MAX(id),0) FROM messages;" 2>/dev/null || echo 0)

echo -e "${DIM}  已就绪，从消息 ID>${LAST_ID} 开始监听新消息...${NC}\n"

# ── 主循环 ─────────────────────────────────────────────────────────────────────
while true; do
  ROW=$(sqlite3 -separator $'\x01' "$DB" \
    "SELECT id, from_role, content FROM messages
     WHERE to_role='lead' AND id > $LAST_ID
     ORDER BY id ASC LIMIT 1;" 2>/dev/null || true)

  if [[ -n "$ROW" ]]; then
    MSG_ID=$(echo "$ROW"      | cut -d$'\x01' -f1)
    MSG_FROM=$(echo "$ROW"    | cut -d$'\x01' -f2)
    MSG_CONTENT=$(echo "$ROW" | cut -d$'\x01' -f3)

    # 标记已读
    sqlite3 "$DB" "UPDATE messages SET read=1 WHERE id=${MSG_ID};" 2>/dev/null || true
    LAST_ID=$MSG_ID

    # 系统通知
    osascript -e "display notification \"来自 ${MSG_FROM} 的新消息\" with title \"📋 Tech Lead\"" 2>/dev/null || true

    # 打印收到的消息
    echo ""
    echo -e "${BOLD}${LEAD_COLOR} 📬 收到消息 #${MSG_ID} 来自 $(role_emoji "$MSG_FROM") ${NC}"
    echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "  ${MSG_CONTENT}"
    echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    # ── 自动路由规则 ──────────────────────────────────────────────────────────
    # 根据来源和内容关键字决定转发给谁
    ROUTE_TO=""
    ROUTE_MSG=""

    case "$MSG_FROM" in
      pm)
        # PM 完成 PRD → 通知 Arch 开始设计
        if echo "$MSG_CONTENT" | grep -qi "PRD\|完成\|specs/prd\|需求文档"; then
          ROUTE_TO="arch"
          ROUTE_MSG="【来自 PM】${MSG_CONTENT}

请根据 PRD 开始技术方案设计，产出保存到 specs/api/ 和 specs/constraints/。"
        fi
        ;;
      arch)
        # Arch 完成方案 → 通知 Dev 开始实现
        if echo "$MSG_CONTENT" | grep -qi "方案\|完成\|specs/api\|架构"; then
          ROUTE_TO="dev"
          ROUTE_MSG="【来自 Arch】${MSG_CONTENT}

请根据技术方案开始代码实现。"
        fi
        ;;
      dev)
        # Dev 完成代码 → 通知 QA 和 Reviewer 并行工作
        if echo "$MSG_CONTENT" | grep -qi "完成\|实现\|代码"; then
          ROUTE_TO="qa"
          ROUTE_MSG="【来自 Dev】${MSG_CONTENT}

请开始测试验证，编写测试用例并运行。"
          # 同时通知 Reviewer
          bash "$TEAM_MSG" send lead reviewer "【来自 Dev】${MSG_CONTENT}

请开始 Code Review。" 2>/dev/null || true
          echo -e "  ${CYAN}→ 已同时通知 🔍 Reviewer 开始 Code Review${NC}"
        fi
        ;;
      qa)
        # QA 完成测试 → 汇报给 Lead
        echo -e "  ${GREEN}✅ QA 测试报告已收到${NC}"
        ROUTE_TO=""
        ;;
      reviewer)
        # Reviewer 完成 Review → 汇报给 Lead
        echo -e "  ${GREEN}✅ Code Review 报告已收到${NC}"
        ROUTE_TO=""
        ;;
    esac

    # 如果有路由目标，转发消息
    if [[ -n "$ROUTE_TO" ]]; then
      bash "$TEAM_MSG" send lead "$ROUTE_TO" "$ROUTE_MSG" 2>/dev/null || true
      echo -e "  ${YELLOW}→ 已转发任务给 $(role_emoji "$ROUTE_TO")${NC}"
    else
      echo -e "  ${DIM}→ 消息已记录，无需转发${NC}"
    fi

    echo ""
    echo -e "${DIM}──────────────────────────────────────────────${NC}"
    echo ""
  fi

  sleep 2
done
