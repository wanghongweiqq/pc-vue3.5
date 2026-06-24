<template>
  <div class="content">
    <h2>Vue 2 — 双端四指针比较算法</h2>
    <p>Vue 2 的 Diff 采用<em>双端比较</em>策略，同时从新旧子节点列表的头尾两端向中间逼近，减少指针移动次数。</p>

    <h3>四个指针</h3>
    <pre class="code-block">
旧: [ A  B  C  D ]
      ↑           ↑
   oldStart    oldEnd

新: [ D  B  C  A ]
      ↑           ↑
   newStart    newEnd</pre>

    <h3>每轮比较的四种命中情况</h3>
    <table class="table">
      <tbody>
        <tr>
          <th width="60">顺序</th>
          <th>比较</th>
          <th>命中时的操作</th>
        </tr>
        <tr>
          <td>①</td>
          <td>oldStart vs newStart</td>
          <td>patch 原地复用，两端指针同时内移</td>
        </tr>
        <tr>
          <td>②</td>
          <td>oldEnd vs newEnd</td>
          <td>patch 原地复用，两端指针同时内移</td>
        </tr>
        <tr>
          <td>③</td>
          <td>oldStart vs newEnd</td>
          <td>patch 后将旧头节点移动到旧尾之后</td>
        </tr>
        <tr>
          <td>④</td>
          <td>oldEnd vs newStart</td>
          <td>patch 后将旧尾节点移动到旧头之前</td>
        </tr>
        <tr>
          <td>⑤</td>
          <td>四种均未命中</td>
          <td>用旧节点的 key 建哈希表查找：找到则 patch + 移动，找不到则新建</td>
        </tr>
      </tbody>
    </table>

    <h3>循环终止条件</h3>
    <p>每轮四指针比较后内移，直到 <code>oldStart &gt; oldEnd</code> 或 <code>newStart &gt; newEnd</code> 时退出循环，再做收尾处理：</p>
    <table class="table">
      <tbody>
        <tr>
          <th>退出条件</th>
          <th>收尾操作</th>
        </tr>
        <tr>
          <td>旧节点先耗尽（oldStart &gt; oldEnd）</td>
          <td>newStart ~ newEnd 之间剩余的新节点全部新建挂载</td>
        </tr>
        <tr>
          <td>新节点先耗尽（newStart &gt; newEnd）</td>
          <td>oldStart ~ oldEnd 之间剩余的旧节点全部卸载删除</td>
        </tr>
      </tbody>
    </table>

    <h3>示例一：四种命中情况</h3>
    <pre class="code-block">
旧: [ A  B  C  D ]   新: [ D  B  C  A ]
     ↑           ↑        ↑           ↑
  oldStart    oldEnd   newStart    newEnd

第1轮: ①A≠D  ②D≠A  ③oldStart(A) === newEnd(A) → 命中③，patch A，移到旧尾之后
  旧剩余: [ B  C  D ]   新剩余: [ D  B  C ]
                                              ↑ newEnd 内移

第2轮: ①B≠D  ②D≠C  ③B≠C  ④oldEnd(D) === newStart(D) → 命中④，patch D，移到旧头之前
  旧剩余: [ B  C ]      新剩余: [ B  C ]

第3轮: oldStart(B) === newStart(B) → 命中①，patch 原地复用
第4轮: oldStart(C) === newStart(C) → 命中①，patch 原地复用

oldStart > oldEnd，循环结束，无剩余节点，完成</pre>
    <p><strong>为什么第4轮结束后 oldStart &gt; oldEnd？</strong></p>
    <p>进入第4轮时，新旧各只剩一个 C：<code>oldStart = oldEnd = C</code>，<code>newStart = newEnd = C</code>。</p>
    <p>命中① 的处理规则是：patch 原地复用后，<code>oldStart++</code> 和 <code>newStart++</code> 同时内移。C 处理完后两侧指针均越过各自的 End，<code>oldStart &gt; oldEnd</code> 成立，循环退出。新旧节点同时耗尽，无需任何收尾操作。</p>

    <h3>示例二：四种未命中，哈希表查找</h3>
    <pre class="code-block">
旧: [ A  B  C  D ]   新: [ E  B  A  D ]

第1轮: ①A≠E ②oldEnd(D) === newEnd(D) → 命中②，patch D，两尾指针内移
  旧剩余: [ A  B  C ]   新剩余: [ E  B  A ]

第2轮: ①A≠E ②C≠A ③A=A 命中③，patch A，移到尾部
  旧剩余: [ B  C ]      新剩余: [ E  B ]

第3轮: ①B≠E ②C≠B ③B=B 命中③，patch B，移到尾部
  旧剩余: [ C ]         新剩余: [ E ]

第4轮: ①C≠E ②C≠E ③C≠E ④C≠E → 四种未命中
  用旧节点 key 建哈希表：{ C: 0 }
  在表中查找 newStart(E) → 找不到 → 新建 E，插入到旧头之前
  新建完成后 newStart++：newStart(1) > newEnd(0) → 循环结束

旧节点 C 有剩余（oldStart 未越过 oldEnd）→ 卸载删除</pre>
    <p><strong>为什么第4轮结束后 newStart &gt; newEnd？</strong></p>
    <p>进入第4轮时，新节点只剩一个 E：<code>newStart = index 0（E）</code>，<code>newEnd = index 0（E）</code>，两者指向同一个节点。</p>
    <p>⑤ 未命中的处理规则是：针对 <code>newStart</code> 指向的节点新建或移动，完成后 <code>newStart++</code>，而 <code>newEnd</code> 始终不动。E 新建完成后 <code>newStart</code> 从 0 变为 1，<code>newEnd</code> 仍是 0，于是 <code>newStart(1) &gt; newEnd(0)</code>，循环退出。</p>

    <h3>复杂度说明</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>情况</th>
          <th>第⑤步查找方式</th>
          <th>整体复杂度</th>
        </tr>
        <tr>
          <td>列表节点有 key</td>
          <td>用 key 建哈希表，O(1) 查找</td>
          <td><em>O(n)</em></td>
        </tr>
        <tr>
          <td>列表节点无 key</td>
          <td>逐个线性遍历查找，O(n) 查找</td>
          <td><em>O(n²)</em>，应避免</td>
        </tr>
      </tbody>
    </table>
    <ul>
      <li>四种命中优先处理，覆盖了头部插入、尾部插入、头尾互换等绝大多数常见场景</li>
      <li>无静态节点提升，每次渲染都需完整对比所有节点（Vue 3 改进了这一点）</li>
    </ul>
  </div>
</template>
