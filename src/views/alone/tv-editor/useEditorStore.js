/**
 * TV 编辑器核心状态管理
 * 单例 reactive store，所有子组件直接 import 使用
 * 从 Vue2 @vue/composition-api 迁移到 Vue3 内置 Composition API
 */
import { reactive, ref, computed } from 'vue'

// 画板宽高比配置
export const RATIO_OPTIONS = [
  { label: '横屏 16:9', value: '16:9', w: 16, h: 9 },
  { label: '横屏 4:3', value: '4:3', w: 4, h: 3 },
  { label: '竖屏 9:16', value: '9:16', w: 9, h: 16 },
  { label: '竖屏 3:4', value: '3:4', w: 3, h: 4 },
]

// 画板逻辑宽度固定 750px，TV 端按此基准 rem 等比缩放
export const CANVAS_BASE_WIDTH = 750

/**
 * 根据宽高比计算画板高度
 * @param {string} ratio  比例字符串，如 "16:9"
 * @param {number} [w]    可选：宽比数值（自定义比例时传入）
 * @param {number} [h]    可选：高比数值（自定义比例时传入）
 */
export function calcCanvasHeight(ratio, w, h) {
  if (w && h && w > 0 && h > 0) {
    return Math.round(CANVAS_BASE_WIDTH / (w / h))
  }
  const opt = RATIO_OPTIONS.find(o => o.value === ratio)
  if (opt) return Math.round(CANVAS_BASE_WIDTH / (opt.w / opt.h))
  if (ratio && ratio.includes(':')) {
    const parts = ratio.split(':')
    const rw = parseFloat(parts[0])
    const rh = parseFloat(parts[1])
    if (rw > 0 && rh > 0) return Math.round(CANVAS_BASE_WIDTH / (rw / rh))
  }
  return 422
}

function genId() {
  const rand = Math.random().toString(36).slice(2, 7)
  return `comp_${Date.now()}_${rand}`
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

// ─── 撤销/重做历史栈 ──────────────────────────────────────────────────────────

const MAX_HISTORY = 50
const historyStack = []
const futureStack = []
const historyLen = ref(0)
const futureLen = ref(0)

// ─── 单例 Store ───────────────────────────────────────────────────────────────

const state = reactive({
  canvas: {
    width: CANVAS_BASE_WIDTH,
    height: 422,
    ratio: '16:9',
    background: '#ffffff',
  },
  components: [],
  selectedId: null,
  isDirty: false,
  templateName: '',
  showRatioDialog: true,
})

// ─── Getters ──────────────────────────────────────────────────────────────────

export const selectedComponent = computed(
  () => state.components.find(c => c.id === state.selectedId) || null,
)

function snapshot() {
  return {
    canvas: JSON.parse(JSON.stringify(state.canvas)),
    components: JSON.parse(JSON.stringify(state.components)),
  }
}

export function pushHistory() {
  historyStack.push(snapshot())
  if (historyStack.length > MAX_HISTORY) historyStack.shift()
  futureStack.length = 0
  historyLen.value = historyStack.length
  futureLen.value = 0
}

function applySnapshot(snap) {
  Object.assign(state.canvas, snap.canvas)
  state.components.splice(0, state.components.length, ...snap.components)
  state.selectedId = null
  state.isDirty = true
}

export function undo() {
  if (!historyStack.length) return
  futureStack.push(snapshot())
  applySnapshot(historyStack.pop())
  historyLen.value = historyStack.length
  futureLen.value = futureStack.length
}

export function redo() {
  if (!futureStack.length) return
  historyStack.push(snapshot())
  applySnapshot(futureStack.pop())
  historyLen.value = historyStack.length
  futureLen.value = futureStack.length
}

export const canUndo = computed(() => historyLen.value > 0)
export const canRedo = computed(() => futureLen.value > 0)

// ─── Actions ──────────────────────────────────────────────────────────────────

export function initCanvas(ratio, w, h) {
  state.canvas.ratio = ratio
  state.canvas.height = calcCanvasHeight(ratio, w, h)
  state.canvas.width = CANVAS_BASE_WIDTH
  state.components = []
  state.selectedId = null
  state.isDirty = false
  state.showRatioDialog = false
}

export function updateCanvas(patch) {
  pushHistory()
  Object.assign(state.canvas, patch)
  state.isDirty = true
}

export function addComponent(type, defaultProps, defaultSize, x, y) {
  const { width: cw, height: ch } = state.canvas
  const w = defaultSize.w
  const h = defaultSize.h
  const cx = x !== undefined ? x : Math.round((cw - w) / 2)
  const cy = y !== undefined ? y : Math.round((ch - h) / 2)

  const maxZIndex = state.components.reduce((m, c) => Math.max(m, c.zIndex), 0)
  const comp = {
    id: genId(),
    type,
    x: clamp(cx, 0, cw - w),
    y: clamp(cy, 0, ch - h),
    width: w,
    height: h,
    zIndex: maxZIndex + 1,
    props: { ...defaultProps },
  }
  pushHistory()
  state.components.push(comp)
  state.selectedId = comp.id
  state.isDirty = true
}

export function updateComponent(id, patch) {
  const comp = state.components.find(c => c.id === id)
  if (!comp) return
  const { width: cw, height: ch } = state.canvas
  const newX = patch.x !== undefined ? clamp(patch.x, 0, cw - comp.width) : comp.x
  const newY = patch.y !== undefined ? clamp(patch.y, 0, ch - comp.height) : comp.y
  const newW = patch.width !== undefined ? clamp(patch.width, 20, cw - newX) : comp.width
  const newH = patch.height !== undefined ? clamp(patch.height, 20, ch - newY) : comp.height
  comp.x = newX
  comp.y = newY
  comp.width = newW
  comp.height = newH
  state.isDirty = true
}

export function updateComponentProps(id, propsPatch) {
  const comp = state.components.find(c => c.id === id)
  if (!comp) return
  pushHistory()
  Object.assign(comp.props, propsPatch)
  state.isDirty = true
}

export function selectComponent(id) {
  state.selectedId = id
}

export function deselectComponent() {
  state.selectedId = null
}

export function deleteComponent(id) {
  const idx = state.components.findIndex(c => c.id === id)
  if (idx === -1) return
  pushHistory()
  state.components.splice(idx, 1)
  if (state.selectedId === id) state.selectedId = null
  state.isDirty = true
}

export function toLogicCoord(clientX, clientY, canvasRect, scaleRatio) {
  return {
    x: (clientX - canvasRect.left) / scaleRatio,
    y: (clientY - canvasRect.top) / scaleRatio,
  }
}

export function serialize() {
  return {
    templateName: state.templateName,
    canvas: { ...state.canvas },
    components: state.components.map(c => ({
      id: c.id,
      type: c.type,
      x: c.x,
      y: c.y,
      width: c.width,
      height: c.height,
      zIndex: c.zIndex,
      props: { ...c.props },
    })),
  }
}

export function markSaved() {
  state.isDirty = false
}

export function deserialize(data) {
  if (!data) return
  if (data.templateName) state.templateName = data.templateName
  if (data.canvas) Object.assign(state.canvas, data.canvas)
  if (data.components) {
    state.components.splice(0, state.components.length, ...data.components)
  }
  state.selectedId = null
  state.isDirty = false
  state.showRatioDialog = false
  historyStack.length = 0
  futureStack.length = 0
  historyLen.value = 0
  futureLen.value = 0
}

export function duplicateComponent(id) {
  const comp = state.components.find(c => c.id === id)
  if (!comp) return
  pushHistory()
  const maxZIndex = state.components.reduce((m, c) => Math.max(m, c.zIndex), 0)
  const newComp = {
    id: genId(),
    type: comp.type,
    x: Math.min(comp.x + 20, state.canvas.width - comp.width),
    y: Math.min(comp.y + 20, state.canvas.height - comp.height),
    width: comp.width,
    height: comp.height,
    zIndex: maxZIndex + 1,
    props: JSON.parse(JSON.stringify(comp.props)),
  }
  state.components.push(newComp)
  state.selectedId = newComp.id
  state.isDirty = true
}

export function nudgeComponent(id, dx, dy) {
  const comp = state.components.find(c => c.id === id)
  if (!comp) return
  const { width: cw, height: ch } = state.canvas
  const newX = dx !== 0 ? clamp(comp.x + dx, 0, cw - comp.width) : comp.x
  const newY = dy !== 0 ? clamp(comp.y + dy, 0, ch - comp.height) : comp.y
  comp.x = newX
  comp.y = newY
  state.isDirty = true
}

export function bringForward(id) {
  const comp = state.components.find(c => c.id === id)
  if (!comp) return
  const above = state.components
    .filter(c => c.id !== id && c.zIndex > comp.zIndex)
    .sort((a, b) => a.zIndex - b.zIndex)[0]
  if (!above) return
  pushHistory()
  const tmp = above.zIndex
  above.zIndex = comp.zIndex
  comp.zIndex = tmp
  state.isDirty = true
}

export function sendBackward(id) {
  const comp = state.components.find(c => c.id === id)
  if (!comp) return
  const below = state.components
    .filter(c => c.id !== id && c.zIndex < comp.zIndex)
    .sort((a, b) => b.zIndex - a.zIndex)[0]
  if (!below) return
  pushHistory()
  const tmp = below.zIndex
  below.zIndex = comp.zIndex
  comp.zIndex = tmp
  state.isDirty = true
}

export default state
