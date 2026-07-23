<template>
  <div class="content">
    <h2>reactive 数组格式 : reactiveArray</h2>

    <h3>Vue 3 vs Vue 2 的变化</h3>
    <p>Vue 2 无法检测通过<em>索引赋值</em>和<em>修改 length</em> 对数组的变动，需要用 <code>Vue.set</code> 或 <code>splice</code> 绕过。Vue 3 基于 Proxy，这两种操作均可直接触发响应：</p>
    <pre>{{ `// Vue 3 reactive 数组，以下操作均可触发响应
reactiveArray[0] = 'new value'   // ✅ 索引赋值
reactiveArray.length = 0         // ✅ 修改 length 清空数组` }}</pre>

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
          <td><code>push / pop / shift / unshift / splice / sort / reverse</code></td>
          <td>原地修改，保持引用不变</td>
        </tr>
        <tr>
          <td>✅</td>
          <td><code>arr[0] = value</code></td>
          <td>索引赋值，Vue 3 新增支持</td>
        </tr>
        <tr>
          <td>✅</td>
          <td><code>arr.length = 0</code></td>
          <td>修改 length，Vue 3 新增支持</td>
        </tr>
        <tr>
          <td>❌</td>
          <td><code>reactiveArray = [...reactiveArray, newItem]</code></td>
          <td>改变引用，丢失响应性，视图不更新</td>
        </tr>
        <tr>
          <td>❌</td>
          <td><code>reactiveArray = reactiveArray.filter(...)</code></td>
          <td>filter/map/concat 等返回新数组，赋值后引用变更，丢失响应性</td>
        </tr>
      </tbody>
    </table>
    <p>与 React Hooks 相反：React 的 state 数组需要<em>改变引用</em>才生效，reactive 则需要<em>保持引用</em>。</p>

    <h3>watch 监听说明</h3>
    <ul>
      <li>只有<em>不改变引用</em>的操作（push、splice、索引赋值等）才能被 watch 监听到</li>
      <li>监听到时新旧值是<em>同一个引用</em>，<code>newVal === oldVal</code>，无法做差异比较</li>
      <li>改变引用后（如 <code>reactiveArray = [...]</code>），watch 监听的仍是最初的引用地址，数据未变，不会触发</li>
      <li>设置 <code>deep: true</code> 不影响上述行为，只影响嵌套对象属性变化的监听</li>
    </ul>

    <h3>示例</h3>
    <p>可按如下顺序操作：</p>
    <p>1、点击“数组重新赋值” -> 丢失响应性,视图不更新(其中前两条数据是之前响应式数据结构而来，仍具有响应式，添加的那条为普通数据)</p>
    <p>2、点击“添加[0]属性:version” -> 触发响应,视图更新 -> reactiveArray渲染出三条数据，其第一条数据的version属性被添加了 -> watch reactiveArray 也被触发了，但只有最初的两条响应式数据被更新</p>
    <p>3、点击“删除[2]属性:name” -> 无法响应：视图不更新,watch reactiveArray 也没有被触发 -> 因为操作的是第三条静态js数据，其不是响应式数据</p>
    <div class="box">
      <p>{{ reactiveArray }}</p>
      <p>
        <el-button
          size="small"
          type="primary"
          @click="add0Version"
        >
          添加[0]属性:version
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="delete2Name"
        >
          删除[2]属性:name
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="replaceArray"
        >
          数组重新赋值
        </el-button>
      </p>
    </div>

    <h3>代码解析</h3>
    <pre>
let reactiveArray = reactive(
  [
    { name: 'vue' },
    { name: 'react',version: '18.5' },
  ]
)
const add0Version = () => reactiveArray[0].version = '3.5'
const delete2Name = () => delete reactiveArray[2].name
const replaceArray = () => {
  console.log('replaceArray',reactiveArray)
  const a = { name: 'wanghognwei ' }
  reactiveArray = [a] // reactiveArray中完全没有响应式的数据,就是普通js数据
  reactiveArray = [...reactiveArray,a] // 整体丢失响应式。之前的两条数据扔保持响应式（看其console仍是Proxy），新添加的就是普通数据  // reactiveArray.push({ name: 'wanghognwei ' })
  // reactiveArray.splice(reactiveArray.length ,0,...a)
}

watch(
  reactiveArray,
  (newVal,oldVal) => {
    console.group('%c watch-reactiveArray','color: purple',)
    console.log('newVal:', newVal)
    console.log('oldVal:', oldVal)
    console.groupEnd()
  },
  { deep: true } // reactive声明的响应式数据，默认就是deep=true。当deep=false后，原理上只能监听到数组整体替换，但reactive的数据改变跟引用后将丢失响应性，所以将监听不到任何变化
)
</pre>

    <h3>两种 reactive 数组写法对比</h3>
    <p>同样用 <code>reactive</code> 定义数组，<em>对象包裹</em>和<em>裸数组</em>在整体替换时行为完全不同：</p>
    <pre>{{ `
// ⚠️ 裸数组写法 — 不推荐
const list = reactive([])
list.push(1, 2, 3)  // ✅ 能用
list = []            // ❌ 直接丢失响应式，因为 reactive 代理的是原对象引用

// ✅ 对象包裹写法 — 推荐
const state = reactive({ list: [] })
state.list.push(1, 2, 3)  // ✅
state.list = [1, 2, 3]    // ✅ 替换整个数组也能响应（改的是 state.list，根引用 state 未变）` }}</pre>

    <h3>reactive vs ref 数组选型</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>场景</th>
          <th>推荐写法</th>
          <th>原因</th>
        </tr>
        <tr>
          <td>只管理一个数组</td>
          <td><code>ref([])</code></td>
          <td>语义清晰，可整体替换，模板自动解包</td>
        </tr>
        <tr>
          <td>一个模块有多个状态（数组 + 标志位等）</td>
          <td><code>reactive({ list: [], loading: false })</code></td>
          <td>类似 Vue 2 的 <code>data()</code>，集中管理</td>
        </tr>
        <tr>
          <td>需要整体替换数组</td>
          <td><code>ref([])</code> 或 <code>reactive({ list: [] })</code></td>
          <td>裸 <code>reactive([])</code> 无法整体替换</td>
        </tr>
        <tr>
          <td>只做 push / splice 等原地操作</td>
          <td>两者均可</td>
          <td>—</td>
        </tr>
      </tbody>
    </table>

    <h3>一句话总结</h3>
    <ul>
      <li>✅ 首选：<code>const list = ref([])</code> — 最灵活，官方更推荐用于数组和基本类型</li>
      <li>✅ 次选：<code>const state = reactive({ list: [] })</code> — 适合多状态集中管理</li>
      <li>❌ 避免：<code>const list = reactive([])</code> — 整体替换时丢失响应，容易踩坑</li>
    </ul>
  </div>
</template>
<script setup>
import { reactive, watch } from 'vue'

let reactiveArray = reactive(
  [
    { name: 'vue' },
    { name: 'react',version: '18.5' },
  ]
)
const add0Version = () => reactiveArray[0].version = '3.5'
const delete2Name = () => delete reactiveArray[2].name
const replaceArray = () => {
  console.log('replaceArray',reactiveArray)
  const a = { name: 'wanghognwei ' }
  // reactiveArray = [a] // reactiveArray中完全没有响应式的数据,就是普通js数据
  reactiveArray = [...reactiveArray,a] // 整体丢失响应式。之前的两条数据扔保持响应式（看其console仍是Proxy），新添加的就是普通数据
  // reactiveArray.push({ name: 'wanghognwei ' })
  // reactiveArray.splice(reactiveArray.length ,0,...a)
}

watch(
  reactiveArray,
  (newVal,oldVal) => {
    console.group('%c watch-reactiveArray','color: purple',)
    console.log('newVal:', newVal)
    console.log('oldVal:', oldVal)
    console.groupEnd()
  },
  { deep: true } // reactive声明的响应式数据，默认就是deep=true。当deep=false后，原理上只能监听到数组整体替换，但reactive的数据改变跟引用后将丢失响应性，所以将监听不到任何变化
)
</script>
