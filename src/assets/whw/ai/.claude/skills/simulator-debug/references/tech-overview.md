# 模拟器调试场景中使用的核心技术体系

## 整体架构

```
截图（xcrun simctl）
    ↓
OCR 识别（macOS Vision 框架）
    ↓
坐标换算（Quartz + Accessibility API）
    ↓
模拟点击（CGEvent）
    ↓
截图验证（循环）
```

---

## 1. `xcrun simctl` — 模拟器控制

Apple 官方命令行工具，操控 Xcode Simulator：

| 命令 | 用途 |
|---|---|
| `xcrun simctl boot <UDID>` | 启动指定设备 |
| `xcrun simctl io booted screenshot <path>` | 截取当前画面到文件 |
| `xcrun simctl openurl booted <deeplink>` | 发送深链，触发页面跳转 |
| `xcrun simctl io booted shake` | 模拟摇一摇（打开 Dev Menu） |
| `xcrun simctl location booted set <lat,lng>` | 设置 GPS 定位 |

截图是整个自动化流程的"眼睛"，所有后续判断都基于截图分析。

---

## 2. macOS Vision 框架 — OCR 文字识别

通过 `pyobjc-framework-Vision` 调用 Apple 原生 Vision API：

```python
import Vision
from Foundation import NSURL
from Quartz import CIImage

request = Vision.VNRecognizeTextRequest.alloc().init()
request.setRecognitionLanguages_(["zh-Hans", "en-US"])
request.setRecognitionLevel_(Vision.VNRequestTextRecognitionLevelAccurate)

handler = Vision.VNImageRequestHandler.alloc().initWithCIImage_options_(image, {})
handler.performRequests_error_([request], None)
```

**关键细节**：Vision 的坐标系以**左下角为原点**，y 轴向上，与屏幕坐标（左上角原点）相反，需要转换：

```python
px = int(bbox.origin.x * W)
py = int((1 - bbox.origin.y - bbox.size.height) * H)  # 翻转 Y 轴
```

识别出文字的像素坐标后，用于定位需要点击的 UI 元素（如"立即取号"按钮）。

---

## 3. Quartz CGWindowList — 窗口位置获取

通过 `pyobjc-framework-Quartz` 枚举当前屏幕所有窗口，找到 Simulator 的位置：

```python
import Quartz

windows = Quartz.CGWindowListCopyWindowInfo(
    Quartz.kCGWindowListOptionOnScreenOnly | Quartz.kCGWindowListExcludeDesktopElements,
    Quartz.kCGNullWindowID
)
for w in windows:
    if 'Simulator' in w.get('kCGWindowOwnerName', ''):
        b = w.get('kCGWindowBounds', {})
        WIN_X, WIN_Y = int(b['X']), int(b['Y'])
```

返回的是**逻辑点（pt）坐标**（非像素），CGEvent 点击直接使用。

---

## 4. AppleScript + Accessibility API — Bezel 获取

模拟器窗口有一圈边框（bezel），截图内容不包含 bezel，但点击坐标需要从整个窗口左上角算起，因此必须知道 bezel 的宽度。

通过 `osascript` 调用 Accessibility API 获取内容区 group 的位置和尺寸：

```applescript
tell application "System Events"
    tell process "Simulator"
        set grp to group 1 of window 1
        set grpPos to position of grp
        set grpSize to size of grp
        -- ⚠️ 必须以 "" & 开头，否则 AppleScript 返回列表而非字符串
        return "" & (item 1 of grpPos) & "," & (item 2 of grpPos) & ...
    end tell
end tell
```

```python
BEZEL_LEFT = grp_x - WIN_X
BEZEL_TOP  = grp_y - WIN_Y
```

---

## 5. 坐标换算 — 像素到屏幕逻辑点

这是整个链路的关键桥接：

```
截图像素坐标（OCR 输出）→ 屏幕逻辑点坐标（CGEvent 需要）
```

```python
# scale = 截图宽度(px) / 内容区宽度(pt)，Retina 屏通常 ≈ 3.47
scale_x = SW / grp_w

screen_x = WIN_X + BEZEL_LEFT + pic_x / scale_x
screen_y = WIN_Y + BEZEL_TOP  + pic_y / scale_y
```

**重要约束**：每次点击都必须**实时重新获取** `WIN_X/WIN_Y`，因为用户可能移动了模拟器窗口。

---

## 6. CGEvent — 模拟鼠标点击

这是"手"的部分。选择 CGEvent 而非 AppleScript 键盘注入，原因是 **macOS 新版安全机制会拦截 AppleScript 的 keystroke/click**。

**CGEvent 使用逻辑点（pt），不是像素（px）。** 与 `CGWindowListCopyWindowInfo` 返回的窗口坐标单位一致，直接拼接使用。这也是坐标换算中必须除以 `scale` 的原因——OCR 输出的是截图像素坐标，若直接传给 CGEvent，点击位置会偏到右下角约 3.47 倍处。

```python
import Quartz, time

def click(x, y):
    for evt_type, delay in [
        (Quartz.kCGEventMouseMoved, 0.05),
        (Quartz.kCGEventLeftMouseDown, 0.1),
        (Quartz.kCGEventLeftMouseUp, 0.05)
    ]:
        e = Quartz.CGEventCreateMouseEvent(
            None, evt_type, (x, y), Quartz.kCGMouseButtonLeft
        )
        Quartz.CGEventPost(Quartz.kCGHIDEventTap, e)
        time.sleep(delay)
```

三步序列（Move → Down → Up）模拟真实点击，延迟确保系统有时间处理每个事件。

---

## 7. macOS 截屏键的坐标系

`Cmd+Shift+4` 拖选时屏幕上显示的数字是**逻辑点（pt）**，与 CGEvent、窗口 API 同一坐标系。

| 操作 | 坐标系 |
|---|---|
| 截屏拖选时屏幕显示的数字 | **逻辑点 pt** |
| 保存的截图文件图片尺寸 | **像素 px**（Retina 放大 2×） |
| 用 Preview 打开截图查看像素位置 | **像素 px** |

**实际影响：**
- 截屏拖选量到的坐标 → 直接传给 CGEvent，**不需要除以 scale**
- Preview 里量的截图内坐标 → 需要除以 scale 再传给 CGEvent

---

## 完整数据流（一次点击操作）

```
1. xcrun simctl io booted screenshot /tmp/sim.png
        ↓ (截图)
2. Vision OCR → 识别"立即取号"文字 → pic_x, pic_y（像素）
        ↓ (坐标识别)
3. Quartz CGWindowList → WIN_X, WIN_Y（窗口逻辑点位置）
4. osascript Accessibility → BEZEL_LEFT, BEZEL_TOP
5. scale = screenshot_width / content_area_width
        ↓ (坐标换算)
6. screen_x = WIN_X + BEZEL_LEFT + pic_x / scale
   screen_y = WIN_Y + BEZEL_TOP  + pic_y / scale
        ↓ (执行点击)
7. CGEventPost(kCGHIDEventTap, MouseDown + MouseUp)
        ↓ (验证)
8. 再次截图 + OCR 验证页面状态变化
```

这套方案的优势在于**完全不依赖模拟器内部 API 或 WebDriver**，纯粹通过截图 + OCR + 系统级事件实现，对任何 App（包括美团这类私有 App）都有效。
