/**
 * TV 显示屏渲染器
 * 读取 MOCK_CONFIG，按 canvas + components 配置动态渲染
 *
 * 缩放方案：html { font-size = viewport / 750 }
 * 即 1rem = 1px（750 设计稿），自动等比适配任意屏幕尺寸
 */

// =============================================
// 入口
// =============================================
function init () {
  const data = MOCK_CONFIG
  setupCanvas(data.canvas)
  // 按 zIndex 升序渲染，保证层叠顺序正确
  const sorted = [...data.components].sort((a, b) => a.zIndex - b.zIndex)
  sorted.forEach((comp) => renderComponent(comp))
}

// =============================================
// 画布：尺寸 + 背景色 + 基准字号自适应
// 浏览器宽高比 > 画布宽高比 → 以视口高度为基准
// 浏览器宽高比 ≤ 画布宽高比 → 以视口宽度为基准
// =============================================
function setupCanvas (canvasConfig) {
  const el = document.getElementById('canvas')
  const { width, height, background } = canvasConfig

  el.style.width = width + 'rem'
  el.style.height = height + 'rem'
  el.style.background = background

  function applyScale () {
    const browserRatio = window.innerWidth / window.innerHeight
    const canvasRatio = width / height

    const fontSize = browserRatio > canvasRatio
      ? window.innerHeight / height // 浏览器更宽：高度撑满
      : window.innerWidth / width // 浏览器更高：宽度撑满

    document.documentElement.style.fontSize = fontSize + 'px'
  }

  applyScale()
  window.addEventListener('resize', applyScale)
}

// =============================================
// 组件分发
// =============================================
function renderComponent (comp) {
  const canvas = document.getElementById('canvas')

  const el = document.createElement('div')
  el.className = 'comp comp-' + comp.type
  el.style.left = comp.x + 'rem'
  el.style.top = comp.y + 'rem'
  el.style.width = comp.width + 'rem'
  el.style.height = comp.height + 'rem'
  el.style.zIndex = comp.zIndex

  switch (comp.type) {
    case 'text': renderText(el, comp.props); break
    case 'date': renderDate(el, comp.props); break
    case 'image': renderImage(el, comp.props); break
    case 'rect': renderRect(el, comp.props); break
    case 'line': renderLine(el, comp.props); break
    case 'waitCount': renderWaitCount(el, comp.props); break
    case 'queue': renderQueue(el, comp.props); break
    default:
      console.warn('[tv] 未知组件类型:', comp.type)
  }

  canvas.appendChild(el)
}

// =============================================
// text 组件
// =============================================
function renderText (el, props) {
  el.textContent = props.content ?? ''
  applyTextStyle(el, props)
}

// =============================================
// date 组件：每秒刷新
// =============================================
function renderDate (el, props) {
  applyTextStyle(el, props)
  function tick () {
    el.textContent = formatDate(new Date(), props.format ?? 'YYYY-MM-DD HH:mm:ss')
  }
  tick()
  setInterval(tick, 1000)
}

// =============================================
// image 组件：单图/视频展示，多媒体自动轮播
// mediaList 支持两种格式：
//   { url, type }  type=2 图片 / type=1 视频（编辑器保存格式）
//   纯字符串 url（兼容旧格式）
// =============================================
function renderImage (el, props) {
  const rawList = props.mediaList || []
  if (!rawList.length) return

  // 统一为 { url, type } 格式
  const list = rawList.map(item =>
    typeof item === 'string' ? { url: item, type: 2 } : item
  )

  let index = 0

  function showMedia (item) {
    el.innerHTML = ''
    if (item.type === 1) {
      // 视频
      const video = document.createElement('video')
      video.src = item.url
      video.muted = true
      video.loop = true
      video.autoplay = true
      video.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;'
      el.appendChild(video)
    } else {
      // 图片
      const img = document.createElement('img')
      img.src = item.url
      img.alt = ''
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;'
      el.appendChild(img)
    }
  }

  showMedia(list[0])

  if (props.autoPlay && list.length > 1) {
    setInterval(() => {
      index = (index + 1) % list.length
      showMedia(list[index])
    }, (props.interval ?? 3) * 1000)
  }
}

// =============================================
// rect 组件：矩形框（填充/边框/圆角/透明度）
// =============================================
function renderRect (el, props) {
  const bw = props.borderWidth ?? 2
  el.style.backgroundColor = props.hasFill ? (props.fillColor || '#ffffff') : 'transparent'
  el.style.border = `${ bw }px ${ props.borderStyle || 'solid' } ${ props.borderColor || '#333333' }`
  el.style.borderRadius = (props.borderRadius ?? 0) + 'rem'
  el.style.opacity = props.opacity ?? 1
  el.style.boxSizing = 'border-box'
}

// =============================================
// line 组件：横线 / 竖线
// =============================================
function renderLine (el, props) {
  const isH = (props.direction || 'horizontal') === 'horizontal'
  const lineWidth = props.lineWidth ?? 2

  // 外层 el 作为居中容器
  el.style.display = 'flex'
  el.style.alignItems = 'center'
  el.style.justifyContent = 'center'

  const line = document.createElement('div')
  line.style.backgroundColor = props.color || '#333333'
  line.style.opacity = props.opacity ?? 1
  line.style.borderRadius = lineWidth + 'rem'

  if (isH) {
    line.style.width = '100%'
    line.style.height = lineWidth + 'rem'
  } else {
    line.style.width = lineWidth + 'rem'
    line.style.height = '100%'
  }

  el.appendChild(line)
}

// =============================================
// waitCount 组件：等位人数 + 可选叫号
// 实时数据来自 MOCK_REALTIME.waitCount（实际接入时替换为接口）
// =============================================
function renderWaitCount (el, props) {
  const data = MOCK_REALTIME.waitCount
  const max = props.maxDisplay || 0
  const total = max > 0 ? Math.min(data.total, max) : data.total
  const fs = props.fontSize || 40
  const color = props.color || '#333333'

  const baseStyle = [
    props.fontFamily ? `font-family:${ props.fontFamily };` : '',
    props.letterSpacing ? `letter-spacing:${ props.letterSpacing }rem;` : '',
  ].join('')

  el.style.display = 'flex'
  el.style.flexDirection = 'column'
  el.style.alignItems = 'center'
  el.style.justifyContent = 'center'

  // "当前等位 N 桌"
  const labelStyle = `font-size:${ fs * 0.65 }rem;color:${ color };${ baseStyle }`
  const numStyle = `font-size:${ fs }rem;color:${ color };${ props.bold ? 'font-weight:bold;' : '' }${ baseStyle }margin:0 8px;`

  const totalRow = document.createElement('div')
  totalRow.style.cssText = 'display:flex;align-items:baseline;'
  totalRow.innerHTML =
    `<span style="${ labelStyle }">当前等位</span>` +
    `<span style="${ numStyle }">${ total }</span>` +
    `<span style="${ labelStyle }">桌</span>`
  el.appendChild(totalRow)

  // "正在叫号：A008"（可选）
  if (props.showCallNum) {
    const callRow = document.createElement('div')
    callRow.style.cssText =
      `margin-top:6px;font-size:${ fs * 0.55 }rem;color:${ color };${ baseStyle }`
    callRow.textContent = `正在叫号：${ data.callNum }`
    el.appendChild(callRow)
  }
}

// =============================================
// queue 组件：等位/叫号队列网格
// 实时数据来自 MOCK_REALTIME（实际接入时替换为接口）
// =============================================
function renderQueue (el, props) {
  const sourceList = props.dataType === 'call'
    ? MOCK_REALTIME.callQueue
    : MOCK_REALTIME.waitQueue

  const rows = props.rows || 5
  const cols = props.cols || 3
  const list = sourceList.slice(0, rows * cols)
  const fs = props.fontSize || 28
  const color = props.color || '#333333'

  const baseStyle = [
    props.bold ? 'font-weight:bold;' : '',
    props.fontFamily ? `font-family:${ props.fontFamily };` : '',
    props.letterSpacing ? `letter-spacing:${ props.letterSpacing }rem;` : '',
  ].join('')

  const cellStyle =
    'display:flex;align-items:center;justify-content:center;' +
    `font-size:${ fs }rem;color:${ color };${ baseStyle }` +
    'background:rgba(255,255,255,0.1);border-radius:4px;'

  el.style.display = 'grid'
  el.style.gridTemplateColumns = `repeat(${ cols }, 1fr)`
  el.style.gap = '8px'
  el.style.padding = '8px'
  el.style.boxSizing = 'border-box'

  // 可选标题行（跨全列）
  if (props.showTitle) {
    const title = document.createElement('div')
    title.style.cssText = cellStyle + 'grid-column:1/-1;'
    title.textContent = props.dataType === 'call' ? '叫号队列' : '等位队列'
    el.appendChild(title)
  }

  list.forEach(item => {
    const cell = document.createElement('div')
    cell.style.cssText = cellStyle
    cell.textContent = item.num
    el.appendChild(cell)
  })
}

// =============================================
// 公共：文字样式
// =============================================
function applyTextStyle (el, props) {
  if (props.fontSize !== undefined) el.style.fontSize = props.fontSize + 'rem'
  if (props.color) el.style.color = props.color
  if (props.bold) el.style.fontWeight = 'bold'
  if (props.fontFamily) el.style.fontFamily = props.fontFamily
  if (props.letterSpacing !== undefined) el.style.letterSpacing = props.letterSpacing + 'rem'
}

// =============================================
// 工具：日期格式化
// =============================================
function formatDate (date, format) {
  const pad = (n) => String(n).padStart(2, '0')
  return format
    .replace('YYYY', date.getFullYear())
    .replace('MM', pad(date.getMonth() + 1))
    .replace('DD', pad(date.getDate()))
    .replace('HH', pad(date.getHours()))
    .replace('mm', pad(date.getMinutes()))
    .replace('ss', pad(date.getSeconds()))
}

document.addEventListener('DOMContentLoaded', init)
