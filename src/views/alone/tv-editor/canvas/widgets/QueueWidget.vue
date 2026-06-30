<template>
  <div class="widget-queue" :style="containerStyle">
    <div v-if="componentProps.props.showTitle" class="widget-queue__title" :style="itemStyle">
      {{ componentProps.props.dataType === 'call' ? '叫号队列' : '等位队列' }}
    </div>
    <div v-for="(item, i) in displayList" :key="i" class="widget-queue__item" :style="itemStyle">
      {{ item.num }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { mockWaitQueue, mockCallQueue } from '../../mock/tv-editor.js'

const componentProps = defineProps({
  props: { type: Object, default: () => ({}) },
})

const sourceList = computed(() =>
  componentProps.props.dataType === 'call' ? mockCallQueue : mockWaitQueue,
)

const displayList = computed(() => {
  const rows = componentProps.props.rows || 5
  const cols = componentProps.props.cols || 3
  return sourceList.value.slice(0, rows * cols)
})

const containerStyle = computed(() => ({
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateColumns: `repeat(${componentProps.props.cols || 3}, 1fr)`,
  gap: '8px',
  padding: '8px',
  boxSizing: 'border-box',
}))

const itemStyle = computed(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: `${componentProps.props.fontSize || 28}px`,
  color: componentProps.props.color || '#333333',
  fontWeight: componentProps.props.bold ? 'bold' : 'normal',
  fontFamily: componentProps.props.fontFamily || 'inherit',
  letterSpacing: componentProps.props.letterSpacing ? `${componentProps.props.letterSpacing}px` : 'normal',
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '4px',
}))
</script>
