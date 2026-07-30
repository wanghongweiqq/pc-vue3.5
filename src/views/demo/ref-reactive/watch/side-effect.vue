<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-28 13:05:59
 * @Description: 副作用
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/watch/side-effect.vue
-->
<template>
  <div class="content">
    <h2>什么是副作用（Side Effect）</h2>
    <p>副作用是指函数或表达式<strong>除了返回值之外，对外部环境产生的影响</strong>。简单说：函数"顺手"做了别的事。</p>
    <h4>常见的副作用</h4>
    <ul>
      <li>修改外部变量（如 count++）</li>
      <li>DOM 操作（如 document.title = 'xxx'）</li>
      <li>网络请求（如 fetch()）</li>
      <li>定时器（如 setTimeout）</li>
      <li>控制台输出（如 console.log）</li>
      <li>本地存储（如 localStorage.setItem）</li>
    </ul>
    <h4>纯函数 vs 有副作用</h4>
    <pre>{{ `// 纯函数：无副作用，相同输入永远得到相同输出
function add(a, b) {
  return a + b
}

// 有副作用：修改了外部变量
let total = 0
function addToTotal(n) {
  total += n   // ← 副作用：修改了外部状态
  return total
}` }}</pre>
    <p>Vue 的 watch / watchEffect、React 的 useEffect 都是用来<strong>管理副作用</strong>的 —— 在合适的时机执行副作用，并在不需要时清理它们（取消请求、清除定时器等）。</p>

    <h3>清理副作用示例</h3>
    <h4>清理定时器</h4>
    <pre>
watch(count, (newVal, oldVal, onCleanup) => {
  const timer = setTimeout(() => { ... }, 1000)
  onCleanup(() => clearTimeout(timer))
})
</pre>    

    <h4>清理事件监听</h4>
    <pre>
watch(scrollID, (newVal, _, onCleanup) => {
  const el = document.getElementById(newVal)
  const handler = () => { …… }
  el?.addEventListener('scroll', handler)
  onCleanup(() => {
    el?.removeEventListener('scroll', handler)
  })
})
</pre>

    <h4>取消接口请求 - flag 标记法（不依赖 AbortController）</h4>
    <pre>
watch(userID, (newVal, _, onCleanup) => {
  let isActive = true
  ajax.getUserInfo({ userID: newVal}).then(() => { 
    if (isActive) {
      // 处理数据
    }
  })
  onCleanup(() => { isActive = false })
})
</pre>

    <h3>副作用清理函数-onCleanup 的执行时机</h3>
    <p>下一次 watch 回调执行之前，或者 watch 停止监听时（包括组件卸载）, 副作用清理函数里如果拿数据总是上一次的值。</p>
    <p>onCleanup = 在下一次来之前，收拾上一次的烂摊子</p>
    <pre>
第一次 watch 触发 x=1
    ↓
执行 callback 主体
    ↓
<em>注册 onCleanup 里的函数（此时还没执行！）x=1</em>
    ↓
[数据又变了] x=2
    ↓
<em>执行上一次注册的 onCleanup 函数 x=1</em>
    ↓
执行新的 callback
    ↓
<em>注册新的 onCleanup x=2</em>
    ↓
[组件卸载 / stop()]
    ↓
<em>执行最后一次注册的 onCleanup函数 x=2</em>  
</pre>
  </div>
</template>
