<template>
  <div class="pg-keys">
    <CpCrumbs />
    <div class="content">
      <h2>前端关键词解释</h2>
      <p>记录前端开发中常见的关键词/术语，理解它们的含义有助于读懂框架源码和技术文档。</p>

      <h3>一、批处理与队列相关</h3>

      <h4>batch（批处理）</h4>
      <p>将多个操作<strong>收集起来，统一处理</strong>，而不是逐个执行。目的是减少重复计算、提升性能。</p>
      <ul>
        <li><strong>React batchedUpdates</strong>：React 18 之前，只在事件处理函数内自动批处理；React 18 引入 Automatic Batching，所有更新都会批处理</li>
        <li><strong>Vue 的批量更新</strong>：Vue 将同一事件循环中的多次数据变更收集起来，在下一个 tick 统一执行 DOM 更新</li>
        <li><strong>Scheduler.batch</strong>：React 的调度器中，将多个任务打包成一个批次执行</li>
      </ul>
      <pre>{{ `// Vue 示例：多次赋值只触发一次 DOM 更新
this.msg = 'a'
this.msg = 'b'
this.msg = 'c'
// DOM 只会更新一次，最终显示 'c'` }}</pre>

      <h4>buffer（缓冲区）</h4>
      <p>临时存储数据的<strong>内存区域</strong>，用于平衡生产者和消费者的速度差异，或减少 I/O 操作次数。</p>
      <ul>
        <li><strong>I/O Buffer</strong>：文件读写、网络请求中的数据缓存</li>
        <li><strong>Event Buffer</strong>：事件系统中暂存待处理的事件</li>
        <li><strong>DOM Buffer</strong>：某些框架中暂存待更新的 DOM 操作</li>
      </ul>
      <pre>{{ `// Node.js 中的 Buffer
const buf = Buffer.from('hello')
console.log(buf.length) // 5

// 事件系统中的 buffer
// 用户快速点击时，事件先存入 buffer，再统一处理` }}</pre>

      <h4>flush（刷新/执行）</h4>
      <p>将缓冲区中积累的数据<strong>立即处理/输出</strong>。与 buffer 相对 —— buffer 是"存"，flush 是"取"。</p>
      <ul>
        <li><strong>Vue watch 的 flush 选项</strong>：控制 watch 回调的执行时机（'pre' / 'post' / 'sync'）</li>
        <li><strong>React flushSync</strong>：强制同步刷新状态更新，立即执行 DOM 更新</li>
        <li><strong>Scheduler flush</strong>：调度器将积压的任务立即执行</li>
        <li><strong>flushPending</strong>：Vue 中等待刷新的组件队列</li>
      </ul>
      <pre>{{ `// Vue watch 的 flush
watch(count, () => {
  console.log('DOM 更新后执行')
}, { flush: 'post' }) // 默认值

// React flushSync
import { flushSync } from 'react-dom'
flushSync(() => {
  setCount(1) // 立即触发 DOM 更新
})
// 此时 DOM 已更新，可以同步读取` }}</pre>

      <h3>二、调度与执行相关</h3>

      <h4>schedule（调度）</h4>
      <p>决定<strong>什么时候执行</strong>某个任务。调度器的核心职责是：在合适的时机、以合适的优先级执行任务。</p>
      <ul>
        <li><strong>React Scheduler</strong>：React 的调度器，基于优先级和时间片调度任务</li>
        <li><strong>requestIdleCallback</strong>：浏览器 API，在空闲时执行回调</li>
        <li><strong>requestAnimationFrame</strong>：在下一帧渲染前执行回调</li>
      </ul>
      <pre>{{ `// React 调度器示例
scheduleCallback(priorityLevel, () => {
  // 这个任务会在合适的时机执行
})

// 浏览器调度
requestAnimationFrame(() => {
  // 下一帧渲染前执行
})` }}</pre>

      <h4>queue（队列）</h4>
      <p>先进先出（FIFO）的数据结构，用于<strong>按顺序处理任务</strong>。</p>
      <ul>
        <li><strong>Vue 的更新队列</strong>：watcher 队列，同一 tick 内的更新按顺序执行</li>
        <li><strong>React 的 lane 模型</strong>：不同优先级的任务进入不同的队列</li>
        <li><strong>Microtask Queue</strong>：微任务队列，Promise.then 的回调在此执行</li>
      </ul>
      <pre>{{ `// Vue 的队列
queueJob(job) // 将 job 加入队列
flushJobs()   // 执行队列中的所有 job

// 微任务队列
Promise.resolve().then(() => {
  // 微任务，在当前宏任务结束后立即执行
})` }}</pre>

      <h4>pending（待处理）</h4>
      <p>表示<strong>等待执行</strong>的状态。常见于各种"待处理队列"的命名。</p>
      <ul>
        <li><strong>flushPending</strong>：Vue 中标记是否需要刷新队列</li>
        <li><strong>Promise pending</strong>：Promise 的初始状态，既未 resolve 也未 reject</li>
        <li><strong>pending mutations</strong>：待提交的变更</li>
      </ul>

      <h3>三、更新与渲染相关</h3>

      <h4>dirty（脏的）</h4>
      <p>标记某个值<strong>需要重新计算/更新</strong>。"脏检查"是 Angular 的核心机制。</p>
      <ul>
        <li><strong>dirty flag</strong>：标记变量是否需要重新计算</li>
        <li><strong>dirty checking</strong>：Angular 的变更检测机制，循环检查所有绑定是否变化</li>
        <li><strong>Vue 的 dirty 标记</strong>：computed 属性中，标记是否需要重新求值</li>
      </ul>
      <pre>{{ `// Vue computed 的 dirty 机制
const count = ref(1)
const double = computed(() => count.value * 2)

// 首次访问：dirty = true，执行计算
console.log(double.value) // 2

// count 变化后：dirty = true，下次访问会重新计算
count.value = 2

// 再次访问：dirty = true，重新计算
console.log(double.value) // 4` }}</pre>

      <h4>commit（提交）</h4>
      <p>将变更<strong>正式应用</strong>。常见于版本控制和状态管理。</p>
      <ul>
        <li><strong>Git commit</strong>：提交代码变更</li>
        <li><strong>Vuex commit</strong>：提交 mutation，同步修改 state</li>
        <li><strong>React commit phase</strong>：React 渲染的第二阶段，将变更应用到 DOM</li>
      </ul>
      <pre>{{ `// Vuex commit
store.commit('increment', payload)

// React 的 commit 阶段
// render 阶段：计算变更（可中断）
// commit 阶段：应用变更到 DOM（不可中断）` }}</pre>

      <h4>reconcile（协调）</h4>
      <p>比较新旧虚拟 DOM，找出差异，决定如何更新真实 DOM。</p>
      <ul>
        <li><strong>React Reconciler</strong>：React 的协调器，实现 diff 算法</li>
        <li><strong>Vue 的 patch</strong>：Vue 中对应的协调过程</li>
      </ul>
      <pre>{{ `// React 协调过程
// 1. 对比新旧 Fiber 树
// 2. 标记需要更新的节点（Placement / Update / Deletion）
// 3. 在 commit 阶段应用变更

// Vue 的 patch 过程
// 1. 对比新旧 VNode
// 2. 找出差异
// 3. 更新真实 DOM` }}</pre>

      <h4>patch（修补/打补丁）</h4>
      <p>将新旧 VNode 进行对比，将差异<strong>应用到真实 DOM</strong>。是 Vue 更新机制的核心函数。</p>
      <ul>
        <li><strong>patch 的本质</strong>：对比新旧虚拟节点，找出最小差异，只更新变化的部分。它是 Vue 渲染系统的核心算法，也是你常说的 diff + update</li>
        <li><strong>同层比较</strong>：只在同一层级做 diff，不跨层级比较（O(n) 复杂度）</li>
        <li><strong>复用策略</strong>：key 相同时尽量复用已有 DOM 节点，减少创建/销毁开销</li>
      </ul>
      <h4>Vue 2 vs Vue 3 的 patch 差异</h4>
      <table class="table">
        <tbody>
          <tr>
            <th>对比项</th>
            <th>Vue 2</th>
            <th>Vue 3</th>
          </tr>
          <tr>
            <td>diff 算法</td>
            <td>双端比较（两头向中间）</td>
            <td>快速路径（先处理首尾相同节点，中间部分用 LIS 最长递增子序列）</td>
          </tr>
          <tr>
            <td>指针数量</td>
            <td>4 个（新旧各 2 个头尾指针）</td>
            <td>4 个（但先同步首尾，再处理中间乱序部分）</td>
          </tr>
          <tr>
            <td>静态节点优化</td>
            <td>❌ 无</td>
            <td>✅ 编译时标记静态节点（PatchFlags），patch 时跳过</td>
          </tr>
          <tr>
            <td>性能</td>
            <td>O(n)</td>
            <td>O(n)，但静态节点跳过 + LIS 减少移动次数</td>
          </tr>
        </tbody>
      </table>
      <pre>{{ `// Vue 2 双端比较
// 新: [a, b, c, d]    旧: [a, d, b, c]
// 1. 头头相同(a=a)，复用，指针内移
// 2. 尾尾不同(d≠c)，头尾交叉比较
// 3. 新头(b)在旧尾找到 → 移动 DOM
// 4. 重复直到一方遍历完

// Vue 3 快速路径
// 新: [a, b, c, d, e]  旧: [a, x, y, c, e]
// 1. 同步前缀：a=a ✓，b≠x 停止
// 2. 同步后缀：e=e ✓，d≠c 停止
// 3. 中间 [x,y,c] → [b,c,d]，用 LIS 找最少移动
// 4. 静态节点（PatchFlags）直接跳过` }}</pre>
      <p>💡 <strong>key 的作用</strong>：帮助 patch 识别哪些节点可以复用。不设置 key 时，Vue 会采用"就地复用"策略，可能导致不必要的 DOM 操作或状态错乱。</p>

      <h3>四、其他常见关键词</h3>

      <h4>effect（副作用）</h4>
      <p>函数执行时<strong>对外部环境产生的影响</strong>。如修改全局变量、发起网络请求、操作 DOM 等。</p>
      <pre>{{ `// 纯函数：无副作用
function add(a, b) {
  return a + b
}

// 有副作用
let total = 0
function addToTotal(n) {
  total += n  // 副作用：修改外部变量
  return total
}

// Vue 的 effect
// watch、watchEffect 都是用来管理副作用的` }}</pre>

      <h4>memo（记忆化）</h4>
      <p>缓存计算结果，避免重复计算。"用空间换时间"。</p>
      <ul>
        <li><strong>React.memo</strong>：缓存组件，props 不变时跳过渲染</li>
        <li><strong>useMemo</strong>：缓存计算结果</li>
        <li><strong>Vue computed</strong>：内置记忆化，依赖不变时返回缓存值</li>
      </ul>
      <pre>{{ `// React.memo
const MyComponent = React.memo(({ value }) => {
  return <div>{value}</div>
})

// useMemo
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])

// Vue computed（自动记忆化）
const double = computed(() => count.value * 2)
// count 不变时，多次访问返回缓存值` }}</pre>

      <h4>lane（车道）</h4>
      <p>React 17 引入的概念，用<strong>位运算</strong>表示任务优先级。不同优先级的任务进入不同的"车道"。</p>
      <pre>{{ `// React 的 lane 模型
const SyncLane = 0b0000000000000000000000000000001  // 同步任务
const DefaultLane = 0b0000000000000000000000000000100  // 默认优先级
const TransitionLane = 0b0000000000000000000001000000000  // 过渡动画
const IdleLane = 0b0100000000000000000000000000000  // 空闲任务

// 优先级高的 lane 先执行
// 用户点击（SyncLane）> 数据请求（DefaultLane）> 动画（TransitionLane）` }}</pre>

      <h3>五、关键词速查表</h3>
      <table class="table">
        <tbody>
          <tr>
            <th width="120">
              关键词
            </th>
            <th>含义</th>
            <th>常见场景</th>
          </tr>
          <tr>
            <td>batch</td>
            <td>批处理，将多个操作合并执行</td>
            <td>React batchedUpdates、Vue 批量更新</td>
          </tr>
          <tr>
            <td>buffer</td>
            <td>缓冲区，临时存储数据</td>
            <td>I/O 缓冲、事件缓冲</td>
          </tr>
          <tr>
            <td>flush</td>
            <td>刷新，立即处理缓冲的数据</td>
            <td>watch flush、flushSync</td>
          </tr>
          <tr>
            <td>schedule</td>
            <td>调度，决定何时执行任务</td>
            <td>React Scheduler、requestAnimationFrame</td>
          </tr>
          <tr>
            <td>queue</td>
            <td>队列，按顺序处理任务</td>
            <td>更新队列、微任务队列</td>
          </tr>
          <tr>
            <td>pending</td>
            <td>待处理，等待执行的状态</td>
            <td>flushPending、Promise pending</td>
          </tr>
          <tr>
            <td>dirty</td>
            <td>脏的，需要重新计算</td>
            <td>脏检查、computed dirty</td>
          </tr>
          <tr>
            <td>commit</td>
            <td>提交，正式应用变更</td>
            <td>Git commit、Vuex commit、React commit phase</td>
          </tr>
          <tr>
            <td>reconcile</td>
            <td>协调，对比差异决定如何更新</td>
            <td>React Reconciler、Vue patch</td>
          </tr>
          <tr>
            <td>patch</td>
            <td>修补，将新旧 VNode 差异应用到真实 DOM，相当于 diff + update</td>
            <td>Vue 2 双端比较、Vue 3 快速路径 + LIS</td>
          </tr>
          <tr>
            <td>effect</td>
            <td>副作用，对外部环境的影响</td>
            <td>watch、watchEffect、useEffect</td>
          </tr>
          <tr>
            <td>memo</td>
            <td>记忆化，缓存计算结果</td>
            <td>React.memo、useMemo、Vue computed</td>
          </tr>
          <tr>
            <td>lane</td>
            <td>车道，用位运算表示优先级</td>
            <td>React lane 模型</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import CpCrumbs from '@/components/crumbs/'
</script>