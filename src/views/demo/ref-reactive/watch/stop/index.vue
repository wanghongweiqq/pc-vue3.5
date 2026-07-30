<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-28 15:45:27
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/watch/stop/index.vue
-->
<template>
  <StopIf />
  <StopVuex />
  <StopProps />

  <div class="content">
    <h2>watch 手动清理</h2>
    <p>大多数情况不需要，Vue 会自动帮你清理，但有例外。大致分为以下三种：</p>

    <p>1、自动清理：在 setup / 组件内同步创建</p>
    <pre>{{ `// script setup 或 setup() 内同步创建 → 组件卸载时自动停止
const count = ref(0)
watch(count, (newVal) => {
  console.log(newVal)
})
// ✅ 无需手动 stop，组件销毁时自动清理` }}</pre>

    <p>2、需要手动清理：异步创建的 watch</p>
    <pre>{{ `// ❌ 异步创建（在 setTimeout / Promise / 事件回调里）
// Vue 无法追踪到这个 watcher，组件卸载后它仍然存在
setTimeout(() => {
  watch(count, (newVal) => {
    console.log(newVal)  // 组件已卸载，仍在执行 → 内存泄漏
  })
}, 1000)

// ✅ 需要手动 stop
let stop = null
setTimeout(() => {
  stop = watch(count, (newVal) => { console.log(newVal) })
}, 1000)

onUnmounted(() => {
  stop && stop()
})` }}</pre>

    <p>3、需要提前停止：条件性监听</p>
    <pre>{{ `const stop = watch(count, (newVal) => {
  if (newVal >= 10) {
    stop()  // 达到条件后立即停止
  }
})` }}</pre>

    <h4>清理时机总结</h4>
    <table class="table">
      <tbody>
        <tr>
          <th>场景</th>
          <th>是否需要手动 stop</th>
        </tr>
        <tr>
          <td>setup / script setup 内同步创建</td>
          <td>❌ 自动清理</td>
        </tr>
        <tr>
          <td>Options API watch: {} 选项</td>
          <td>❌ 自动清理</td>
        </tr>
        <tr>
          <td>setTimeout / Promise 内异步创建</td>
          <td>
            <p>✅ 需要手动 stop</p>
            <p>1、侦听源是组件内部 props/ref，组件卸载后，Vue 在响应式通知阶段会过滤掉组件实例绑定的响应链路的副作用 → watch 不会执行</p>
            <p>2、侦听源是全局响应式变量如 vuex，组件卸载后，组件卸载后依旧能触发，因为不属于组件实例绑定的响应链路，Vue 不会过滤。</p>
            <p>最后：虽然不再触发回调，但是watch 副作用函数没有被自动清除，闭包持有子组件相关变量如果组件频繁销毁重建，不断创建 setTimeout + watch，长期运行会累积闭包引用，造成内存占用上涨。</p>
            <p>不触发回调 ≠ 没有内存泄漏，还是需要手动清理watch监听</p>
          </td>
        </tr>
        <tr>
          <td>事件回调内创建</td>
          <td>✅ 需要手动 stop</td>
        </tr>
        <tr>
          <td>需要提前停止监听</td>
          <td>✅ 需要手动 stop</td>
        </tr>
      </tbody>
    </table>
    <p>经验：同步写在 setup 里的 watch 不用操心，<strong>异步创建的一定要记得 stop</strong>。</p>
  </div>
</template>
<script setup>
import StopVuex from './stop-vuex.vue'
import StopProps from './stop-props.vue'
import StopIf from './stop-if.vue'
</script>
