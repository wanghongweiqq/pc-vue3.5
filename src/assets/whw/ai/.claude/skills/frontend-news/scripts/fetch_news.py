#!/usr/bin/env python3
"""
前端资讯抓取脚本 - 国内来源版
从掘金、美团技术博客、阮一峰、张鑫旭等国内平台抓取最新前端技术资讯
"""

import urllib.request
import urllib.error
import json
import re
import sys
import html
from datetime import datetime, timezone, timedelta
from xml.etree import ElementTree as ET

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"

def fetch(url, timeout=10, extra_headers=None):
    headers = {"User-Agent": UA}
    if extra_headers:
        headers.update(extra_headers)
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            charset = "utf-8"
            ct = r.headers.get("Content-Type", "")
            m = re.search(r"charset=([\w-]+)", ct)
            if m:
                charset = m.group(1)
            return r.read().decode(charset, errors="ignore")
    except Exception:
        return None

def strip_tags(text):
    text = re.sub(r"<[^>]+>", "", text or "")
    return html.unescape(text).strip()

def truncate(text, n=120):
    text = re.sub(r"\s+", " ", text).strip()
    return text[:n] + "…" if len(text) > n else text

CONTENT_NS = "{http://purl.org/rss/1.0/modules/content/}encoded"

def html_to_md(raw_html):
    """将 HTML 正文转换为 Markdown，保留段落结构和图片"""
    if not raw_html:
        return ""
    # 图片转 Markdown 语法（保留原链接和宽高，学城可直接渲染）
    def img_to_md(m):
        tag = m.group(0)
        src = re.search(r'src=["\']([^"\']+)["\']', tag)
        alt = re.search(r'alt=["\']([^"\']*)["\']', tag)
        width = re.search(r'width=["\']?(\d+)["\']?', tag)
        height = re.search(r'height=["\']?(\d+)["\']?', tag)
        url = src.group(1) if src else ""
        desc = alt.group(1) if alt else "图片"
        if not url:
            return ""
        # 过滤掉 1x1 追踪像素等无意义图片
        if any(k in url for k in ["tracking", "pixel", "stat", "beacon", "1x1"]):
            return ""
        # 宽高属性用学城图片语法 {width=xxx height=xxx}
        size = ""
        if width and height:
            size = f"{{width={width.group(1)} height={height.group(1)}}}"
        elif width:
            size = f"{{width={width.group(1)}}}"
        return f"\n![{desc}]({url}){size}\n"

    text = re.sub(r'<img[^>]+>', img_to_md, raw_html, flags=re.I)
    # 块级标签转换为换行
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.I)
    text = re.sub(r'</?(p|div|li|h[1-6]|blockquote)[^>]*>', '\n', text, flags=re.I)
    # 去掉其余 HTML 标签
    text = re.sub(r'<[^>]+>', '', text)
    text = html.unescape(text)
    # 合并多余空行
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

def parse_rss(data, source_name, limit=3):
    """容错解析 RSS 2.0 / Atom，返回文章列表（含正文）"""
    if not data:
        return []
    try:
        data = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', data)
        root = ET.fromstring(data)
    except ET.ParseError:
        return []

    ns = {"atom": "http://www.w3.org/2005/Atom"}
    items = []

    # RSS 2.0
    for item in root.findall(".//item")[:limit]:
        title = item.findtext("title", "").strip()
        link = item.findtext("link", "").strip()
        desc = truncate(strip_tags(item.findtext("description", "")))
        # 优先取 content:encoded 作为正文，其次 description
        raw_content = item.findtext(CONTENT_NS, "") or item.findtext("description", "")
        body = html_to_md(raw_content)
        if title and link:
            items.append({"title": title, "url": link, "source": source_name,
                          "summary": desc, "body": body})

    # Atom
    if not items:
        for entry in root.findall(".//atom:entry", ns)[:limit]:
            title = entry.findtext("atom:title", "", ns).strip()
            link_el = entry.find("atom:link", ns)
            link = link_el.get("href", "") if link_el is not None else ""
            summary = truncate(strip_tags(entry.findtext("atom:summary", "", ns)))
            raw_content = entry.findtext("atom:content", "", ns) or \
                          entry.findtext("atom:summary", "", ns)
            body = html_to_md(raw_content)
            if title and link:
                items.append({"title": title, "url": link, "source": source_name,
                              "summary": summary, "body": body})

    return items

# ── 来源 1：掘金 — 前端分类热门文章 ─────────────────────────────────────────────
def fetch_juejin():
    """掘金前端分类，按热度排序"""
    # 使用掘金搜索 API 抓取前端热门
    url = "https://api.juejin.cn/search_api/v1/search?aid=2608&uuid=7&query=前端&search_type=0&sort_type=0&cursor=0&limit=10"
    data = fetch(url, extra_headers={
        "Referer": "https://juejin.cn/",
        "Origin": "https://juejin.cn"
    })
    if not data:
        return []
    try:
        result = json.loads(data)
        items = []
        for hit in result.get("data", [])[:5]:
            info = hit.get("result_model", {})
            article_id = info.get("article_id", "")
            title = info.get("title", "")
            brief = info.get("brief_content", "")
            tags = [t.get("tag_name", "") for t in info.get("tags", [])]
            tag_str = " / ".join(tags[:3]) if tags else ""
            if title and article_id:
                items.append({
                    "title": title,
                    "url": f"https://juejin.cn/post/{article_id}",
                    "source": f"掘金" + (f"（{tag_str}）" if tag_str else ""),
                    "summary": truncate(brief)
                })
        return items
    except Exception:
        return []

# ── 来源 2：掘金 — 前端沸点/热榜（备用） ────────────────────────────────────────
def fetch_juejin_hot():
    """掘金前端标签下的热门文章（备用接口）"""
    url = "https://api.juejin.cn/content_api/v1/content/article_rank?category_id=6809637767543259144&type=hot"
    data = fetch(url, extra_headers={
        "Referer": "https://juejin.cn/",
        "Origin": "https://juejin.cn"
    })
    if not data:
        return []
    try:
        result = json.loads(data)
        items = []
        for item in result.get("data", [])[:4]:
            info = item.get("article_info", {})
            article_id = info.get("article_id", "")
            title = info.get("title", "")
            brief = info.get("brief_content", "")
            if title and article_id:
                items.append({
                    "title": title,
                    "url": f"https://juejin.cn/post/{article_id}",
                    "source": "掘金热榜",
                    "summary": truncate(brief)
                })
        return items
    except Exception:
        return []

# ── 来源 3：张鑫旭博客 RSS ────────────────────────────────────────────────────
def fetch_zhangxinxu():
    data = fetch("https://www.zhangxinxu.com/wordpress/feed/")
    return parse_rss(data, "张鑫旭博客", 3)

# ── 来源 4：阮一峰博客 RSS ────────────────────────────────────────────────────
def fetch_ruanyifeng():
    data = fetch("https://www.ruanyifeng.com/blog/atom.xml")
    return parse_rss(data, "阮一峰·科技爱好者周刊", 2)

# ── 来源 5：美团技术博客 RSS ──────────────────────────────────────────────────
def fetch_meituan_tech():
    data = fetch("https://tech.meituan.com/feed/")
    items = parse_rss(data, "美团技术博客", 3)
    # 过滤前端/大前端相关
    fe_kw = ["前端", "JavaScript", "TypeScript", "React", "Vue", "CSS",
             "Node", "Web", "小程序", "H5", "移动端", "性能优化", "webpack", "vite"]
    filtered = [i for i in items if any(k.lower() in i["title"].lower() for k in fe_kw)]
    return filtered if filtered else items[:2]

# ── 来源 6：腾讯 AlloyTeam RSS ───────────────────────────────────────────────
def fetch_alloyteam():
    data = fetch("http://www.alloyteam.com/feed/")
    return parse_rss(data, "腾讯 AlloyTeam", 3)

# ── 来源 7：CSDN 前端热榜 ────────────────────────────────────────────────────
def fetch_csdn():
    """CSDN 前端频道热门文章"""
    url = "https://www.csdn.net/api/articles?type=more&category=web&shown_offset=0"
    data = fetch(url, extra_headers={"Referer": "https://www.csdn.net/"})
    if not data:
        return []
    try:
        result = json.loads(data)
        items = []
        for art in result.get("articles", [])[:4]:
            title = art.get("title", "")
            link = art.get("url", "") or art.get("article_url", "")
            desc = truncate(strip_tags(art.get("description", "") or art.get("description_html", "")))
            if title and link:
                items.append({"title": title, "url": link, "source": "CSDN", "summary": desc})
        return items
    except Exception:
        return []

# ── 来源 8：InfoQ 中文 RSS ────────────────────────────────────────────────────
def fetch_infoq():
    """InfoQ 中文站前端内容"""
    data = fetch("https://www.infoq.cn/feed")
    if not data:
        # 尝试备用
        data = fetch("https://www.infoq.cn/public/v1/article/getList?pageIndex=1&category=front-end")
        if data:
            try:
                result = json.loads(data)
                items = []
                for art in result.get("data", {}).get("list", [])[:3]:
                    title = art.get("title", "")
                    link = "https://www.infoq.cn/article/" + art.get("uuid", "")
                    desc = truncate(strip_tags(art.get("summary", "")))
                    if title:
                        items.append({"title": title, "url": link, "source": "InfoQ 中文", "summary": desc})
                return items
            except Exception:
                return []
    return parse_rss(data, "InfoQ 中文", 3)

# ── 汇总并精选 N 条 ───────────────────────────────────────────────────────────
def gather_news(total=5):
    all_items = []
    sources = [
        fetch_juejin,
        fetch_zhangxinxu,
        fetch_ruanyifeng,
        fetch_meituan_tech,
        fetch_alloyteam,
        fetch_csdn,
        fetch_juejin_hot,
        fetch_infoq,
    ]
    for fn in sources:
        try:
            items = fn()
            all_items.extend(items)
        except Exception:
            pass
        if len(all_items) >= total * 3:
            break

    # 去重（按 URL）
    seen = set()
    unique = []
    for item in all_items:
        url = item.get("url", "")
        if url and url not in seen:
            seen.add(url)
            unique.append(item)

    return unique[:total]

# ── 生成 Markdown 内容 ────────────────────────────────────────────────────────
def build_markdown(items, fetch_time):
    tz8 = timezone(timedelta(hours=8))
    now_str = fetch_time.astimezone(tz8).strftime("%Y-%m-%d %H:%M:%S")
    source_names = "掘金 / 张鑫旭博客 / 阮一峰周刊 / 美团技术博客 / 腾讯AlloyTeam / CSDN / InfoQ中文"
    lines = [
        "# 前端资讯日报",
        "",
        f"> 抓取时间：{now_str}（北京时间）  ",
        f"> 来源：{source_names}",
        "",
        "---",
        "",
    ]
    for i, item in enumerate(items, 1):
        title = item.get("title", "无标题")
        url = item.get("url", "")
        source = item.get("source", "未知来源")
        summary = item.get("summary", "")
        lines.append(f"## {i}. {title}")
        lines.append("")
        lines.append(f"- **来源**：{source}")
        if url:
            lines.append(f"- **链接**：[点击阅读原文]({url})")
        if summary:
            lines.append(f"- **简介**：{summary}")
        # 折叠正文（学城 collapse 语法，active=false 默认折叠）
        # 格式：第一行为标题，空行后为正文内容
        body = item.get("body", "").strip()
        if body:
            lines.append("")
            lines.append(":::collapse{active=false}")
            lines.append("📄 查看正文")
            lines.append("")
            lines.append(body)
            lines.append(":::")
        lines.append("")
        lines.append("---")
        lines.append("")
    return "\n".join(lines)

if __name__ == "__main__":
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    now = datetime.now(timezone.utc)
    items = gather_news(count)
    if not items:
        print("ERROR: 未能抓取到任何资讯", file=sys.stderr)
        sys.exit(1)
    md = build_markdown(items, now)
    print(md)
