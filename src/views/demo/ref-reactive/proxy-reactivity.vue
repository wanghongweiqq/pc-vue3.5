<template>
  <div class="content">
    <h2>Proxy 与响应式更新边界</h2>
    <p>Vue 3 的响应式基于 <code>Proxy</code>，只有<em>经过 Proxy 的操作</em>才能被 Vue 感知并触发渲染。</p>

    <h3>核心原则</h3>
    <pre>{{ `this.list            // ← 响应式 Proxy 对象
res.data.list        // ← 裸数组，来自外部数据源，没有 Proxy 包裹` }}
</pre>
    <p>对 <code>this.list</code> 操作 → 经过 Proxy → Vue 感知 → 触发渲染。</p>
    <p>对 <code>res.data.list</code> 操作 → 绕过 Proxy → Vue 完全不知情 → 不渲染。</p>

    <h3>操作方式与响应性</h3>
    <table class="table">
      <tbody>
        <tr>
          <th width="80">
            是否响应
          </th>
          <th>操作方式</th>
          <th>说明</th>
        </tr>
        <tr>
          <td>✅</td>
          <td><code>this.list.sort() / push() / splice()</code></td>
          <td>经过 Proxy，Vue 拦截到变更，触发渲染</td>
        </tr>
        <tr>
          <td>✅</td>
          <td><code>this.list = newArr</code>（新引用）</td>
          <td>setter 被 Proxy 拦截，引用不同，触发渲染</td>
        </tr>
        <tr>
          <td>❌</td>
          <td><code>this.list = sameArr</code>（同引用）</td>
          <td>setter 被拦截，但引用相同，Vue 判断未变，跳过渲染</td>
        </tr>
        <tr>
          <td>❌</td>
          <td><code>rawArr.sort()</code> 后 <code>this.list = rawArr</code></td>
          <td>sort 在 Proxy 外执行，Vue 不知情；赋值同引用，再次跳过</td>
        </tr>
      </tbody>
    </table>

    <h3>真实踩坑案例</h3>
    <p>mock 接口每次返回同一个数组引用，原地 sort 后赋值，视图没有变化：</p>
    <pre>{{ `// ❌ 不生效
// mockMap 里的 list 是固定引用，每次接口返回同一个对象
let list = res.data.list       // 指向 mockMap 原始数组
list = list.sort(...)          // 原地排序，引用未变
this.queryList = list          // 赋值同引用 → Vue 跳过渲染` }}</pre>
    <p>问题关键：sort 发生在裸数组上（Proxy 之外），Vue 全程不知数据变了；引用又没变，赋值也被跳过。</p>

    <h3>修复方式</h3>
    <pre>{{ `// ✅ 展开创建新数组，断开与原始引用的关系
list = [...list].sort(...)
this.queryList = list          // 新引用 → Vue 检测到变化 → 触发渲染

// ✅ 或直接操作响应式数组（经过 Proxy）
this.queryList = list          // 先赋值拿到新引用
this.queryList.sort(...)       // 再通过响应式对象排序` }}</pre>

    <h3>与赋值时"内容变了是否渲染"的关系</h3>
    <p>即使引用相同的数组内容已发生变化，Vue 也<strong>不会渲染</strong>，因为：</p>
    <ul>
      <li>内容变化发生在 Proxy 之外 → Vue 从未感知</li>
      <li>赋值时 setter 做引用比较发现相同 → 主动跳过</li>
      <li>两道关卡都没过，Vue 没有任何理由触发渲染</li>
    </ul>

    <h3>一句话总结</h3>
    <ul>
      <li>Vue 3 不是靠"比较数据内容"来决定是否渲染，而是靠 <strong>Proxy 拦截操作</strong></li>
      <li>绕过 Proxy 操作裸数据，即使内容变了，Vue 也感知不到</li>
      <li>同引用赋值会被 setter 直接跳过，不进入渲染流程</li>
    </ul>
  </div>
</template>
<script setup>
</script>
