---
name: simulator-debug
description: iOS 模拟器调试工作流。启动 Xcode 模拟器、连接 MRN/Max 本地开发服务器、操作模拟器 UI（截图、点击、摇一摇、Dev Menu）。当用户说"打开模拟器"、"连接模拟器"、"模拟器调试"、"simulator"、"simulator-debug"、"启动 mrn"、"连接美团 app"时触发。
---

# simulator-debug — iOS 模拟器调试工作流

## 工具链

| 工具 | 用途 |
|---|---|
| `xcrun simctl` | 截图、openurl（深链）、shake |
| Python Quartz | 鼠标点击模拟（AppleScript 键盘注入被系统拦截） |
| `n` / nvm | Node 版本切换 |
| `osascript` | 打开 VS Code 新终端标签页（优先）或 Terminal.app（回退）、前台激活 App |
| `TERM_PROGRAM` | 检测当前是否在 VS Code 终端中运行 |

---

## 第一步：识别意图

| 用户说 | 跳转 |
|---|---|
| 打开模拟器 / 启动模拟器 | → [启动模拟器](#启动模拟器)，完成后**自动继续** → [启动 MRN 开发服务器](#启动-mrn-开发服务器) |
| 连接 mrn / 启动 mrn / 启动开发服务器 | → [启动 MRN 开发服务器](#启动-mrn-开发服务器) |
| 连接美团 app / 打开页面 / 加载页面 | → [连接模拟器到本地服务器](#连接模拟器到本地服务器) |
| 截图 / 看下当前页面 | → [截图并查看](#截图并查看) |
| 点击 / 选择 / 操作 UI | → [UI 交互（点击）](#ui-交互点击) |
| 摇一摇 / Dev Menu / Reload | → [Dev Menu 操作](#dev-menu-操作) |

---

## 启动模拟器

### 偏好设备选择

偏好存储在 `~/.claude/skills/simulator-debug/references/prefs.json`，格式：
```json
{ "device_udid": null, "device_name": null }
```

**流程：**

```bash
PREFS=~/.claude/skills/simulator-debug/references/prefs.json

# 1. 读取已保存的偏好
SAVED_UDID=$(python3 -c "import json,os; d=json.load(open(os.path.expanduser('$PREFS'))); print(d.get('device_udid') or '')" 2>/dev/null)
SAVED_NAME=$(python3 -c "import json,os; d=json.load(open(os.path.expanduser('$PREFS'))); print(d.get('device_name') or '')" 2>/dev/null)
```

- **若 `SAVED_UDID` 非空**，且用户未明确指定机型：直接使用保存的设备，跳到启动步骤。
- **若为空**（首次使用或用户明确要求更换）：列出可用设备，询问用户选择：

```bash
# 列出所有可用设备（含 UDID），包含全部机型（iPhone / iPad / Apple Watch / Apple TV 等）
xcrun simctl list devices | grep -v "unavailable"
```

用编号列出展示给用户，格式示例：
```
1) iPhone 16 Pro      (6619D6BC-...)  Shutdown
2) iPhone Air         (6FCE2C36-...)  Shutdown
3) iPad Pro 13-inch   (ABCD1234-...)  Shutdown
4) Apple Watch SE     (EF012345-...)  Shutdown
```

⚠️ 列出时需过滤掉分组标题行（如 `== iOS 18.5 ==`），只保留含 UDID 的设备行。

用户选择后：
```bash
# 保存偏好（替换 CHOSEN_UDID / CHOSEN_NAME 为用户选择的值）
python3 -c "
import json, os
path = os.path.expanduser('$PREFS')
d = json.load(open(path))
d['device_udid'] = 'CHOSEN_UDID'
d['device_name'] = 'CHOSEN_NAME'
json.dump(d, open(path, 'w'))
print('Saved: CHOSEN_NAME')
"
```

### 启动设备

```bash
# 检查是否已 Booted
STATUS=$(xcrun simctl list devices | grep "$SAVED_UDID" | grep -o "Booted\|Shutdown")

if [ "$STATUS" != "Booted" ]; then
  xcrun simctl boot "$SAVED_UDID"
fi

# 打开 Simulator.app 显示界面
open -a Simulator

# 等待模拟器完全启动后设置定位为北京
sleep 3
xcrun simctl location booted set 39.9042,116.4074
echo "📍 已自动设置定位为北京（39.9042, 116.4074）"
```

**注意**：若已有 Booted 设备，无需再 boot；每次启动后自动将定位设置为北京。

### 自动继续：启动 MRN 开发服务器

> ⚡ **模拟器启动完成后，无需等待用户指令，立即自动执行 [启动 MRN 开发服务器](#启动-mrn-开发服务器) 章节的完整流程。**
>
> 执行顺序：
> 1. ✅ 启动模拟器（boot + open Simulator.app）
> 2. 🔄 自动继续 → 检查 Node 版本 → 确定项目路径 → 启动 `yarn start:mrn`
> 3. ⏳ 等待端口就绪，提示用户"MRN 服务已启动，端口：XXXX"

---

## 启动 MRN 开发服务器

### 环境检查

```bash
# 检查 Node 版本（项目要求 >=16 <17）
node -v
```

若版本不符，分两步：**先读取项目要求的版本，再探测工具切换**。

#### 步骤 1：读取项目要求的 Node 版本

按优先级依次查找：

```bash
# PROJECT_DIR 已在上一步确定（当前目录或用户提供的路径）

# 优先级 1：.nvmrc 或 .node-version（精确版本）
if [ -f "$PROJECT_DIR/.nvmrc" ]; then
  REQUIRED_NODE=$(cat "$PROJECT_DIR/.nvmrc" | tr -d 'v\n')
elif [ -f "$PROJECT_DIR/.node-version" ]; then
  REQUIRED_NODE=$(cat "$PROJECT_DIR/.node-version" | tr -d 'v\n')
# 优先级 2：package.json engines.node（范围，取下界大版本号）
elif [ -f "$PROJECT_DIR/package.json" ]; then
  ENGINES=$(node -e "const p=require('$PROJECT_DIR/package.json'); console.log(p.engines && p.engines.node || '')")
  # 示例 ">=14 <17" → 取最低满足的大版本，即 14
  REQUIRED_NODE=$(echo "$ENGINES" | grep -oE '[0-9]+' | head -1)
fi

echo "Project requires Node: $REQUIRED_NODE"
```

#### 步骤 2：探测本机安装的版本管理工具，执行切换

```bash
# 探测可用工具（按优先级）
if command -v fnm &>/dev/null; then
  NODE_TOOL="fnm"
elif command -v n &>/dev/null; then
  NODE_TOOL="n"
elif command -v nvm &>/dev/null || [ -s "$HOME/.nvm/nvm.sh" ]; then
  NODE_TOOL="nvm"
else
  NODE_TOOL="none"
fi
echo "Node tool: $NODE_TOOL"
```

| 工具 | 切换命令（将 `<VER>` 替换为 `$REQUIRED_NODE`） |
|---|---|
| `fnm` | `fnm use <VER> --install-if-missing` |
| `n` | `n <VER>` |
| `nvm` | `source ~/.nvm/nvm.sh && nvm use <VER>` （未安装时先 `nvm install <VER>`） |
| 无工具 | 提示用户安装，推荐 `fnm`：`curl -fsSL https://fnm.vercel.app/install \| bash` |

切换后验证：
```bash
node -v  # 期望输出符合项目要求的版本
```

### 确定项目路径

**优先使用当前工作目录，不足时询问用户：**

```bash
# 1. 先用当前目录
PROJECT_DIR=$(pwd)

# 2. 判断是否是有效项目（有 package.json）
if [ ! -f "$PROJECT_DIR/package.json" ]; then
  echo "当前目录 $PROJECT_DIR 不是项目根目录"
  # → 询问用户输入项目路径
fi
```

如果当前目录不含 `package.json`，直接问用户：

> 当前目录不是项目根目录，请提供项目路径（例如 `/Users/xxx/project/my-app`）：

用户回答后赋值给 `PROJECT_DIR`，后续所有步骤使用该变量，不再硬编码任何路径。

### 安装依赖（首次或依赖缺失时）

```bash
cd "$PROJECT_DIR"
yarn install --ignore-engines
```

### 启动服务器

#### ⚡ 第一步：检测本项目是否已在运行（必做，避免重复启动）

**通过进程命令行是否包含项目路径**来精准判断，避免误判其他项目的 MRN 进程：

```bash
# 查找包含本项目路径的 mrn 进程，同时获取其监听端口
EXISTING_PORT=$(lsof -iTCP -sTCP:LISTEN -n -P 2>/dev/null | grep -E "^node" | while read line; do
  PID=$(echo "$line" | awk '{print $2}')
  PORT=$(echo "$line" | awk '{print $9}' | grep -oE '[0-9]+$')
  CMD=$(ps -o command= -p "$PID" 2>/dev/null)
  if echo "$CMD" | grep -q "$PROJECT_DIR"; then
    echo "$PORT"
  fi
done | head -1)

if [ -n "$EXISTING_PORT" ]; then
  echo "✅ 本项目 MRN 服务已在运行，端口：$EXISTING_PORT，直接复用，无需重新启动"
  MRN_PORT=$EXISTING_PORT
else
  echo "未检测到本项目运行中的 MRN 服务，准备启动..."
  # → 继续执行下方「启动新服务」步骤
fi
```

- **若 `EXISTING_PORT` 非空**：直接使用该端口，**跳过启动**，进入「连接模拟器」步骤。
- **若为空**：继续下方启动流程。

#### 启动新服务（仅在未运行时执行）

先根据上方探测结果确定切换命令（`NODE_SWITCH_CMD`），版本号用 `$REQUIRED_NODE`：

```bash
# 示例：已确认工具为 fnm，项目需要 Node 16
NODE_SWITCH_CMD="fnm use $REQUIRED_NODE --install-if-missing"
# 示例：已确认工具为 n
# NODE_SWITCH_CMD="n $REQUIRED_NODE"
# 示例：已确认工具为 nvm
# NODE_SWITCH_CMD="source ~/.nvm/nvm.sh && nvm use $REQUIRED_NODE"

> /tmp/mrn_server.log  # 清空旧日志
```

**终端选择策略：优先 VS Code，回退 Terminal.app**

```bash
# 检测是否在 VS Code 终端中运行（TERM_PROGRAM=vscode），
# 或 VS Code 进程是否正在运行
IN_VSCODE=false
if [ "$TERM_PROGRAM" = "vscode" ]; then
  IN_VSCODE=true
elif pgrep -x "Electron" >/dev/null 2>&1 && \
     osascript -e 'tell application "System Events" to return name of processes' 2>/dev/null | grep -q "Code"; then
  IN_VSCODE=true
fi
```

**若 `IN_VSCODE=true`：在 VS Code 新终端标签页中启动**

```bash
# ⚠️ keystroke 无法可靠输入长字符串（特殊符号/中文会乱码）
# 正确做法：先把命令写入剪贴板，再 Cmd+V 粘贴，避免逐字符输入

# 1. 把启动命令写入剪贴板
printf '%s' "cd '$PROJECT_DIR' && $NODE_SWITCH_CMD && yarn start:mrn 2>&1 | tee /tmp/mrn_server.log" | pbcopy

# 2. Ctrl+Shift+` 创建新终端，等待 shell 就绪，再 Cmd+V 粘贴并回车
osascript -e "
tell application \"Visual Studio Code\"
    activate
end tell
delay 0.5
tell application \"System Events\"
    tell process \"Code\"
        -- 创建新终端（Ctrl+Shift+\`）
        keystroke \"\`\" using {control down, shift down}
        delay 1.2
        -- 粘贴命令（Cmd+V），避免 keystroke 逐字符输入乱码
        keystroke \"v\" using {command down}
        delay 0.3
        -- 回车执行
        key code 36
    end tell
end tell
"
# ⚠️ 注意：
#   - Ctrl+Shift+\` 是 VS Code 默认的"New Terminal"快捷键
#   - 若用户自定义了快捷键，可能需要手动打开终端后告知 Claude "终端已打开"
#   - delay 1.2 是等待 shell 初始化（如 zsh .zshrc 加载）；慢机器可适当增大
```

**若 `IN_VSCODE=false`：回退到 Terminal.app**

```bash
osascript -e "tell application \"Terminal\"
  activate
  do script \"cd '$PROJECT_DIR' && $NODE_SWITCH_CMD && yarn start:mrn 2>&1 | tee /tmp/mrn_server.log\"
end tell"
# ⚠️ 注意：必须包含 cd '$PROJECT_DIR'，否则 Terminal 默认从 ~ 启动，yarn 找不到 package.json
```

#### 动态检测端口（新启动时）

等待 Metro 就绪后，从日志或 lsof 提取端口（**用项目路径过滤，不能只 grep node**）：

```bash
# 方式一：从日志提取（推荐）
sleep 5
MRN_PORT=$(lsof -iTCP -sTCP:LISTEN -n -P 2>/dev/null | grep -E "^node" | while read line; do
  PID=$(echo "$line" | awk '{print $2}')
  PORT=$(echo "$line" | awk '{print $9}' | grep -oE '[0-9]+$')
  CMD=$(ps -o command= -p "$PID" 2>/dev/null)
  if echo "$CMD" | grep -q "$PROJECT_DIR"; then
    echo "$PORT"
  fi
done | head -1)
echo "MRN Port: $MRN_PORT"
```

确认端口后，将 `$MRN_PORT` 用于后续深链拼接。

---

## 连接模拟器到本地服务器

### 获取本机 IP

```bash
ipconfig getifaddr en0
```

### 方式一：通过深链直接加载（推荐）

先获取 IP 和端口：
```bash
LOCAL_IP=$(ipconfig getifaddr en0)
# MRN_PORT 从上一步动态检测获得
xcrun simctl openurl booted "imeituan://www.meituan.com/mrn/debug?server=http://${LOCAL_IP}:${MRN_PORT}"
```

或从日志提取端口（推荐）：
```bash
LOCAL_IP=$(ipconfig getifaddr en0)
# 从日志提取端口（需先用 tee 启动服务器）
MRN_PORT=$(grep -oE "(Metro waiting on port|waiting on port|Started on port|h=[^:]+:)[0-9]+" /tmp/mrn_server.log | grep -oE "[0-9]+$" | tail -1)
echo "Port: $MRN_PORT"
xcrun simctl openurl booted "imeituan://www.meituan.com/mrn/debug?server=http://${LOCAL_IP}:${MRN_PORT}"
```

### 方式二：通过 Dev Menu iMeiTuan 协议跳转（手动）

1. 摇一摇（参见 [Dev Menu 操作](#dev-menu-操作)）
2. 选择「常用」→「iMeiTuan 协议跳转」
3. 输入 `imeituan://www.meituan.com/mrn/debug?server=http://<LOCAL_IP>:<MRN_PORT>`

### 刷新页面

重新执行 openurl 命令即可触发页面重载。

---

## Mock 场景选择（打开页面后自动触发）

每次深链打开页面后，**立即扫描项目是否存在模拟器 Mock 场景**，有则询问用户，选中后**自动运行对应的测试脚本**（脚本内部完整处理：开启 Mock → 触发深链 → 执行测试流程 → 关闭 Mock）。

### 扫描场景

```bash
SIMULATOR_DIR="$PROJECT_DIR/tests/simulator"

# 扫描有 test_*.py 的子目录（排除 helpers/）
SCENARIOS=()
SCENARIO_SCRIPTS=()
if [ -d "$SIMULATOR_DIR" ]; then
  for dir in "$SIMULATOR_DIR"/*/; do
    name=$(basename "$dir")
    [ "$name" = "helpers" ] && continue
    script=$(ls "$dir"test_*.py 2>/dev/null | head -1)
    if [ -n "$script" ]; then
      SCENARIOS+=("$name")
      SCENARIO_SCRIPTS+=("$script")
    fi
  done
fi
```

### 无场景时

`SCENARIOS` 为空 → **跳过，不展示任何提示**，直接结束。

### 有场景时

向用户展示编号列表（**格式固定如下**），等待输入：

```
🧪 检测到以下测试场景，选择后将自动运行：

  0) 不运行（默认，保持当前页面）
  1) normal_queue_flow  — 普通取号全流程
  2) notice_flow        — 排队提醒全流程

请输入选项编号（直接回车 = 0）：
```

- **0 / 直接回车**：不做任何操作，结束
- **1/2/...**：**直接运行对应场景的 `test_*.py` 脚本**，全程自动化

### 运行测试脚本

```bash
CHOSEN_SCRIPT="${SCENARIO_SCRIPTS[$((CHOSEN_NUM-1))]}"
echo "▶ 正在运行：$CHOSEN_SCRIPT"
python3 "$CHOSEN_SCRIPT"
```

测试脚本内部已封装完整流程，**无需用户手动操作**：
1. 批量开启所有 Mock
2. 触发深链打开页面
3. 等待渲染、OCR 定位、Quartz 点击
4. 截图验证各步骤
5. 测试完成后自动关闭所有 Mock

---

## 截图并查看

```bash
# 截图保存到 /tmp
xcrun simctl io booted screenshot /tmp/sim_screenshot.png

# 读取截图（Claude 会以视觉方式分析）
# 使用 Read 工具读取 /tmp/sim_screenshot.png
```

## 自动识别 UI 元素坐标（OCR）

> **推荐方案**：使用 macOS Vision 框架 OCR，自动识别截图中文字的像素坐标，无需人工介入。
> 依赖：`pip3 install pyobjc-framework-Vision`

```python
from Foundation import NSURL
from Quartz import CIImage
import Vision
from PIL import Image

image_path = "/tmp/sim_screenshot.png"
url = NSURL.fileURLWithPath_(image_path)
image = CIImage.imageWithContentsOfURL_(url)

request = Vision.VNRecognizeTextRequest.alloc().init()
request.setRecognitionLanguages_(["zh-Hans", "en-US"])
request.setUsesLanguageCorrection_(True)
request.setRecognitionLevel_(Vision.VNRequestTextRecognitionLevelAccurate)

handler = Vision.VNImageRequestHandler.alloc().initWithCIImage_options_(image, {})
handler.performRequests_error_([request], None)

img = Image.open(image_path)
W, H = img.size

# Vision 坐标系：左下角原点，y 轴向上 → 转换为左上角原点
for obs in request.results():
    text = obs.topCandidates_(1)[0].string()
    bbox = obs.boundingBox()
    px = int(bbox.origin.x * W)
    py = int((1 - bbox.origin.y - bbox.size.height) * H)
    pw = int(bbox.size.width * W)
    ph = int(bbox.size.height * H)
    cx = px + pw // 2  # 文字中心 x（截图像素坐标）
    cy = py + ph // 2  # 文字中心 y（截图像素坐标）
    print(f"{text} → 截图中心坐标: ({cx}, {cy})")
```

找到目标文字的截图坐标后，用坐标换算公式转为屏幕点击坐标（见「通过截图坐标换算屏幕点击坐标」章节）。

**通过截图坐标换算屏幕点击坐标**：

> 所有坐标单位说明：
> - `WIN_X/Y`：Quartz 返回的窗口左上角坐标（逻辑点 pt，CGEvent 直接使用）
> - `WIN_W/H`：窗口宽高（逻辑点 pt）
> - `BEZEL_*`：模拟器边框宽度（逻辑点 pt，通过 Accessibility API 动态获取）
> - `SW/SH`：截图宽高（像素 px）
> - `pic_x/pic_y`：OCR 识别的文字中心坐标（像素 px，内容区起算，不含 bezel）
> - `scale_x/y`：缩放比例，结果 > 1，保留两位小数
>
> **换算公式**：
> ```
> # grp_w/grp_h 即内容区宽高，等价于 WIN_W - BEZEL_LEFT - BEZEL_RIGHT
> scale = SW / grp_w   # 截图像素 / 内容区逻辑点，通常 ≈ 3.47（Retina）
>
> screen_x = WIN_X + BEZEL_LEFT + pic_x / scale
> screen_y = WIN_Y + BEZEL_TOP  + pic_y / scale
> ```

```python
import subprocess
import Quartz
from PIL import Image

# 1. 获取 Simulator 窗口位置（逻辑点，CGEvent 直接使用）
windows = Quartz.CGWindowListCopyWindowInfo(
    Quartz.kCGWindowListOptionOnScreenOnly | Quartz.kCGWindowListExcludeDesktopElements,
    Quartz.kCGNullWindowID
)
WIN_X, WIN_Y, WIN_W, WIN_H = 0, 0, 0, 0
for w in windows:
    if 'Simulator' in w.get('kCGWindowOwnerName', ''):
        b = w.get('kCGWindowBounds', {})
        WIN_X = int(b['X']); WIN_Y = int(b['Y'])
        WIN_W = int(b['Width']); WIN_H = int(b['Height'])
        break

# 2. 通过 Accessibility API 获取 bezel（逻辑点，准确动态）
# ⚠️ 修复：return 开头必须加 "" & 强制字符串拼接。
#    若以 integer & 开头，AppleScript 会返回列表而非字符串，导致 split(',') 解析失败。
script = '''
tell application "System Events"
    tell process "Simulator"
        set grp to group 1 of window 1
        set grpPos to position of grp
        set grpSize to size of grp
        return "" & (item 1 of grpPos) & "," & (item 2 of grpPos) & "," & (item 1 of grpSize) & "," & (item 2 of grpSize)
    end tell
end tell
'''
result = subprocess.run(['osascript', '-e', script], capture_output=True, text=True)
grp_x, grp_y, grp_w, grp_h = map(int, result.stdout.strip().split(','))

BEZEL_LEFT   = grp_x - WIN_X
BEZEL_TOP    = grp_y - WIN_Y
BEZEL_RIGHT  = WIN_W - BEZEL_LEFT - grp_w
BEZEL_BOTTOM = WIN_H - BEZEL_TOP  - grp_h

# 3. 读取截图尺寸
img = Image.open("/tmp/sim_screenshot.png")
SW, SH = img.size

# 4. 计算 scale（结果 > 1，保留两位小数）
scale_x = round(SW / (WIN_W - BEZEL_LEFT - BEZEL_RIGHT), 2)
scale_y = round(SH / (WIN_H - BEZEL_TOP  - BEZEL_BOTTOM), 2)

# 5. 换算公式：pic_x/pic_y 为 OCR 内容区像素坐标（不含 bezel）
def screenshot_to_screen(pic_x, pic_y):
    screen_x = int(WIN_X + BEZEL_LEFT + pic_x / scale_x)
    screen_y = int(WIN_Y + BEZEL_TOP  + pic_y / scale_y)
    return screen_x, screen_y

# 示例：大桌 OCR 坐标 (770, 564)
x, y = screenshot_to_screen(770, 564)
```

**⚠️ 注意**：
- OCR（Vision）输出的 `pic_x/pic_y` 是**内容区像素坐标，不含 bezel**
- bezel 通过 Accessibility API 动态获取，随模拟器缩放自动适应
- **窗口位置（WIN_X/WIN_Y）必须在每次点击前实时获取，不能复用缓存值**

### ⚠️ 窗口移动陷阱

模拟器窗口可能在两次操作之间被用户或系统移动，导致之前缓存的 `WIN_X/WIN_Y` 过期，点击偏移到错误位置。

**正确做法**：将取窗口坐标的代码与点击操作写在同一段 Python 中，确保每次点击都使用最新坐标：

```python
import subprocess, Quartz, time
from PIL import Image

def ensure_simulator_active():
    """
    每次点击前调用，确保 Simulator 窗口真正置顶且无遮挡。
    使用 open -a 而非仅 activate：
    - activate 只能保证进程 frontmost，但其他窗口仍可能覆盖模拟器点击区域
    - open -a 会将窗口彻底置顶，并自动处理 Mission Control Space 切换
    0.8s：macOS 窗口切换动画时间，偶尔较慢时可适当增大到 1.2s
    """
    subprocess.run(['open', '-a', 'Simulator'])
    time.sleep(0.8)  # 等待窗口置顶并清除遮挡

def get_screen_coord(pic_x, pic_y, screenshot_path="/tmp/sim_screenshot.png"):
    """
    每次调用都重新获取窗口位置和 bezel，防止窗口移动导致坐标偏移。
    pic_x/pic_y：OCR 得到的截图像素坐标（内容区，不含 bezel）
    """
    # 1. 确保模拟器在最前台（否则点击会被遮挡窗口拦截）
    ensure_simulator_active()

    # 2. 实时获取窗口位置
    windows = Quartz.CGWindowListCopyWindowInfo(
        Quartz.kCGWindowListOptionOnScreenOnly | Quartz.kCGWindowListExcludeDesktopElements,
        Quartz.kCGNullWindowID
    )
    WIN_X, WIN_Y = 0, 0
    for w in windows:
        if 'Simulator' in w.get('kCGWindowOwnerName', ''):
            b = w.get('kCGWindowBounds', {})
            WIN_X, WIN_Y = int(b['X']), int(b['Y'])
            break

    # 3. 实时获取 bezel（"" & 开头防止 AppleScript 返回列表）
    script = '''
tell application "System Events"
    tell process "Simulator"
        set grp to group 1 of window 1
        set grpPos to position of grp
        set grpSize to size of grp
        return "" & (item 1 of grpPos) & "," & (item 2 of grpPos) & "," & (item 1 of grpSize) & "," & (item 2 of grpSize)
    end tell
end tell
'''
    r = subprocess.run(['osascript', '-e', script], capture_output=True, text=True)
    grp_x, grp_y, grp_w, grp_h = map(int, r.stdout.strip().split(','))
    BEZEL_LEFT = grp_x - WIN_X
    BEZEL_TOP  = grp_y - WIN_Y

    # 4. 实时获取截图尺寸
    img = Image.open(screenshot_path)
    SW, SH = img.size
    scale_x = round(SW / grp_w, 2)
    scale_y = round(SH / grp_h, 2)

    screen_x = int(WIN_X + BEZEL_LEFT + pic_x / scale_x)
    screen_y = int(WIN_Y + BEZEL_TOP  + pic_y / scale_y)
    return screen_x, screen_y

def click(x, y):
    for evt_type, delay in [(Quartz.kCGEventMouseMoved, 0.05),
                             (Quartz.kCGEventLeftMouseDown, 0.1),
                             (Quartz.kCGEventLeftMouseUp, 0.05)]:
        e = Quartz.CGEventCreateMouseEvent(None, evt_type, (x, y), Quartz.kCGMouseButtonLeft)
        Quartz.CGEventPost(Quartz.kCGHIDEventTap, e)
        time.sleep(delay)

# 用法：每次点击都调用 get_screen_coord，不要在外部缓存坐标
# get_screen_coord 内部会自动确保模拟器在前台
sx, sy = get_screen_coord(pic_x=480, pic_y=562)
click(sx, sy)
```

**反面示例（错误）**：
```python
# ❌ 不要这样做：先获取坐标、中间做了其他操作、再点击
WIN_X, WIN_Y = get_window_pos()   # 此时窗口在 A 位置
do_other_stuff()                   # 用户可能移动了窗口
click(WIN_X + ..., WIN_Y + ...)    # 窗口已移到 B 位置，坐标偏移！
```

---

## UI 交互（点击）

**工具：Python Quartz**（AppleScript 键盘/鼠标注入在 macOS 新版被安全机制拦截）

```python
import Quartz
import time

def click(x, y):
    # 鼠标移动到目标位置
    move = Quartz.CGEventCreateMouseEvent(
        None,
        Quartz.kCGEventMouseMoved,
        (x, y),
        Quartz.kCGMouseButtonLeft
    )
    Quartz.CGEventPost(Quartz.kCGHIDEventTap, move)
    time.sleep(0.05)
    # 按下
    down = Quartz.CGEventCreateMouseEvent(
        None,
        Quartz.kCGEventLeftMouseDown,
        (x, y),
        Quartz.kCGMouseButtonLeft
    )
    Quartz.CGEventPost(Quartz.kCGHIDEventTap, down)
    time.sleep(0.1)
    # 抬起
    up = Quartz.CGEventCreateMouseEvent(
        None,
        Quartz.kCGEventLeftMouseUp,
        (x, y),
        Quartz.kCGMouseButtonLeft
    )
    Quartz.CGEventPost(Quartz.kCGHIDEventTap, up)

click(X, Y)  # 替换为目标屏幕坐标
```

### 坐标校准流程

1. 截图 → 用 OCR（Vision 框架）自动识别目标元素的 `pic_x/pic_y`
2. 调用 `get_screen_coord(pic_x, pic_y)` 换算为屏幕坐标（内含置顶 + bezel 计算）
3. 执行 `click(sx, sy)`，再截图用 OCR 验证结果
4. 如未生效，检查：① Simulator 是否被遮挡（重新 `open -a Simulator`）；② OCR 坐标是否准确（打印 bbox 边界确认）

---

## Dev Menu 操作

```bash
# 摇一摇（触发 Dev Menu）
xcrun simctl io booted shake

# 然后使用 Quartz 点击 Dev Menu 中的选项
# 先截图确认菜单出现，再定位按钮坐标
```

常用 Dev Menu 选项坐标（iPhone 14 Pro，窗口在左上角时参考值）：
- **Reload**：出现在菜单列表第一项，截图后定位

**注意**：菜单项名称为 "Shake"（不是 "Shake Device"）。

---

## 常见问题

| 问题 | 原因 | 解决方案 |
|---|---|---|
| `engine node incompatible` | Node 版本不符 | `n 16.20.0` |
| `Cannot find module 'axios'` | 依赖未安装 | `yarn add axios --ignore-engines` |
| 深链无反应 | 美团 App 未在前台 / 未安装 | 手动打开美团 App 后重试 |
| MRN 服务端口 | 每次启动不固定 | 从日志或 lsof 动态提取，不可硬编码 |
| VS Code 新终端未打开 / 命令未输入 | 用户自定义了 `Ctrl+Shift+\`` 快捷键，或 VS Code 失去焦点 | 在 VS Code 中手动 `Ctrl+Shift+\`` 打开新终端，然后告知 Claude "终端已打开"，Claude 会重新输入命令 |
| VS Code 检测为 false 但希望用 VS Code 终端 | 未从 VS Code 终端启动 Claude Code | 告知 Claude "在 VS Code 里启动"，Claude 会强制走 VS Code 路径 |
| 点击无响应 | 坐标偏移 | 截图校准 + ±30px 调整 |
| 点击位置整体偏移（不只差几像素） | 两次操作之间模拟器窗口被移动，WIN_X/Y 过期 | 每次点击前调用 `get_screen_coord()` 实时获取，不缓存窗口坐标 |
| 点击正确位置但无任何反应 | 其他窗口遮挡了模拟器点击区域（即便进程 frontmost 也可能被遮挡） | `ensure_simulator_active()` 已内置于 `get_screen_coord`，用 `open -a Simulator` 彻底置顶；如仍无效，手动将模拟器窗口拖到无遮挡处 |

---

## 项目快速参考

| 项目 | 值 |
|---|---|
| 项目路径 | 默认当前目录；无 `package.json` 则询问用户 |
| MRN 启动命令 | `yarn start:mrn`（通用）|
| 服务端口 | **动态**，每次启动后从日志或 lsof 提取 |
| Node 版本要求 | 从 `.nvmrc` / `.node-version` / `package.json engines` 动态读取 |
| 深链模板 | `imeituan://www.meituan.com/mrn/debug?server=http://<LOCAL_IP>:<MRN_PORT>` |
