---
name: jimeng-api-image
description: 使用即梦AI官方API生成图片并保存到本地。当用户明确提到"jm api"、"即梦api"、"jimeng api"、"用api生成图片"（结合即梦上下文）时触发此skill。与jimeng-image skill不同，本skill直接调用火山引擎REST API，更稳定高效，无需浏览器。
---

# 即梦 API 图片生成 Skill

通过火山引擎即梦AI官方 API 生成图片，异步提交任务后轮询结果，将图片下载保存到本地。

## 前置条件

需要以下环境变量（火山引擎 IAM 控制台获取）：
- `VOLC_ACCESS_KEY` — Access Key ID
- `VOLC_SECRET_KEY` — Secret Access Key

如果未设置，告知用户前往 https://console.volcengine.com/iam/keymanage/ 创建并导出凭证。

## 工作流程

### 第一步：理解用户需求

收集以下信息（未提供时使用默认值）：

| 参数 | 说明 | 默认值 |
|------|------|--------|
| 图片描述 | 想要生成的内容（必须） | — |
| 保存目录 | 图片保存位置 | `~/Desktop` |
| 图片比例 | 宽高比 | 1:1 |
| 生成数量 | 一次生成几张 | 1 |

**比例对应的宽高（像素）：**

| 比例 | 宽 × 高 |
|------|---------|
| 1:1  | 1024×1024 |
| 16:9 | 1280×720  |
| 9:16 | 720×1280  |
| 4:3  | 1024×768  |
| 3:4  | 768×1024  |

### 第二步：优化提示词

如果用户描述是中文或比较简单，翻译并优化为英文提示词，效果更好：

- 加入风格（photorealistic / anime style / oil painting / watercolor）
- 加入光线（golden hour lighting / soft diffused light）
- 加入构图（close-up portrait / wide angle landscape）
- 加入质量词（high quality, detailed, 8K resolution）

**示例：**
- 用户："一只可爱的猫"
- 优化后："A cute fluffy cat with soft fur and big eyes, photorealistic, high quality, warm lighting"

### 第三步：检查依赖

```bash
python3 -c "from volcengine.visual.VisualService import VisualService; print('OK')" 2>&1
```

如果失败，安装 SDK：

```bash
pip install volcengine
```

### 第四步：运行生成脚本

```bash
python3 ~/.claude/skills/jimeng-api-image/scripts/generate.py \
  "<英文提示词>" \
  --output "<保存目录>" \
  --ratio "<比例>" \
  --count <数量>
```

**示例：**
```bash
python3 ~/.claude/skills/jimeng-api-image/scripts/generate.py \
  "A cute fluffy cat, photorealistic, high quality" \
  --output ~/Desktop \
  --ratio 1:1 \
  --count 2
```

### 第五步：告知用户结果

脚本成功后输出保存路径。告诉用户：
1. 图片保存位置
2. 生成了几张
3. 使用的提示词（中英文对照）

## 常见问题

| 问题 | 解决方案 |
|------|---------|
| 环境变量未设置 | 检查 `VOLC_ACCESS_KEY` / `VOLC_SECRET_KEY` |
| `volcengine` 未安装 | `pip install volcengine` |
| 认证失败（401/403） | 确认 AK/SK 正确，且账号已开通即梦AI服务 |
| 任务超时 | 网络问题或服务繁忙，重试即可 |
| 积分不足 | 前往即梦AI控制台充值 |
