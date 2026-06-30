<template>
  <div class="widget-text" :style="textStyle">{{ props.content || '请输入文本' }}</div>
</template>

<script setup>
import { computed } from 'vue'

const componentProps = defineProps({
  props: { type: Object, default: () => ({}) },
})

const textStyle = computed(() => ({
  fontSize: `${componentProps.props.fontSize || 32}px`,
  color: componentProps.props.color || '#333333',
  fontWeight: componentProps.props.bold ? 'bold' : 'normal',
  fontFamily: componentProps.props.fontFamily || 'inherit',
  letterSpacing: componentProps.props.letterSpacing ? `${componentProps.props.letterSpacing}px` : 'normal',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  wordBreak: 'break-all',
}))
</script>
