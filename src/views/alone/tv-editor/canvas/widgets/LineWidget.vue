<template>
  <div class="widget-line" :style="containerStyle">
    <div :style="lineStyle" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const { props: p } = defineProps({
  props: { type: Object, default: () => ({}) },
})

const containerStyle = computed(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const lineStyle = computed(() => {
  const isH = (p.direction || 'horizontal') === 'horizontal'
  return {
    width: isH ? '100%' : `${p.lineWidth || 2}px`,
    height: isH ? `${p.lineWidth || 2}px` : '100%',
    backgroundColor: p.color || '#333333',
    opacity: p.opacity !== undefined ? p.opacity : 1,
    borderRadius: `${p.lineWidth || 2}px`,
  }
})
</script>
