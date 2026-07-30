<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-28 11:04:51
 * @Description: 子组件异步监听全局响应式变量vuex-子组件
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/watch/stop/stop-vuex-child.vue
-->
<template>
  <h4>子组件</h4>
  <div class="box">
    <p>vuex -> state.num.count：{{ count }}</p>
  </div>
  <pre>
const store = useStore()
const count = computed(() => store.state.num.count)

setTimeout(() => {
  watch(
    count,// ✅ 计算属性得到的count
    // () => store.state.num.count, // ✅ getter函数
    // () => count, // ❌ getter函数 返回计算属性得到的count
    // store.state.num.count, //  ❌ 直接使用vuex
    (newVal, oldVal) => {
      console.log('vuex-count 变化了', newVal, oldVal)
    }
  )
  console.log('vuex-watch 注册完成')
},2000)
</pre>
</template>
<script setup>
import { watch, onUnmounted,computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const count = computed(() => store.state.num.count)
let stop = null
setTimeout(() => {
  stop = watch(
    count,// ✅ 计算属性得到的count
    // () => store.state.num.count, // ✅ getter函数
    // () => count, // ❌ getter函数 返回计算属性得到的count
    // store.state.num.count, //  ❌ 直接使用vuex
    (newVal, oldVal) => {
      console.log('vuex-count 变化了', newVal, oldVal)
    }
  )
  console.log('vuex-watch 注册完成')
},2000)

onUnmounted(() => {
  // stop & stop()
  console.log('vuex-子组件卸载了')
})

</script>
