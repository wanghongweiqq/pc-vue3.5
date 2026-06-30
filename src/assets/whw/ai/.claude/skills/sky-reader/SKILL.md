---
name: sky-reader
description: 读取美团内网 sky.sankuai.com 文档内容（如 leez 组件库）。当用户提供 sky.sankuai.com 链接、说「访问sky文档」「读取sky组件」「sky链接」「leez组件文档」「看一下这个sky页面」时触发。使用 agent-browser --auto-connect 通过本机已登录的 Chrome 访问，自动处理 SSO 登录。
---

# sky-reader：读取美团内网 sky.sankuai.com 文档

通过本机已登录的 Chrome 浏览器（`--auto-connect`）访问 sky.sankuai.com 内网页面，自动处理 SSO 跳转，提取并整理文档内容。

## 前置条件

- `agent-browser` 已安装（`/usr/local/bin/agent-browser`）
- 用户本机 Chrome 已登录美团 SSO，或可通过点击账号卡片完成认证

## 工作流程

### Step 1：打开页面

```bash
agent-browser --auto-connect open "<url>"
```

等待 2-3 秒后获取当前 URL：

```bash
agent-browser --auto-connect get url
```

### Step 2：处理 SSO 登录（如有必要）

如果当前 URL 仍在 `ssosv.sankuai.com`（SSO 登录页），执行以下操作：

1. 获取页面快照找到账号卡片：
   ```bash
   agent-browser --auto-connect snapshot
   ```
2. 找到包含 MIS 号（如 `wb_wanghongwei06`）的账号卡片元素，点击它：
   ```bash
   agent-browser --auto-connect click @<ref>
   ```
3. 等待 3 秒后再次检查 URL，确认已跳转到目标页面。

> 如果点击账号卡片后仍在登录页，尝试点击「登录」按钮（`button` 角色，文本"登录"）。

### Step 3：提取页面内容

页面加载完成后，提取全文：

```bash
agent-browser --auto-connect eval "document.body.innerText"
```

### Step 4：整理并输出

将提取的内容整理成结构化的 Markdown 格式输出给用户，包括：
- 组件描述
- 安装和使用方法
- Props/API 表格
- 注意事项
- 示例代码
- 改动日志（近期重要变更）

## 示例

用户说：「访问 https://sky.sankuai.com/max/leez-components/components/leez-button」

→ 执行上述步骤，最终输出 `@max/leez-button` 的完整组件文档。
