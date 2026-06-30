<template>
  <div class="tv-display">
    <div
      ref="canvasRef"
      class="tv-display__canvas"
      :style="canvasStyle"
    >
      <div
        v-for="comp in sortedComponents"
        :key="comp.id"
        :style="compStyle(comp)"
      >
        <component
          :is="getWidget(comp.type)"
          :props="comp.props"
          style="width:100%;height:100%;"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { COMPONENT_REGISTRY } from '@/views/alone/tv-editor/components/component-items/index.js'
import MOCK_CONFIG from './mock.js'

// ── 数据来源 ──────────────────────────────────────────────
// 当前使用 mock 数据，接真实接口时将 MOCK_CONFIG 替换为接口返回值即可
const config = MOCK_CONFIG

// ── 缩放：transform: scale，不修改全局 font-size ──────────
const scale = ref(1)

function applyScale() {
  const { width, height } = config.canvas
  const bRatio = window.innerWidth / window.innerHeight
  const cRatio = width / height
  scale.value = bRatio > cRatio
    ? window.innerHeight / height   // 浏览器更宽 → 高度撑满
    : window.innerWidth  / width    // 浏览器更高 → 宽度撑满
}

onMounted(() => {
  applyScale()
  window.addEventListener('resize', applyScale)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', applyScale)
})

// ── 样式计算 ──────────────────────────────────────────────
const canvasStyle = computed(() => ({
  width:           config.canvas.width  + 'px',
  height:          config.canvas.height + 'px',
  background:      config.canvas.background,
  transform:       `scale(${scale.value})`,
  transformOrigin: 'center center',
}))

// 按 zIndex 升序渲染，保证层叠正确
const sortedComponents = computed(() =>
  [...config.components].sort((a, b) => a.zIndex - b.zIndex),
)

function compStyle(comp) {
  return {
    position: 'absolute',
    left:     comp.x      + 'px',
    top:      comp.y      + 'px',
    width:    comp.width  + 'px',
    height:   comp.height + 'px',
    zIndex:   comp.zIndex,
  }
}

function getWidget(type) {
  return COMPONENT_REGISTRY[type]?.widget ?? null
}
</script>

<style scoped>
/* 全屏黑色背景容器，独立于其他页面的样式 */
.tv-display {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  overflow: hidden;
}

.tv-display__canvas {
  position: relative;
  flex-shrink: 0;
}
</style>
