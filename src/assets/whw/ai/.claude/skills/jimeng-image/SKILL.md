---
name: jimeng-image
description: 使用即梦AI生成图片并下载到本地。仅当用户明确提到"即梦"或"jm"时才使用此skill，其他生成图片的需求不触发。
---

# 图片生成 Skill（即梦AI）

## 工作流程

### 第一步：理解用户需求

收集以下信息（如果用户没有提供，使用默认值）：

- **图片描述**：用户想要什么样的图片（必须）
- **保存目录**：图片保存到哪里（默认：`~/Desktop` 桌面）
- **图片比例**：1:1（默认）/ 16:9 / 9:16 / 4:3 / 3:4

如果用户描述比较简单，主动帮他丰富提示词，让图片效果更好。

### 第二步：将中文描述翻译为英文提示词

即梦AI对英文提示词效果更好。将用户的中文描述翻译并优化为专业的英文图片提示词。

**优化提示词的技巧：**
- 加入风格描述（如：photorealistic, anime style, oil painting, watercolor）
- 加入光线描述（如：golden hour lighting, soft diffused light）
- 加入构图描述（如：close-up portrait, wide angle landscape）
- 加入质量词（如：high quality, detailed, 8K resolution）

**示例：**
- 用户说："一只可爱的猫"
- 优化后："A cute fluffy cat, soft fur, big eyes, photorealistic, high quality, warm lighting"

### 第三步：检查环境依赖

运行以下命令检查 Playwright 是否已安装：

```bash
python3 -c "import playwright" 2>&1
```

如果未安装，先安装：

```bash
pip install playwright && playwright install chromium
```

### 第四步：运行图片生成脚本（优先即梦AI）

```bash
python3 ~/.claude/skills/jimeng-image/scripts/generate_image.py \
  "<英文提示词>" \
  --output "~/Desktop" \
  --ratio "<比例>"
```

**重要：关于登录**

- **首次使用**：脚本会自动打开浏览器，让用户手动登录即梦AI。登录完成后按回车，Cookie 会自动保存到 `~/.claude/jimeng_cookies.json`
- **之后使用**：自动使用保存的 Cookie，无需再次登录
- **Cookie 过期**：如果提示需要重新登录，运行带 `--reset-login` 参数的命令重置

重置登录：
```bash
python3 ~/.claude/skills/jimeng-image/scripts/generate_image.py "<提示词>" --reset-login
```

### 第五步：告知用户结果

脚本成功后会输出保存的图片路径。告诉用户：
1. 图片已保存到哪里
2. 生成了几张图片
3. 使用的是什么提示词（中英文对照）

如果失败，查看错误信息并告诉用户可能的原因（如 Cookie 过期、额度不足、网络问题等）。

---

## 常见问题处理

| 问题 | 解决方案 |
|------|---------|
| `playwright` 未安装 | `pip install playwright && playwright install chromium` |
| Cookie 过期/需要重新登录 | 加上 `--reset-login` 参数重新登录 |
| 积分不足或没有相关权益 | 脚本会直接报错退出（exit code 2），告知用户登录即梦充值积分或升级会员 |
| 找不到生成的图片 | 查看调试截图，可能是页面结构变化，告知用户手动截图 |
| 网络超时 | 重试，或检查网络连接 |

---

## 注意事项

- 生成图片通常需要 20-60 秒
- 每次生成可能产生多张图片（通常 4 张），脚本会全部下载
- 请遵守各平台服务条款，不要滥用
