<template>
  <div class="content">
    <h2>三者对比</h2>

    <table class="table">
      <tbody>
        <tr>
          <th width="160">
            对比项
          </th>
          <th>Vue 2</th>
          <th>Vue 3</th>
          <th>React</th>
        </tr>
        <tr>
          <td>核心算法</td>
          <td>双端比较</td>
          <td>快速 Diff + LIS</td>
          <td>单向遍历</td>
        </tr>
        <tr>
          <td>数据结构</td>
          <td>VNode 树</td>
          <td>VNode 树 + Block Tree</td>
          <td>Fiber 单向链表</td>
        </tr>
        <tr>
          <td>DOM 移动次数</td>
          <td>双端命中时 1 次，命中率高，但不保证最少</td>
          <td>理论最少（LIS 保证）</td>
          <td>单向遍历，以旧节点最大索引为基准，未达到最大索引的节点均需移动</td>
        </tr>
        <tr>
          <td>静态节点优化</td>
          <td>❌ 无</td>
          <td>✅ 静态提升 + PatchFlag</td>
          <td>❌ 无（需手动 memo）</td>
        </tr>
        <tr>
          <td>时间复杂度</td>
          <td>O(n)</td>
          <td>O(n log n)，实际更快</td>
          <td>O(n)</td>
        </tr>
        <tr>
          <td>编译期优化</td>
          <td>❌ 无</td>
          <td>✅ 静态提升 / PatchFlag / Block Tree</td>
          <td>❌ 无（需手动 memo / useMemo）</td>
        </tr>
        <tr>
          <td>并发/时间切片</td>
          <td>❌</td>
          <td>❌（渲染过程同步，无真正时间切片）</td>
          <td>✅ Fiber 原生支持，可中断渲染</td>
        </tr>
        <tr>
          <td>key 的重要性</td>
          <td>重要</td>
          <td>重要</td>
          <td>非常重要（第一轮按序遍历遇 key/type 不匹配停止；第二轮用 key 建 Map 查找可复用节点）</td>
        </tr>
      </tbody>
    </table>

    <h3>移动次数对比示例</h3>
    <p>将 <code>[ A B C D ]</code> 更新为 <code>[ D A B C ]</code>（D 移到头部）：</p>
    <table class="table">
      <tbody>
        <tr>
          <th>框架</th>
          <th>操作</th>
          <th>移动次数</th>
        </tr>
        <tr>
          <td>Vue 2（双端）</td>
          <td>命中④：D 移到头部</td>
          <td>1 次</td>
        </tr>
        <tr>
          <td>Vue 3（LIS）</td>
          <td>LIS = [A,B,C]，只移动 D</td>
          <td>1 次</td>
        </tr>
        <tr>
          <td>React（单向）</td>
          <td>D 不动（索引最大），A/B/C 均需移动</td>
          <td>3 次</td>
        </tr>
      </tbody>
    </table>

    <h3>总结</h3>
    <ul>
      <li>Vue 3 在运行时 Diff 效率上最优，编译优化使大量节点完全跳过比较</li>
      <li>Vue 2 双端算法在常见场景下表现良好，实现简单</li>
      <li>React 单向遍历效率略低，但 Fiber 链表结构换取了并发渲染能力，是框架定位上的主动取舍</li>
    </ul>
  </div>
</template>
