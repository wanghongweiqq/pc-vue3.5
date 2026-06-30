---
name: wanxiang-image
description: 使用阿里云通义万象生成图片并保存到本地。当用户明确提到"万象"、"通义万象"或"wx"时触发此 skill 生成图片，其他图片生成需求不触发。
---

# 图片生成 Skill（通义万象-模型名称：wan2.7-image）

## 工作流程

### 第一步：理解用户需求

收集以下信息（如果用户没有提供，使用默认值）：

- **图片描述**：用户想要什么样的图片（必须）
- **保存目录**：图片保存到哪里（默认：`~/Desktop` 桌面）
- **图片尺寸**：1024*1024（默认）/ 720*1280 / 1280*720 / 768*1152 / 1152*768

如果用户描述比较简单，主动帮他丰富提示词，让图片效果更好。

### 第二步：将中文描述优化为英文提示词

通义万象对英文提示词效果更好。将用户的中文描述翻译并优化为专业的英文图片提示词。

**优化提示词的技巧：**
- 加入风格描述（如：photorealistic, anime style, oil painting, watercolor）
- 加入光线描述（如：golden hour lighting, soft diffused light）
- 加入构图描述（如：close-up portrait, wide angle landscape）
- 加入质量词（如：high quality, detailed, 8K resolution）

**示例：**
- 用户说："一只可爱的猫"
- 优化后："A cute fluffy cat, soft fur, big eyes, photorealistic, high quality, warm lighting"

### 第三步：检查 API Key

运行以下命令检查 API Key 是否已配置：

```bash
echo $DASHSCOPE_API_KEY
```

如果为空，告知用户需要先配置 API Key：

> 你还没有配置通义万象的 API Key。请按以下步骤操作：
> 1. 访问 https://dashscope.console.aliyun.com/ 注册/登录阿里云账号
> 2. 开通 DashScope 服务
> 3. 在控制台创建 API Key
> 4. 在终端运行：`export DASHSCOPE_API_KEY="your_api_key_here"`
> 5. 或者永久生效，将上面这行加入 `~/.zshrc` 或 `~/.bashrc`，然后重启终端

如果已配置，继续下一步。

### 第四步：检查 Python 依赖

```bash
python3 -c "import requests" 2>&1
```

如果未安装：
```bash
pip install requests
```

### 第五步：运行图片生成脚本

```bash
python3 ~/.claude/skills/wanxiang-image/scripts/generate_image.py \
  "<英文提示词>" \
  --output "<保存目录>" \
  --size "<尺寸>"
```

**示例：**
```bash
python3 ~/.claude/skills/wanxiang-image/scripts/generate_image.py \
  "A cute fluffy cat, soft fur, big eyes, photorealistic, high quality" \
  --output "~/Desktop" \
  --size "1024*1024"
```

### 第六步：告知用户结果

脚本成功后会输出保存的图片路径。告诉用户：
1. 图片已保存到哪里
2. 使用的提示词（中英文对照）

如果失败，查看错误信息并告诉用户可能的原因。

---

## 常见问题处理

| 问题 | 解决方案 |
|------|---------|
| `DASHSCOPE_API_KEY` 未设置 | 按第三步说明获取并配置 API Key |
| `InvalidApiKey` 错误 | API Key 不正确，重新检查并设置 |
| `Arrearage` / 余额不足 | 登录阿里云控制台充值 |
| `requests` 未安装 | `pip install requests` |
| 网络超时 | 重试，或检查网络连接 |
| 任务排队中 | 正常现象，脚本会自动轮询等待结果 |

---

## 注意事项

- 生成图片通常需要 10-30 秒
- 每次生成 1 张图片
- 请遵守阿里云服务条款，不要滥用
