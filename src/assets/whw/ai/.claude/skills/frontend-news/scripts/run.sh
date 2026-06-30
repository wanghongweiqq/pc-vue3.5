#!/bin/bash
# 前端资讯抓取并发布到学城
# 每小时由 cron 自动调用

export PATH="$HOME/.npm-global/bin:/usr/local/bin:/usr/bin:/bin:$PATH"
export NO_CHECK_VERSION=true

LOG_DIR="$HOME/.claude/skills/frontend-news/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/$(date '+%Y%m%d').log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "====== 开始抓取前端资讯 ======"

# Step 1: 生成标题
TITLE=$(python3 -c "
from datetime import datetime, timezone, timedelta
tz8 = timezone(timedelta(hours=8))
print(datetime.now(tz8).strftime('前端资讯-%Y-%m-%d %H:%M'))
")
log "文档标题：$TITLE"

# Step 2: 抓取资讯
SCRIPT="$HOME/.claude/skills/frontend-news/scripts/fetch_news.py"
CONTENT=$(python3 "$SCRIPT" 5 2>>"$LOG_FILE")

if [ -z "$CONTENT" ]; then
  log "❌ 抓取失败，内容为空"
  exit 1
fi
log "✅ 抓取成功，内容长度：${#CONTENT} 字符"

# Step 3: 发布到学城（写入临时文件避免 shell 转义问题）
TMPFILE=$(mktemp /tmp/frontend_news_$(date '+%s%N').md 2>/dev/null || echo "/tmp/frontend_news_$(date '+%s').md")
echo "$CONTENT" > "$TMPFILE"

RESULT=$(oa-skills citadel createDocument \
  --mis wb_wanghongwei06 \
  --title "$TITLE" \
  --spaceId 6665696 \
  --file "$TMPFILE" \
  --no-version-check 2>&1)

rm -f "$TMPFILE"

echo "$RESULT" >> "$LOG_FILE"

if echo "$RESULT" | grep -q "文档创建成功"; then
  URL=$(echo "$RESULT" | grep "访问链接" | awk '{print $2}')
  log "✅ 发布成功：$URL"
else
  log "❌ 发布失败，详见日志"
  exit 1
fi

log "====== 完成 ======"
