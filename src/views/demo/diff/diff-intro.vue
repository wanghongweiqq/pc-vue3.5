<template>
  <div class="content">
    <h2>什么是 Diff 算法</h2>
    <p>Diff 算法是虚拟 DOM（Virtual DOM）框架的核心。当组件状态发生变化时，框架会生成一棵新的虚拟 DOM 树，Diff 算法负责找出新旧两棵树之间的最小差异，只将真正变化的部分同步到真实 DOM，避免全量重绘带来的性能损耗。</p>

    <h3>为什么需要 Diff</h3>
    <ul>
      <li>直接操作真实 DOM 代价高昂（触发重排/重绘）</li>
      <li>虚拟 DOM 是轻量的 JS 对象，比较速度快</li>
      <li>Diff 找出最小变更集，减少真实 DOM 操作次数</li>
    </ul>

    <h3>朴素 Diff 的问题</h3>
    <p>对两棵树做完整对比的时间复杂度是 <em>O(n³)</em>，n 为节点总数。对一个有 1000 个节点的树，需要约 10 亿次操作，完全不可用。</p>
    <p><strong>为什么是 O(n³)？</strong>来自三层嵌套：</p>
    <pre>{{ `
树A (n个节点)       树B (n个节点)

    A                   A'
   / \\                 / \\
  B   C               B'  C'
 / \\                 /
D   E               D'

树A 的每个节点都要和树B 的每个节点比较，看谁和谁"配"：
n × n = O(n²) 对，再对每对节点计算子节点最优映射 × O(n) = O(n³)` }}</pre>
    <table class="table">
      <tbody>
        <tr>
          <th>层次</th>
          <th>操作</th>
          <th>复杂度</th>
        </tr>
        <tr>
          <td>第 1 层</td>
          <td>枚举树 A 的每个节点</td>
          <td>O(n)</td>
        </tr>
        <tr>
          <td>第 2 层</td>
          <td>枚举树 B 的每个节点，两两配对</td>
          <td>O(n)</td>
        </tr>
        <tr>
          <td>第 3 层</td>
          <td>对每对节点，计算子节点的最优映射（最小代价二分图匹配）</td>
          <td>O(n)</td>
        </tr>
        <tr>
          <td><strong>合计</strong></td>
          <td>—</td>
          <td><strong>O(n³)</strong></td>
        </tr>
      </tbody>
    </table>
    <p>
      直觉类比：<em>字符串</em> diff（最长公共子序列）只有前后一维关联，复杂度为 O(n²)；<em>树</em>多了一层层级嵌套，每层的最优匹配都依赖下一层的结果，因此再乘一个 O(n)，变为 O(n³)。
    </p>
    <p>因此各框架都基于以下三个启发式假设规避完整树对比，将复杂度降至 <em>O(n)</em>：</p>

    <h4>① 同层级比较<small>-只比较同一层级的节点，不跨层级移动</small></h4>
    <p>只对比同一层级的节点，节点跨层移动（从某个父节点移到另一个父节点）不会被识别为"移动"，而是旧位置删除 + 新位置创建。</p>
    <table class="table">
      <tbody>
        <tr>
          <th>场景</th>
          <th>Diff 行为</th>
        </tr>
        <tr>
          <td>节点 A 从 div1 移入 div2</td>
          <td>div1 层：A 被删除；div2 层：A 被新建。两次 DOM 操作，不识别移动</td>
        </tr>
        <tr>
          <td>节点仅在同一父节点内换位</td>
          <td>同层比较，结合 key 可识别为移动，只做一次 insertBefore</td>
        </tr>
      </tbody>
    </table>

    <h4>② 类型决定复用<small>-节点类型不同直接替换，不深入对比子树</small></h4>
    <p>节点类型-fiber.type（标签名 / 组件名（函数组件和类组件））不同，直接销毁旧子树、创建新子树，不做任何子节点比较。</p>
    <table class="table">
      <tbody>
        <tr>
          <th>旧树</th>
          <th>新树</th>
          <th>Diff 行为</th>
        </tr>
        <tr>
          <td><code>&lt;div&gt;&lt;span&gt;A&lt;/span&gt;&lt;/div&gt;</code></td>
          <td><code>&lt;p&gt;&lt;span&gt;A&lt;/span&gt;&lt;/p&gt;</code></td>
          <td>div → p 类型变了，整棵子树销毁重建，内部 span 不会被复用</td>
        </tr>
        <tr>
          <td><code>&lt;MyInput /&gt;</code></td>
          <td><code>&lt;MySelect /&gt;</code></td>
          <td>组件类型不同，旧组件实例销毁，新组件重新挂载</td>
        </tr>
      </tbody>
    </table>

    <h4>③ key 标记身份<small>-用 key 帮助算法识别可复用节点，避免错位，一般用于同层级节点，如列表等</small></h4>
    <p>列表渲染时，<code>key</code> 让算法识别"这是同一个节点"，从而复用 DOM 而非重建。无 key 时只能按索引位置对比，顺序变化后全部错位更新。</p>
    <table class="table">
      <tbody>
        <tr>
          <th>操作</th>
          <th>无 key</th>
          <th>有 key（稳定唯一）</th>
        </tr>
        <tr>
          <td>列表头部插入新节点<br><code>[A,B,C] → [D,A,B,C]</code></td>
          <td>索引 0 位置：A patch 成 D（更新）<br>索引 1：B patch 成 A（更新）<br>索引 2：C patch 成 B（更新）<br>末尾新增 C，共 4 次 DOM 操作</td>
          <td>D 无匹配 key → 新建 1 个<br>A / B / C 按 key 匹配复用，整体前移<br>仅 1 次新建 + 1 次移动</td>
        </tr>
        <tr>
          <td>key 用 index</td>
          <td colspan="2">
            顺序变化时 key 随索引一起变，退化为无 key 情形，仍会全量更新
          </td>
        </tr>
      </tbody>
    </table>

    <h3>key 的作用</h3>
    <p>在列表渲染中，<code>key</code> 是节点的唯一标识。Diff 算法通过 <code>key</code> 建立新旧节点的映射关系，判断节点是否可复用（只更新属性而非销毁重建），同时确定是否需要移动位置。</p>
    <table class="table">
      <tbody>
        <tr>
          <th>有无 key</th>
          <th>Diff 行为</th>
        </tr>
        <tr>
          <td>无 key</td>
          <td>按索引位置就地复用，无法识别节点身份，可能产生状态错位</td>
        </tr>
        <tr>
          <td>有 key（稳定唯一）</td>
          <td>精准匹配可复用节点，最小化 DOM 操作</td>
        </tr>
        <tr>
          <td>key 用 index</td>
          <td>列表顺序变化时与无 key 等效，仍会产生错位</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
