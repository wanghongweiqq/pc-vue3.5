<template>
  <div class="content">
    <h2>reactive object : obj</h2>
    <p>{{ obj }}</p>
    <p>
      <el-button
        size="small"
        type="primary"
        @click="objEditProperty"
      >
        修改属性
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="objAddProperty"
      >
        添加属性
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="objSubtractProperty"
      >
        删除属性（等价于 obj.age = undefined）
      </el-button>
    </p>

    <h3>reactive 对属性值的深度代理规则</h3>
    <p><code>reactive()</code> 内部用 Proxy 拦截属性访问，读取属性时：</p>
    <ul>
      <li>属性值是<em>引用类型</em>（对象/数组）→ 自动递归套一层 <code>reactive()</code> 再返回，拿到的是<em>响应式代理</em></li>
      <li>属性值是<em>基本类型</em>（字符串/数字/布尔）→ 无法被 Proxy 代理，直接返回<em>原始值</em></li>
    </ul>
     <pre>{{ `const obj = reactive({
  name: 'Vue3',      // 基本类型 → obj.name 取到 'Vue3'（普通字符串）
  tags: ['Vue3'],    // 引用类型 → obj.tags 取到 Proxy(['Vue3'])（响应式数组）
  info: { v: 3 },   // 引用类型 → obj.info 取到 Proxy({ v: 3 })（响应式对象）
})
` }}</pre>

    <h3>watch 监听说明</h3>
    <p>reactive 声明的数组/对象，只有在<em>不改变根数据的引用</em>的情况下才能被监听到，但此时新旧值相同（引用未变），无法做新旧差异比较（如果想做新旧比较，可以watch具体的属性，如() => obj.name）。改变引用时，watch 监听的还是最初的引用地址，那个地址的数据没有变化，所以不会触发。</p>
    <p>reactive 声明的对象，不管对象的属性的值是什么类型，都能被监听到，因为默认配置deep=true</p>
    <p>ref 声明的数组，不改变引用地址的修改，监听不到，若要监听，需要配置deep:true，默认deep=false</p>
    <p>reactive 声明的基本数据类型会丢失响应式，值虽然改变了，但 watch 监听不到，需要其他响应式数据触发渲染时才会一并更新。</p>
    <p>watch reactive 对象的<em>某个属性</em>时，结果取决于属性值的类型：</p>
    <ul>
      <li>
        <em>✅ getter 函数（推荐，适用所有类型）</em>：<code>watch(() => obj.age, handler)</code> — Vue 通过执行函数追踪依赖，无论属性值是什么类型都能正常监听
      </li>
      <li>
        <em>✅ 属性值是引用类型时可直接传</em>：<code>watch(obj.name, handler)</code>（本例 <code>name</code> 是数组）— 由于深度代理规则，<code>obj.name</code> 取到的已是响应式 Proxy，可直接作为 watch 源
      </li>
      <li>
        <em>❌ 属性值是基本类型时不能直接传</em>：若 <code>name: 'Vue3'</code>，则 <code>watch(obj.name, handler)</code> 相当于 <code>watch('Vue3', handler)</code>，基本类型无法被代理，Vue 收到的是普通字符串，触发 <code>[Vue warn]: Invalid watch source: Vue3</code>
      </li>
      <li>
        <em>❌ 属性不存在时</em>：<code>watch(obj.age, handler)</code> — 初始化时 <code>obj.age</code> 为 <code>undefined</code>，同样触发警告
      </li>
    </ul>

    <h3>watch(() => obj.name) 的 deep 行为</h3>
    <p>getter 函数只追踪<em>返回值的变化</em>，<code>deep</code> 是否需要取决于 <code>obj.name</code> 是原始值还是对象：</p>
     <pre>{{ `const obj = reactive({ name: { title: 'Vue3' } })

// ① 直接 watch reactive 对象 → 默认 deep: true，可感知内部所有属性变化
watch(obj, handler)

// ② getter 返回属性的值是对象 → 默认 deep: false，只感知引用替换，感知不到内部属性变化
watch(() => obj.name, handler)
obj.name.title = 'React'    // ❌ 不触发（引用未变），要想触发，deep需设置为true
obj.name = { title: 'React' } // ✅ 触发（引用变了）

// ③ getter 返回属性的值是原始值 → 直接感知，无需 deep（推荐，精准监听）
watch(() => obj.name.title, handler) // ✅ 精准追踪到 title 的变化
` }}</pre>
    <p><em>建议：能精准到具体属性就不要开 deep: true</em>，deep 会递归遍历对象所有层级，数据复杂时有性能开销。</p>

    <h3>Vue 3 watch 源合法类型总结</h3>
    <table class="table">
      <tbody>
        <tr>
          <th>类型</th>
          <th>示例</th>
        </tr>
        <tr>
          <td>ref</td>
          <td><code>const count = ref(0)</code></td>
        </tr>
        <tr>
          <td>reactive 对象</td>
          <td><code>const state = reactive({ a: 1 })</code></td>
        </tr>
        <tr>
          <td>getter 函数</td>
          <td><code>() => state.a</code></td>
        </tr>
        <tr>
          <td>以上类型的数组</td>
          <td><code>[foo, bar, () => x]</code></td>
        </tr>
      </tbody>
    </table>
    <p><em>❌ 不能作为 watch 源的：</em></p>
    <ul>
      <li>普通变量（如 <code>let x = 1</code>）</li>
      <li>解构出来的响应式属性（<code>const { a } = state</code> — <code>a</code> 已变为普通值，失去响应性）</li>
      <li>非响应式对象（普通 <code>const obj = { a: 1 }</code>）</li>
      <li><code>undefined</code> / <code>null</code></li>
      <li>getter 函数的返回值本身不是响应式数据（如 <code>() => 1 + 1</code>）</li>
    </ul>
  </div>
</template>
<script setup>
import { reactive, watch } from 'vue'

// const obj = reactive({ name: 123 })
const obj = reactive({ name: { title: 123 } })
// const obj = reactive({ name: [123] })

// const objEditProperty = () => obj.name = Date.now()
const objEditProperty = () => obj.name.title = Date.now()
// const objEditProperty = () => obj.name.push(Date.now())
// const objEditProperty = () => obj.name[1] = Date.now()
const objAddProperty = () => obj.age = Date.now()
const objSubtractProperty = () => delete obj.age // 等价于 obj.age = undefined
watch(obj,(newVal,oldVal) => {
  console.log('watch-reactive-obj')
  console.log('newVal:', newVal)
  console.log('oldVal:', oldVal)
},{
  // deep: true //对象类型的数据时，默认deep=true
})

watch(() => obj.age,(newVal,oldVal) => {
  console.log('watch-reactive-obj.age')
  console.log('newVal:', newVal)
  console.log('oldVal:', oldVal)
})

// 当name是一个基本数据类型时，报错，是引用类型的值是没有问题
// [Vue warn]: Invalid watch source: 123  A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.
// watch(obj.name,(newVal,oldVal) => {
//   console.log('watch-reactive-obj.name')
//   console.log('newVal:', newVal)
//   console.log('oldVal:', oldVal)
// })

// 当name是一个基本数据类型时，可以使用getter 函数
watch(() => obj.name,(newVal,oldVal) => {
  console.log('watch-reactive-() => obj.name')
  console.log('newVal:', newVal)
  console.log('oldVal:', oldVal)
},{
  deep: true
})
</script>
