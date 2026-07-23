<template>
  <div class="content">
    <h2>React — Fiber 架构与单向 Diff</h2>
    <p>React Fiber（链表） 是 React 16（2017）引入的全新协调器（Reconciler），用来替代旧版的 Stack（栈） Reconciler。核心目标是把原来<em>"依赖系统调用栈的同步递归、不可中断</em>的渲染改成<em>“由 React 自行管理的链表结构 + 调度器"</em>，使渲染变为<em>可中断、可恢复、带优先级的增量</em>渲染。</p>
    <p>链表是一种线性、非连续存储的数据结构，核心特点是：节点通过指针连接，不依赖连续内存。</p>
    <p>链表 = 用指针换灵活，牺牲随机访问，换来高效的插入/删除和动态扩展。</p>
    <p>链表不像数组那样维护着一套连续的索引值（牵一发而动全身），它是相对独立的，就是本节点通过指针指向下一个节点（本节点都不知道它的上一个节点是谁），从中添加某个数据时就相当于给prev节点 -> 新增节点 -> next节点，只要新增节点左右的两个指针对了就行，不用影响和改变其他节点（对于其他节点来说，只有它上一个节点的指针改了，它下一个节点其实都不知道谁指向它）。当然我们这里说的是单向链表，链表分为：单链表、双链表、循环链表、静态链表等。</p>
    <table class="table">
      <thead>
        <tr>
          <th>操作</th>
          <th>数组</th>
          <th>链表</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>随机访问</td>
          <td>O(1) ✅</td>
          <td>O(n) ❌✅</td>
        </tr>
        <tr>
          <td>头部插入</td>
          <td>O(n) ❌</td>
          <td>O(1) ✅</td>
        </tr>
        <tr>
          <td>尾部插入</td>
          <td>O(1) ✅</td>
          <td>O(1) ✅</td>
        </tr>
        <tr>
          <td>中间插入</td>
          <td>O(n) ❌</td>
          <td>O(1) ✅</td>
        </tr>
        <tr>
          <td>内存连续性</td>
          <td>连续 ✅</td>
          <td>不连续 ❌</td>
        </tr>
        <tr>
          <td>扩容成本</td>
          <td>高 ❌</td>
          <td>低 ✅</td>
        </tr>
      </tbody>
    </table>

    <h3>一、为什么需要 Fiber</h3>
    <p>React 15 及之前使用 Stack Reconciler，通过<em>JS调用栈同步递归遍历组件树</em>，一旦开始就必须跑完。组件树很深时，长时间占用主线程，导致用户点击 / 输入 / 动画无响应（掉帧）。</p>
    <p>Fiber 把"隐式调用栈"换成自己管理的<strong>链表数据结构</strong>，让渲染过程可以分段执行、随时让出主线程。</p>

    <h3>二、Fiber 节点——核心数据结构</h3>
    <p>每个 React 组件 / 原生元素对应一个 Fiber 节点，整体效果 = 树形结构用链表方式扁平化表达。</p>
    <p>Fiber 节点的三个核心指针：父指针、子指针（只指向第一个子集）、下一个（右侧）兄弟指针。</p>
    <p>兄弟节点之间是单向链表（sibling只有 next，没有 prev），真正"双向"的感觉来自 child ↓+ return ↑这对父子互指（其实只有第一个子集和其父级互指，第二个子集单向指向其父级）。</p>
    <p>Fiber "双向链表" = child（下）+ sibling（右，单向）+ return（上）三个指针，把组件树改造成可中断恢复的链表遍历结构，不再依赖递归调用栈。</p>
    <pre>{{ `
const fiber = {
  type: 'div',          // 节点类型（函数组件 / 类组件 / DOM 标签）
  memoizedProps: {},    // 上次的 props
  memoizedState: null,  // hooks 链表 / 组件 state
  child: null,          // 只指向第一个子 Fiber(首子)，第二个及以后的子 Fiber不会被记录
  sibling: null,        // 指向下一个兄弟 Fiber，没有上一个，单向链表
  return: null,         // 指向父 Fiber，每个子节点都有一个指针指向父节点
  alternate: null,      // 指向另一棵 Fiber 树的对应节点（双缓存）
  flags: 0,             // 副作用标记（插入 / 更新 / 删除）
  lanes: 0              // 优先级车道（Lane 模型）
}

// JSX
<div>
  <Header />
  <Main />
  <Footer />
</div>

// 对应 Fiber 连接关系
                        （都指回父节点）
divFiber◀─┐──────────────────┐────────────────────────┐
 │ child  │ return           │ return                 │ return
 ▼        │                  │                        │
HeaderFiber ──sibling──► MainFiber ──sibling──► FooterFiber

// 遍历顺序 child → sibling → return 指针可中断遍历、记住进度，从而实现可中断、可恢复​的遍历
` }}</pre>

    <h4>遍历顺序 DFS（Depth First Search/深度优先搜索）</h4>
    <p>深度优先：纵向深挖。遍历规则是：遇到节点优先递归访问子节点、往树的纵深走到底，再回溯兄弟节点。</p>
    <pre>先处理当前节点
↓ 有 child？ → 跳 child（向下）
↓ 无 child？ → 跳 sibling（向右）
↓ 无 sibling？ → return 到父，再找父的 sibling（向上回溯）</pre>
    <p>先在某个fiber节点向下深钻，一直向下钻，钻不动了，然后横向深钻，只要横到一个，立马又向下深钻，如此往复:下(child)->横(sibling)，直到没有横，那就只能上（return）,先找到父节点的横，最后不断重复：下(child)->横(sibling)->上(return)。</p>
    <p>整体的遍历顺序就像从一个容器的左上角注水，沿着左边从上往下流，流到底就横向流，满了之后就不断往上返。</p>
    <p>相近词拓展：BFS Breadth-First Search 广度优先：横向一层一层遍历。</p>

    <h3>三、关键机制</h3>
    <h4>① 时间切片（Time Slicing）& 可中断</h4>
    <p>调度器（Scheduler）把渲染拆成若干"工作单元"，每处理几个 Fiber 就检查是否有剩余时间或更高优先级任务（如用户点击）。有的话暂停当前 Render，把控制权交还浏览器，稍后从中断处恢复。</p>
    <pre>{{ `
主线程时间线：

旧版（Stack Reconciler）—— 不可中断：
│←────────── 渲染 100 个组件（50ms）──────────→│ 用户点击无响应
│                                              │ 动画卡顿

新版（Fiber）—— 可中断：
│← 渲染 →│让出│← 渲染 →│让出│← 渲染 →│ 完成
          ↑用户点击立即响应  ↑动画帧正常执行` }}</pre>

    <h4>② 双缓存 Fiber 树（Double Buffering）</h4>
    <p>React 同时维护两棵 Fiber 树：</p>
    <table class="table">
      <tbody>
        <tr>
          <th>树</th>
          <th>说明</th>
        </tr>
        <tr>
          <td>current 树</td>
          <td>当前屏幕上显示的 UI 对应的 Fiber 树</td>
        </tr>
        <tr>
          <td>workInProgress 树</td>
          <td>内存中正在构建的新树，更新时在此做 Diff</td>
        </tr>
      </tbody>
    </table>
    <p>更新完成后一次性切换 <code>current = workInProgress</code>，保证 DOM 更新的原子性、无闪烁。两棵树通过 <code>alternate</code> 指针互相引用。</p>

    <h4>③ 优先级调度（Lane 模型）</h4>
    <p>不同更新赋予不同优先级 Lane，高优先级任务可打断低优先级 Render：</p>
    <pre>{{ `
用户输入 / 点击  >  动画  >  普通数据更新  >  后台预加载

场景：数据请求更新（低优先级）渲染到一半
     → 用户点击按钮（高优先级）
     → 立即中断数据渲染，优先处理点击
     → 点击处理完成后，从中断处继续数据渲染` }}</pre>
    <p>Lane 模型是 <code>useTransition</code>、<code>Suspense</code> 的底层基础。</p>

    <h3>四、渲染两阶段</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>阶段</th>
          <th>是否可中断</th>
          <th>做了什么</th>
        </tr>
        <tr>
          <td>Render（协调）</td>
          <td>✅ 可中断、可重试</td>
          <td>遍历 Fiber 树，执行 beginWork / completeWork，Diff 新旧节点，打 flags，<strong>不碰真实 DOM</strong></td>
        </tr>
        <tr>
          <td>Commit（提交）</td>
          <td>❌ 不可中断、同步</td>
          <td>一次性把副作用应用到真实 DOM，执行 componentDidMount / useEffect 等</td>
        </tr>
      </tbody>
    </table>

    <h3>五、Diff 两阶段</h3>
    <p>Fiber 是<em>单向链表</em>（child / sibling / return 指针），无法从尾部反向遍历，因此只能从左到右单向遍历，分两轮处理：</p>

    <h4>第一轮：按索引顺序逐一对比</h4>
    <ul>
      <li>key 和 type 均相同 → 复用旧 Fiber，继续下一个</li>
      <li>key 不同 → <strong>立即停止</strong>第一轮</li>
      <li>key 相同但 type 不同 → 删除旧节点，继续</li>
    </ul>

    <h4>第二轮：处理第一轮剩余节点</h4>
    <ul>
      <li>新节点已遍历完 → 删除所有剩余旧节点</li>
      <li>旧节点已遍历完 → 新建所有剩余新节点</li>
      <li>都有剩余 → 把剩余旧节点放入 <code>Map&lt;key, Fiber&gt;</code>，遍历剩余新节点从 Map 中查找复用</li>
    </ul>

    <h3>六、移动判断（lastPlacedIndex）</h3>
    <p>React 用 <code>lastPlacedIndex</code> 记录上一次复用的旧节点索引。当前复用节点的旧索引 ≥ lastPlacedIndex → 不需要移动；否则 → 需要移动。</p>
    <pre>{{ `
旧: [ A  B  C  D ]   新: [ C  A  B  D ]
lastPlacedIndex = 0

C 在旧中索引 = 2 ≥ 0 → 不动，lastPlacedIndex = 2
A 在旧中索引 = 0 &lt; 2 → 移动
B 在旧中索引 = 1 &lt; 2 → 移动
D 在旧中索引 = 3 ≥ 2 → 不动，lastPlacedIndex = 3

共移动 2 次
对比 Vue 2 双端：命中④将 C 移到头部，A / B / D 均原地复用，只需移动 1 次` }}</pre>

    <h3>七、为何不做双端优化</h3>
    <p>双端比较需要能快速访问列表末尾节点，但 Fiber 单向链表结构做不到。React 主动选择单向遍历，换取 Fiber 架构带来的时间切片和并发渲染能力——这是框架层面的主动取舍，不是缺陷。</p>

    <h3>一句话总结</h3>
    <p>Fiber = <em>链表节点代替递归栈</em> + <em>时间切片可中断调度</em> + <em>双缓存 Fiber 树</em> + <em>优先级 Lane 模型</em>，让 React 渲染变成分段、可抢占的并发过程，是 useTransition / Suspense 等并发特性的底层基石。</p>
  </div>
</template>
