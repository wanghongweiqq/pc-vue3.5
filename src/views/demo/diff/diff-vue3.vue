<template>
  <div class="content">
    <h2>Vue 3 — 快速 Diff 算法</h2>
    <p>Vue 3 参考了 ivi 和 inferno 框架的思路，引入<em>快速 Diff</em>，并结合编译阶段的静态分析大幅减少运行时的比较量。核心思路是<strong>把能在编译期确定的事情都在编译期做完</strong>，运行时只处理真正动态的部分。</p>

    <h3>一、编译期优化（Vue 3 独有）</h3>

    <h4>① 静态提升（Static Hoisting）</h4>
    <p>纯静态节点（无任何绑定）在编译时提升到渲染函数外部，每次渲染直接复用同一个 VNode 对象，不重新创建，也不参与 diff。</p>
    <pre>{{ `
// 静态节点提升到渲染函数外
const _hoisted_1 = createVNode("p", null, "我是静态内容")

function render() {
  return createVNode("div", null, [
    _hoisted_1,                                    // ← 直接复用，不参与 diff
    createVNode("span", null, ctx.dynamic)         // ← 只有这个参与 diff
  ])

` }}</pre>

    <h4>② PatchFlag 动态标记</h4>
    <p>编译器分析模板，给动态节点打上 PatchFlag（补丁标记 / 动态标记），运行时 diff 直接根据 flag 判断哪些属性可能变化，精准更新，跳过其余属性的比较。</p>
    <pre>{{ `
// 只有 class 是动态的，打 CLASS 标记
createVNode("div", { class: ctx.cls }, null, PatchFlags.CLASS)
// 运行时：只比较 class，跳过 id / style / 其他 props

// 只有文本是动态的，打 TEXT 标记
createVNode("p", null, ctx.text, PatchFlags.TEXT)
// 运行时：只比较文本内容

` }}</pre>
    <table class="table">
      <tbody>
        <tr>
          <th>PatchFlag</th>
          <th>含义</th>
        </tr>
        <tr>
          <td>TEXT</td>
          <td>动态文本内容</td>
        </tr>
        <tr>
          <td>CLASS</td>
          <td>动态 class 绑定</td>
        </tr>
        <tr>
          <td>STYLE</td>
          <td>动态 style 绑定</td>
        </tr>
        <tr>
          <td>PROPS</td>
          <td>动态 props（编译期已知具体 key）</td>
        </tr>
        <tr>
          <td>FULL_PROPS</td>
          <td>动态 props（key 不固定，如 v-bind）</td>
        </tr>
      </tbody>
    </table>

    <h4>③ Block Tree（动态子节点收集）</h4>
    <p>组件 / v-if / v-for 等会创建 Block，Block 内部维护一个 <code>dynamicChildren</code> 数组，只收集有 PatchFlag 的动态节点。diff 时直接遍历 <code>dynamicChildren</code>，静态节点完全跳过。</p>
    <pre>{{ `
<div>             ← Block 根节点
  <p>静态内容</p>          ← 不进 dynamicChildren
  <span>\{{a}\}</span>    ← 进 dynamicChildren（TEXT）
  <i :class="b" />     ← 进 dynamicChildren（CLASS）
</div>

diff 时：只遍历 dynamicChildren = [span, i]，静态 p 直接跳过

` }}</pre>

    <h3>二、运行时 Diff — patchKeyedChildren 5 步</h3>
    <p>带 key 的列表是 diff 最复杂的场景，Vue 3 按顺序执行以下 5 步：</p>
    <pre>{{ `
旧: a  b  c  d  e  f  g
新: a  b  e  c  d  h  g

` }}</pre>

    <h4>Step 1 — 头部预处理</h4>
    <p>从头部开始逐个比较，类型 &amp; key 相同就 patch（复用），遇到不同立即停止。</p>
    <pre>{{ `
a = a ✓ patch
b = b ✓ patch
c ≠ e  停止，头部指针 i = 2

` }}</pre>

    <h4>Step 2 — 尾部预处理</h4>
    <p>从尾部开始逐个比较，类型 &amp; key 相同就 patch，遇到不同立即停止。</p>
    <pre>{{ `
g = g ✓ patch
f ≠ h  停止

处理后剩余：
  旧: c  d  e  f
  新: e  c  d  h

` }}</pre>

    <h4>Step 3 — 旧节点耗尽，新节点有剩余 → 全部 mount</h4>
    <h4>Step 4 — 新节点耗尽，旧节点有剩余 → 全部 unmount</h4>
    <p>步骤 3 / 4 处理简单情况，本例两端都有剩余，进入步骤 5。</p>

    <h4>Step 5 — 乱序处理（核心：建表 + LIS）</h4>
    <p><strong>① 建立新节点 key → index 映射表</strong></p>
    <pre>{{ `
新序列: e  c  d  h
映射表: { e:0, c:1, d:2, h:3 }

` }}</pre>

    <p><strong>② 遍历旧节点，查表匹配</strong></p>
    <pre>{{ `
旧 c → 找到，新中索引 1，patch ✓
旧 d → 找到，新中索引 2，patch ✓
旧 e → 找到，新中索引 0，patch ✓
旧 f → 找不到，unmount ✗

记录可复用节点在新序列中的位置数组：[1, 2, 0]（对应 c d e）

` }}</pre>

    <p><strong>③ 求最长递增子序列（LIS）</strong></p>
    <pre>{{ `
位置数组: [1, 2, 0]
LIS     = [1, 2]  → 对应节点 c d，它们相对顺序未变，不需要移动

倒序遍历剩余新节点：
  h → 新增（mount）
  d → 在 LIS 中，不动 ✓
  c → 在 LIS 中，不动 ✓
  e → 不在 LIS 中，insertBefore 移动

最终：1 次 unmount（f）+ 1 次 mount（h）+ 1 次 move（e），共 3 次 DOM 操作

` }}</pre>

    <h3>三、Vue 2 vs Vue 3 对比</h3>
    <table class="table">
      <tbody>
        <tr>
          <th />
          <th>Vue 2</th>
          <th>Vue 3</th>
        </tr>
        <tr>
          <td>列表 diff 算法</td>
          <td>双端对比（4 指针）</td>
          <td>头尾预处理 + LIS</td>
        </tr>
        <tr>
          <td>静态节点</td>
          <td>每次渲染都参与 diff</td>
          <td>编译期提升，完全跳过</td>
        </tr>
        <tr>
          <td>动态节点追踪</td>
          <td>无，全量遍历</td>
          <td>PatchFlag 精准标记，靶向更新</td>
        </tr>
        <tr>
          <td>子节点收集</td>
          <td>无</td>
          <td>Block Tree，只 diff dynamicChildren</td>
        </tr>
        <tr>
          <td>移动次数</td>
          <td>贪心，非最优</td>
          <td>LIS 保证最少移动次数</td>
        </tr>
        <tr>
          <td>时间复杂度</td>
          <td>O(n)（双端）</td>
          <td>O(n log n)（LIS），实际远低于 O(n)</td>
        </tr>
      </tbody>
    </table>

    <h3>四、复杂度总结</h3>
    <ul>
      <li>LIS 求解本身是 <em>O(n log n)</em>，但头尾预处理大幅缩减了待比较的节点数</li>
      <li>配合编译优化（静态提升 + PatchFlag + Block Tree），运行时 diff 量接近 <em>O(动态节点数)</em></li>
      <li>实际工程中，大多数节点是静态的，动态节点占比很小，性能提升显著</li>
    </ul>
  </div>
</template>
