<template>
  <div class="widget-date" :style="dateStyle">{{ displayText }}</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const componentProps = defineProps({
  props: { type: Object, default: () => ({}) },
})

const now = ref(new Date())
let timer = null

onMounted(() => {
  timer = setInterval(() => { now.value = new Date() }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})

const dateStyle = computed(() => ({
  fontSize: `${componentProps.props.fontSize || 28}px`,
  color: componentProps.props.color || '#333333',
  fontWeight: componentProps.props.bold ? 'bold' : 'normal',
  fontFamily: componentProps.props.fontFamily || 'inherit',
  letterSpacing: componentProps.props.letterSpacing ? `${componentProps.props.letterSpacing}px` : 'normal',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
}))

const displayText = computed(() => {
  const d = now.value
  const pad = n => String(n).padStart(2, '0')
  const year = d.getFullYear()
  const month = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hour = pad(d.getHours())
  const min = pad(d.getMinutes())
  const sec = pad(d.getSeconds())
  const fmt = componentProps.props.format || 'YYYY-MM-DD'
  if (fmt === 'YYYY-MM-DD HH:mm') return `${year}-${month}-${day} ${hour}:${min}`
  if (fmt === 'YYYY-MM-DD HH:mm:ss') return `${year}-${month}-${day} ${hour}:${min}:${sec}`
  if (fmt === 'HH:mm:ss') return `${hour}:${min}:${sec}`
  return `${year}-${month}-${day}`
})
</script>
