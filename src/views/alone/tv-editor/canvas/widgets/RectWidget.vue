<template>
  <div class="widget-rect" :style="rectStyle" />
</template>

<script setup>
import { computed } from 'vue'

const { props: p } = defineProps({
  props: { type: Object, default: () => ({}) },
})

const rectStyle = computed(() => ({
  width: '100%',
  height: '100%',
  backgroundColor: p.hasFill ? (p.fillColor || 'rgba(255,255,255,0.1)') : 'transparent',
  border: `${p.borderWidth || 2}px ${p.borderStyle || 'solid'} ${p.borderColor || '#333333'}`,
  borderRadius: `${p.borderRadius || 0}px`,
  opacity: p.opacity !== undefined ? p.opacity : 1,
  boxSizing: 'border-box',
}))
</script>
