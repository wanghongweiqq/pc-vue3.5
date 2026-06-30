<template>
  <div class="editor-canvas__wrapper">
    <div
      ref="canvasRef"
      class="editor-canvas"
      :style="canvasStyle"
      @click.self="onCanvasClick"
      @dragover.prevent
      @drop="onDrop"
    >
      <canvas-item
        v-for="comp in components"
        :key="comp.id"
        :comp="comp"
        :scale-ratio="1"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import state, { deselectComponent, addComponent, toLogicCoord } from '../useEditorStore.js'
import { COMPONENT_REGISTRY } from '../components/component-items/index.js'
import CanvasItem from './CanvasItem.vue'

const canvasRef = ref(null)

const canvasStyle = computed(() => ({
  width: `${state.canvas.width}px`,
  height: `${state.canvas.height}px`,
  backgroundColor: state.canvas.background,
}))

const components = computed(() => state.components)

function onCanvasClick() {
  deselectComponent()
}

function onDrop(e) {
  const type = e.dataTransfer.getData('componentType')
  if (!type || !COMPONENT_REGISTRY[type]) return

  const rect = canvasRef.value.getBoundingClientRect()
  const { x, y } = toLogicCoord(e.clientX, e.clientY, rect, 1)
  const { defaultProps, defaultSize } = COMPONENT_REGISTRY[type]

  addComponent(
    type,
    defaultProps,
    defaultSize,
    Math.round(x - defaultSize.w / 2),
    Math.round(y - defaultSize.h / 2),
  )
}
</script>

<style scoped>
.editor-canvas__wrapper {
  flex: 1;
  overflow: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px;
  background: #f0f0f0;
}

.editor-canvas {
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}
</style>
