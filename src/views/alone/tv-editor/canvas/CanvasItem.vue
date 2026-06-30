<template>
  <div
    class="canvas-item"
    :class="{ 'canvas-item--selected': isSelected, 'canvas-item--editing': isEditing }"
    :style="itemStyle"
    @mousedown.stop="onMoveStart"
    @click.stop="onSelect"
    @dblclick.stop="onDblClick"
  >
    <!-- 文本内联编辑：双击进入，失焦 / Esc 退出 -->
    <div
      v-if="isEditing"
      ref="textEditor"
      contenteditable="true"
      class="canvas-item__text-editor"
      :style="textEditorStyle"
      @input="onTextInput"
      @blur="onEditEnd"
      @keydown.esc.stop="onEditEnd"
      @mousedown.stop
      @click.stop
    />
    <!-- 组件内容渲染 -->
    <component v-else :is="widget" :props="comp.props" class="canvas-item__content" />

    <!-- 选中状态：删除按钮 + resize handles -->
    <template v-if="isSelected && !isEditing">
      <span class="canvas-item__delete" @mousedown.stop @click.stop="onDelete">✕ 删除</span>
      <span
        v-for="handle in resizeHandles"
        :key="handle"
        :class="`canvas-item__handle canvas-item__handle--${handle}`"
        @mousedown.stop="e => onResizeStart(e, handle)"
      />
    </template>
  </div>
</template>

<script>
// CanvasItem 保留 Options API 以使用 $refs、$nextTick 等便捷 API
import { COMPONENT_REGISTRY } from '../components/component-items/index.js'
import state, {
  selectComponent,
  deleteComponent,
  updateComponent,
  updateComponentProps,
  pushHistory,
} from '../useEditorStore.js'

export default {
  name: 'CanvasItem',
  props: {
    comp: { type: Object, required: true },
    scaleRatio: { type: Number, default: 1 },
  },
  data() {
    return {
      isEditing: false,
      resizeHandles: ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'],
    }
  },
  computed: {
    isSelected() {
      return state.selectedId === this.comp.id
    },
    widget() {
      return COMPONENT_REGISTRY[this.comp.type] && COMPONENT_REGISTRY[this.comp.type].widget
    },
    itemStyle() {
      const { x, y, width, height, zIndex } = this.comp
      return {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex,
        cursor: this.isEditing ? 'text' : 'move',
        boxSizing: 'border-box',
        userSelect: 'none',
      }
    },
    textEditorStyle() {
      const p = this.comp.props
      return {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        outline: 'none',
        padding: '0',
        overflow: 'hidden',
        background: 'transparent',
        fontSize: `${p.fontSize || 32}px`,
        color: p.color || '#333333',
        fontWeight: p.bold ? 'bold' : 'normal',
        wordBreak: 'break-all',
        fontFamily: 'inherit',
        cursor: 'text',
      }
    },
  },
  methods: {
    onSelect() {
      selectComponent(this.comp.id)
    },
    onDelete() {
      deleteComponent(this.comp.id)
    },
    onDblClick() {
      if (this.comp.type !== 'text') return
      this.isEditing = true
      this.$nextTick(() => {
        const el = this.$refs.textEditor
        if (!el) return
        el.innerText = this.comp.props.content || ''
        el.focus()
        const range = document.createRange()
        range.selectNodeContents(el)
        range.collapse(false)
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      })
    },
    onTextInput(e) {
      updateComponentProps(this.comp.id, { content: e.target.innerText })
    },
    onEditEnd() {
      this.isEditing = false
    },
    onMoveStart(e) {
      if (e.button !== 0 || this.isEditing) return
      selectComponent(this.comp.id)
      pushHistory()

      const startMouseX = e.clientX
      const startMouseY = e.clientY
      const startX = this.comp.x
      const startY = this.comp.y

      const onMouseMove = (mv) => {
        const dx = (mv.clientX - startMouseX) / this.scaleRatio
        const dy = (mv.clientY - startMouseY) / this.scaleRatio
        updateComponent(this.comp.id, {
          x: Math.round(startX + dx),
          y: Math.round(startY + dy),
        })
      }
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
    onResizeStart(e, handle) {
      if (e.button !== 0) return
      e.stopPropagation()
      pushHistory()

      const startMouseX = e.clientX
      const startMouseY = e.clientY
      const { x: startX, y: startY, width: startW, height: startH } = this.comp

      const onMouseMove = (mv) => {
        const dx = (mv.clientX - startMouseX) / this.scaleRatio
        const dy = (mv.clientY - startMouseY) / this.scaleRatio
        let newX = startX; let newY = startY; let newW = startW; let newH = startH

        if (handle.includes('e')) newW = startW + dx
        if (handle.includes('s')) newH = startH + dy
        if (handle.includes('w')) { newW = startW - dx; newX = startX + dx }
        if (handle.includes('n')) { newH = startH - dy; newY = startY + dy }

        updateComponent(this.comp.id, {
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newW),
          height: Math.round(newH),
        })
      }
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    },
  },
}
</script>

<style scoped>
.canvas-item {
  outline: 1px dashed rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
}

.canvas-item:hover {
  outline: 1px dashed #409eff;
}

.canvas-item--selected,
.canvas-item--editing {
  outline: 2px solid #409eff;
  outline-offset: 1px;
}

.canvas-item__text-editor,
.canvas-item__content {
  width: 100%;
  height: 100%;
}

.canvas-item__content {
  pointer-events: none;
}

.canvas-item__delete {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  height: 20px;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 11px;
  color: #fff;
  white-space: nowrap;
  cursor: pointer;
  background: rgba(245, 34, 45, 0.85);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.canvas-item__handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border: 1px solid #409eff;
  border-radius: 50%;
  z-index: 10;
}

.canvas-item__handle--nw { top: -4px; left: -4px; cursor: nw-resize; }
.canvas-item__handle--n  { top: -4px; left: calc(50% - 4px); cursor: n-resize; }
.canvas-item__handle--ne { top: -4px; right: -4px; cursor: ne-resize; }
.canvas-item__handle--e  { top: calc(50% - 4px); right: -4px; cursor: e-resize; }
.canvas-item__handle--se { bottom: -4px; right: -4px; cursor: se-resize; }
.canvas-item__handle--s  { bottom: -4px; left: calc(50% - 4px); cursor: s-resize; }
.canvas-item__handle--sw { bottom: -4px; left: -4px; cursor: sw-resize; }
.canvas-item__handle--w  { top: calc(50% - 4px); left: -4px; cursor: w-resize; }
</style>
