#!/bin/bash
# Claude Code 状态栏脚本
# 显示：模型 | 当前目录 | 上下文进度条 | 费用

input=$(cat)

# 提取字段
MODEL=$(echo "$input"   | jq -r '.model.display_name // "Unknown"')
DIR=$(echo "$input"     | jq -r '.workspace.current_dir // .cwd // ""')
PCT=$(echo "$input"     | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
COST=$(echo "$input"    | jq -r '.cost.total_cost_usd // 0')
EFFORT=$(echo "$input"  | jq -r '.effort.level // empty')

# 目录只取最后一段
DIR_NAME="${DIR##*/}"
[ -z "$DIR_NAME" ] && DIR_NAME="$DIR"

# 进度条（宽度 20）
BAR_WIDTH=20
FILLED=$(( PCT * BAR_WIDTH / 100 ))
EMPTY=$(( BAR_WIDTH - FILLED ))
BAR=$(printf '%0.s█' $(seq 1 $FILLED 2>/dev/null))$(printf '%0.s░' $(seq 1 $EMPTY 2>/dev/null))

# 根据用量着色
if   [ "$PCT" -ge 80 ]; then COLOR=$'\033[31m'   # 红：危险
elif [ "$PCT" -ge 50 ]; then COLOR=$'\033[33m'   # 黄：注意
else                         COLOR=$'\033[32m'   # 绿：正常
fi
RESET=$'\033[0m'
GRAY=$'\033[90m'
CYAN=$'\033[36m'
BOLD=$'\033[1m'

# 格式化费用
COST_STR=$(printf '$%.4f' "$COST" 2>/dev/null || echo '$0.0000')

# Effort 标签（有值才显示）
EFFORT_STR=""
[ -n "$EFFORT" ] && EFFORT_STR=" ${GRAY}[${EFFORT}]${RESET}"

# 读取 Claude 当前状态（由 Hook 写入）
STATUS_FILE="/tmp/claude_status"
STATUS_ICON="⏳ 等待中"
if [ -f "$STATUS_FILE" ]; then
    STATUS_VAL=$(cat "$STATUS_FILE" 2>/dev/null)
    [ "$STATUS_VAL" = "thinking" ]   && STATUS_ICON="🤔 思考中"
    [ "$STATUS_VAL" = "confirming" ] && STATUS_ICON="🔔 待确认"
fi

# 输出状态栏
printf "${BOLD}${CYAN}%s${RESET} %s ${GRAY}│${RESET} 📁 %s ${GRAY}│${RESET} ${COLOR}%s %s%%%s${RESET} ${GRAY}│${RESET} 💰 %s%s\n" \
  "$MODEL" \
  "$STATUS_ICON" \
  "$DIR_NAME" \
  "$BAR" \
  "$PCT" \
  "$RESET" \
  "$COST_STR" \
  "$EFFORT_STR"
