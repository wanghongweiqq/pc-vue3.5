---
name: km-reader
description: 读取美团内网 km.sankuai.com 学城文档内容。当用户提供 km.sankuai.com 链接、说「读取这个KM文档」「打开KM」「看一下这个文档」「km链接」时触发。使用 oa-skills citadel CIBA 认证，需要用户在大象 App 确认授权（约10分钟缓存）。
---

# KM 学城文档读取

通过 `oa-skills citadel` 读取 `km.sankuai.com` 学城文档内容。

## 配置

| 配置项 | 值 |
|---|---|
| 用户 MIS | `wb_wanghongwei06` |
| 认证方式 | SSO CIBA（大象 App 确认） |
| Token 缓存 | 约 10 分钟 |

## 执行步骤

### Step 1：提取 contentId

从用户提供的 URL 中提取文档 ID：

```
https://km.sankuai.com/collabpage/2721963092
                                  ↑ 这就是 contentId
```

### Step 2：读取文档

```bash
export PATH="$HOME/.npm-global/bin:$PATH"
oa-skills citadel getMarkdown --contentId <contentId> --mis wb_wanghongwei06
```

### Step 3：处理认证

- 命令会在后台等待大象 App 授权（超时 120s）
- 提示用户：**请打开大象 App，确认授权弹窗**
- 认证成功后，输出文档内容

### Step 4：输出结果

文档内容为 CitadelMD 格式（含 `:::paragraph`、`:::table` 等宏标签），直接以 Markdown 形式展示给用户，跳过宏标签专注于文字内容。

## 注意事项

- 仅适用于 `km.sankuai.com/collabpage/<id>` 格式的链接
- `sky.sankuai.com` 等其他内网站点不适用此方法
- 若大象 App 已有缓存 token，无需再次确认
- 若认证超时，重新运行命令并在大象 App 及时确认
