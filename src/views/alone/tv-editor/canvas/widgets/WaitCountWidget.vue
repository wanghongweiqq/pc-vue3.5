<template>
  <div class="widget-waitcount" :style="containerStyle">
    <div class="widget-waitcount__total">
      <span class="widget-waitcount__label" :style="labelStyle">当前等位</span>
      <span class="widget-waitcount__num" :style="numStyle">{{ displayCount }}</span>
      <span class="widget-waitcount__unit" :style="labelStyle">桌</span>
    </div>
    <div v-if="componentProps.props.showCallNum" class="widget-waitcount__call" :style="callStyle">
      正在叫号：{{ mockData.callNum }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { mockWaitCount } from '../../mock/tv-editor.js'

const componentProps = defineProps({
  props: { type: Object, default: () => ({}) },
})

const mockData = mockWaitCount

const displayCount = computed(() => {
  const max = componentProps.props.maxDisplay || 0
  return max > 0 ? Math.min(mockData.total, max) : mockData.total
})

const containerStyle = computed(() => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}))

const numStyle = computed(() => ({
  fontSize: `${componentProps.props.fontSize || 48}px`,
  color: componentProps.props.color || '#333333',
  fontWeight: componentProps.props.bold ? 'bold' : 'normal',
  fontFamily: componentProps.props.fontFamily || 'inherit',
  letterSpacing: componentProps.props.letterSpacing ? `${componentProps.props.letterSpacing}px` : 'normal',
  margin: '0 8px',
}))

const labelStyle = computed(() => ({
  fontSize: `${componentProps.props.fontSize || 24}px`,
  color: componentProps.props.color || '#333333',
  fontFamily: componentProps.props.fontFamily || 'inherit',
  letterSpacing: componentProps.props.letterSpacing ? `${componentProps.props.letterSpacing}px` : 'normal',
}))

const callStyle = computed(() => ({
  fontSize: `${componentProps.props.fontSize || 20}px`,
  color: componentProps.props.color || '#333333',
  fontFamily: componentProps.props.fontFamily || 'inherit',
  letterSpacing: componentProps.props.letterSpacing ? `${componentProps.props.letterSpacing}px` : 'normal',
  marginTop: '8px',
}))
</script>
