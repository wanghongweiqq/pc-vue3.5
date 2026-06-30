---
name: frontend-news
description: 每分钟自动抓取最新前端技术资讯（JavaScript、TypeScript、React、Vue、CSS 等），整理成摘要并发布到美团学城「我的空间」。当用户说「前端资讯」「抓取前端新闻」「前端日报」「更新前端资讯」「发布前端资讯到学城」时触发此 skill。也可配合 /schedule 实现每分钟自动执行。
---

# 前端资讯自动抓取 Skill

每次执行抓取 5 条前端资讯，创建一篇以时间命名的学城文档，保存到「王宏伟的空间」根目录。

## 配置信息

| 配置项 | 值 |
|--------|-----|
| 学城空间 ID | `6665696` |
| 用户 MIS | `wb_wanghongwei06` |
| 每次抓取条数 | 5 条 |
| 文档命名格式 | `前端资讯-YYYY-MM-DD HH:MM` |

## 执行步骤

### Step 1：抓取资讯

运行抓取脚本，从多个来源获取最新前端资讯：

```bash
python3 ~/.claude/skills/frontend-news/scripts/fetch_news.py 5
```

脚本会从以下来源抓取并精选 5 条：
- **Dev.to** — JavaScript/前端文章
- **Hacker News** — 前端相关热门讨论
- **Smashing Magazine** — 前端设计与开发
- **CSS Weekly** — CSS 最新动态
- **GitHub Trending** — JavaScript/TypeScript 热门项目
- **TC39 Proposals** — ECMAScript 提案动态

脚本输出 Markdown 格式的内容，直接作为文档正文。

### Step 2：生成文档标题

标题格式：`前端资讯-YYYY-MM-DD HH:MM`（北京时间）

```python
from datetime import datetime, timezone, timedelta
tz8 = timezone(timedelta(hours=8))
title = datetime.now(tz8).strftime("前端资讯-%Y-%m-%d %H:%M")
```

### Step 3：发布到学城

```bash
export PATH="$HOME/.npm-global/bin:$PATH"

oa-skills citadel createDocument \
  --mis wb_wanghongwei06 \
  --title "<文档标题>" \
  --spaceId 6665696 \
  --content "<Step 1 输出的 Markdown 内容>" \
  --no-version-check
```

成功后输出文档链接，告知用户。

### Step 4：告知用户结果

输出：
- ✅ 文档标题
- 📎 学城访问链接
- 📊 本次抓取来源统计（几条来自哪里）

## 定时执行

用户想要每分钟自动执行时，使用 launchd 配置定时任务（已配置，`StartInterval=60`）：

```bash
launchctl load ~/Library/LaunchAgents/com.wanghongwei.frontend-news.plist
```

## 常见问题

| 问题 | 解决方案 |
|------|---------|
| 大象 App 认证弹窗 | 打开大象 App 点击确认授权即可，认证缓存约 10 分钟 |
| 抓取条数不足 5 条 | 网络问题，重试即可；脚本会尽量从多个来源补足 |
| `oa-skills` 命令找不到 | 执行 `export PATH="$HOME/.npm-global/bin:$PATH"` |
| Cookie 过期 | 此 skill 使用 oa-skills 认证，不依赖 Cookie |
