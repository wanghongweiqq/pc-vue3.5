<template>
  <div class="content">
    <h2>watch / watchEffect / useEffect 对比</h2>

    <h3>什么是副作用（Side Effect）</h3>
    <p>副作用是指函数或表达式<strong>除了返回值之外，对外部环境产生的影响</strong>。简单说：函数"顺手"做了别的事。</p>
    <h4>常见的副作用</h4>
    <ul>
      <li>修改外部变量（如 <code>count++</code>）</li>
      <li>DOM 操作（如 <code>document.title = 'xxx'</code>）</li>
      <li>网络请求（如 <code>fetch()</code>）</li>
      <li>定时器（如 <code>setTimeout</code>）</li>
      <li>控制台输出（如 <code>console.log</code>）</li>
      <li>本地存储（如 <code>localStorage.setItem</code>）</li>
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
    <p>Vue 的 <code>watch</code> / <code>watchEffect</code>、React 的 <code>useEffect</code> 都是用来<strong>管理副作用</strong>的 —— 在合适的时机执行副作用，并在不需要时清理它们（取消请求、清除定时器等）。</p>

    <h3>一、watch</h3>
    <p>显式声明监听源，只在源发生变化时执行，可获取新旧值。</p>
    <pre>{{ `import { ref, watch } from 'vue'

const count = ref(0)

// 基础用法
watch(count, (newVal, oldVal) => {
  console.log('变化了', newVal, oldVal)
})

// immediate：组件挂载时立即执行一次
watch(count, (newVal) => {
  console.log('立即执行', newVal)
}, { immediate: true })

// deep：深度监听对象内部变化
const obj = ref({ a: { b: 1 } })
watch(obj, (newVal) => {
  console.log('深层变化', newVal)
}, { deep: true })

// 监听 getter（推荐：精准到具体属性，避免 deep 的性能开销）
watch(() => obj.value.a.b, (newVal, oldVal) => {
  console.log('精准监听', newVal, oldVal)
})

// 监听多个源
watch([count, () => obj.value.a.b], ([newCount, newB], [oldCount, oldB]) => {
  console.log('多源', newCount, newB)
})

// 停止监听
const stop = watch(count, () => { ... })
stop() // 调用返回值即可停止

// 清理副作用（如取消请求）
watch(count, (newVal, oldVal, onCleanup) => {
  const timer = setTimeout(() => { ... }, 1000)
  onCleanup(() => clearTimeout(timer))
})` }}</pre>

    <h3>二、watch、watchEffect 的 flush 选项 —— 回调什么时候执行</h3>
    <p><code>flush</code> 控制 watch 回调在 DOM 更新周期中的执行时机，有三个值：</p>
    <table class="table">
      <tbody>
        <tr>
          <th width="80">
            值
          </th>
          <th>执行时机</th>
          <th>能否拿到更新后的 DOM</th>
          <th>适用场景</th>
        </tr>
        <tr>
          <td><code>pre</code></td>
          <td>默认值，DOM 更新<em>之前</em></td>
          <td>❌ 拿不到</td>
          <td>需要在渲染前修改状态、取消即将发出的请求</td>
        </tr>
        <tr>
          <td><code>post</code></td>
          <td>DOM 更新<em>之后</em></td>
          <td>✅ 能拿到</td>
          <td>需要操作更新后的 DOM（如获取尺寸、滚动位置）</td>
        </tr>
        <tr>
          <td><code>sync</code></td>
          <td>响应式数据变化时<em>立即同步</em>执行</td>
          <td>❌ 拿不到（DOM 还没开始更新）</td>
          <td>极少使用，需严格保证在 DOM 变更前同步响应</td>
        </tr>
      </tbody>
    </table>
    <pre>{{ `const count = ref(0)

// 默认 flush: 'post'，DOM 更新后执行
watch(count, () => {
  console.log('DOM 已更新', document.querySelector('.count').textContent)
})

// flush: 'pre'，DOM 更新前执行
watch(count, () => {
  console.log('DOM 还没更新')
}, { flush: 'pre' })

// flush: 'sync'，立即同步执行
watch(count, () => {
  console.log('数据刚变，DOM 还没动')
}, { flush: 'sync' })` }}</pre>
    <p>执行顺序：<code>sync</code> → 组件渲染 → <code>pre</code> → DOM 更新 → <code>post</code></p>
    <p>💡 <strong>绝大多数场景用默认的 <code>'post'</code></strong>，因为通常需要在回调中操作更新后的 DOM。只有明确需要在渲染前拦截时才用 <code>'pre'</code>。<code>'sync'</code> 性能开销大，慎用。</p>

    <h3>三、watch 需要手动清理吗</h3>
    <p>大多数情况不需要，Vue 会自动帮你清理。但有例外。</p>

    <h4>自动清理：在 setup / 组件内同步创建</h4>
    <pre>{{ `// script setup 或 setup() 内同步创建 → 组件卸载时自动停止
const count = ref(0)
watch(count, (newVal) => {
  console.log(newVal)
})
// ✅ 无需手动 stop，组件销毁时自动清理` }}</pre>

    <h4>需要手动清理：异步创建的 watch</h4>
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

    <h4>需要提前停止：条件性监听</h4>
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
          <td>Options API <code>watch: {}</code> 选项</td>
          <td>❌ 自动清理</td>
        </tr>
        <tr>
          <td>setTimeout / Promise 内异步创建</td>
          <td>✅ 需要手动 stop</td>
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
    <p>经验：同步写在 <code>setup</code> 里的 watch 不用操心，<strong>异步创建的一定要记得 stop</strong>。</p>

    <h3>三、ref 对象 vs reactive 对象的 deep 差异</h3>
    <p>用 <code>ref</code> 还是 <code>reactive</code> 定义对象，watch 的 deep 默认行为<em>完全不同</em>，是常见踩坑点。</p>

    <h4>ref 定义的对象 —— deep 默认 false</h4>
    <pre>{{ `const obj = ref({ a: { b: 1 } })

watch(obj, (newVal) => { console.log('触发') })

obj.value.a.b = 2          // ❌ 不触发，deep 默认 false
obj.value = { a: { b: 2 } } // ✅ 触发，整体替换

// 需要监听内部变化时手动加 deep: true
watch(obj, (newVal) => { console.log('触发') }, { deep: true })
obj.value.a.b = 2          // ✅ 触发` }}</pre>

    <h4>reactive 定义的对象 —— deep 强制 true，无法关闭</h4>
    <pre>{{ `const obj = reactive({ a: { b: 1 } })

watch(obj, (newVal) => { console.log('触发') })

obj.a.b = 2   // ✅ 自动触发，deep 强制 true，设 false 也无效` }}</pre>

    <h4>对比</h4>
    <table class="table">
      <tbody>
        <tr>
          <th />
          <th><code>ref({})</code></th>
          <th><code>reactive({})</code></th>
        </tr>
        <tr>
          <td>watch deep 默认值</td>
          <td><code>false</code></td>
          <td>强制 <code>true</code>，无法关闭</td>
        </tr>
        <tr>
          <td>不加 deep 的触发条件</td>
          <td>整体替换 <code>.value</code></td>
          <td>任意层级属性变化</td>
        </tr>
        <tr>
          <td>推荐监听方式</td>
          <td><code>watch(() => obj.value.a.b, cb)</code> 精准到属性</td>
          <td><code>watch(() => obj.a.b, cb)</code> 精准到属性</td>
        </tr>
      </tbody>
    </table>
    <p>无论 ref 还是 reactive，<strong>推荐用 getter 精准监听到具体属性</strong>，避免 deep 递归遍历整个对象带来的性能开销。</p>

    <h3>三、watchEffect</h3>
    <p>自动追踪回调内用到的所有响应式依赖，立即执行一次，依赖变化时重新执行。</p>
    <pre>{{ `import { ref, watchEffect } from 'vue'

const count = ref(0)
const name = ref('Vue')

// 自动追踪 count 和 name，任意一个变化都重新执行
watchEffect(() => {
  console.log(count.value, name.value)  // 立即执行
})

// 清理副作用
watchEffect((onCleanup) => {
  const timer = setTimeout(() => { ... }, 1000)
  onCleanup(() => clearTimeout(timer))
})

// 停止监听
const stop = watchEffect(() => { ... })
stop()` }}</pre>

    <h3>三、watch vs watchEffect</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>对比项</th>
          <th>watch</th>
          <th>watchEffect</th>
        </tr>
        <tr>
          <td>依赖声明</td>
          <td>显式，手动指定监听源</td>
          <td>自动追踪回调内的响应式引用</td>
        </tr>
        <tr>
          <td>立即执行</td>
          <td>否（需 <code>immediate: true</code>）</td>
          <td>✅ 始终立即执行</td>
        </tr>
        <tr>
          <td>获取旧值</td>
          <td>✅ <code>(newVal, oldVal)</code></td>
          <td>❌ 无旧值</td>
        </tr>
        <tr>
          <td>精准控制</td>
          <td>✅ 只在指定源变化时触发</td>
          <td>❌ 依赖自动收集，可能意外追踪</td>
        </tr>
        <tr>
          <td>清理副作用</td>
          <td>✅ <code>onCleanup</code></td>
          <td>✅ <code>onCleanup</code></td>
        </tr>
        <tr>
          <td>停止监听</td>
          <td>✅ 返回 stop 函数</td>
          <td>✅ 返回 stop 函数</td>
        </tr>
        <tr>
          <td>适合场景</td>
          <td>需要旧值、精准控制触发时机</td>
          <td>副作用与多个响应式数据相关，不需要旧值</td>
        </tr>
      </tbody>
    </table>

    <h3>四、与 React useEffect 横向对比</h3>
    <pre>{{ `// React useEffect
import { useEffect, useState } from 'react'

const [count, setCount] = useState(0)

useEffect(() => {
  console.log('执行副作用', count)
  return () => {
    console.log('清理副作用')   // 组件卸载 或 依赖变化时执行
  }
}, [count])   // 依赖数组：空数组=只在 mount 执行，不传=每次渲染都执行` }}</pre>

    <table class="table">
      <tbody>
        <tr>
          <th>对比项</th>
          <th>Vue watch</th>
          <th>Vue watchEffect</th>
          <th>React useEffect</th>
        </tr>
        <tr>
          <td>依赖声明</td>
          <td>显式（监听源）</td>
          <td>自动追踪</td>
          <td>显式（依赖数组）</td>
        </tr>
        <tr>
          <td>立即执行</td>
          <td>否（需 immediate）</td>
          <td>✅ 是</td>
          <td>✅ 渲染后执行</td>
        </tr>
        <tr>
          <td>不传依赖时</td>
          <td>—</td>
          <td>自动追踪所有用到的响应式数据</td>
          <td>每次渲染都重新执行（易踩坑）</td>
        </tr>
        <tr>
          <td>依赖为空时</td>
          <td>—</td>
          <td>—</td>
          <td><code>[]</code> 只在 mount 执行一次</td>
        </tr>
        <tr>
          <td>获取旧值</td>
          <td>✅ (newVal, oldVal)</td>
          <td>❌</td>
          <td>❌（需 useRef 存上一次值）</td>
        </tr>
        <tr>
          <td>清理副作用</td>
          <td>onCleanup 回调</td>
          <td>onCleanup 回调</td>
          <td>return 一个清理函数</td>
        </tr>
        <tr>
          <td>执行时机</td>
          <td>DOM 更新后（默认 post）</td>
          <td>DOM 更新后（默认 post）</td>
          <td>渲染提交到 DOM 后</td>
        </tr>
        <tr>
          <td>停止/卸载</td>
          <td>调用返回的 stop()</td>
          <td>调用返回的 stop()</td>
          <td>组件卸载时自动调用 return fn</td>
        </tr>
      </tbody>
    </table>

    <h4>关键差异总结</h4>
    <ul>
      <li><strong>watchEffect ≈ useEffect（无依赖数组）</strong>：两者都自动追踪，都立即执行，但 watchEffect 通过 Proxy 精确收集，useEffect 不传依赖则每次渲染都跑（危险）</li>
      <li><strong>watch ≈ useEffect（有依赖数组）</strong>：都是显式指定依赖，但 watch 默认不立即执行，useEffect 始终在首次渲染后执行</li>
      <li><strong>watch 独有</strong>：可以获取 oldVal，React 需要额外用 useRef 保存上一次的值才能实现</li>
      <li><strong>React 的坑</strong>：useEffect 不传依赖数组 → 每次渲染都执行，容易造成无限循环；Vue 的 watchEffect 不会有这个问题</li>
    </ul>
  </div>
</template>
<script setup>
</script>
