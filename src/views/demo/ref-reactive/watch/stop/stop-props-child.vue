<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-28 11:04:51
 * @Description: 子组件异步监听父组件的props变量-子组件
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/watch/stop/stop-props-child.vue
-->
<template>
  <h4>子组件</h4>
  <div class="box">
    <p>props-count：{{ count }}</p>
  </div>
  <pre>
const props = defineProps({
  count: {
    type: Number,
    default: 0,
  },
})

onUnmounted(() => {
  console.log('props-子组件卸载了')
})

setTimeout(() => {
  watch(() => props.count, (newVal, oldVal) => {
    console.log('props-count 变化了', newVal, oldVal)
  })
  console.log('props-watch 注册完成')
},2000)
</pre>
</template>
<script setup>
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    default: 0,
  },
})

onUnmounted(() => {
  console.log('props-子组件卸载了')
})

setTimeout(() => {
  watch(() => props.count, (newVal, oldVal) => {
    console.log('props-count 变化了', newVal, oldVal)
  })
  console.log('props-watch 注册完成')
},2000)
</script>
