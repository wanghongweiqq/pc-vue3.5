<template>
  <div class="content">
    <h2>reactive 对象格式 : reactiveObject</h2>

    <p>reactive( ) <em>只能接收引用类型</em>（包括普通对象、数组、Map、Set 等），<em>不能处理基本类型</em> （number、string、boolean 等）。</p>

    <h3>reactive 定义基本类型数据</h3>
    <p>
      <el-button
        type="primary"
        @click="changeBasicValue"
      >
        修改 basicValue
      </el-button>
    </p>
    <p>basicValue：{{ basicValue }}</p>
    <p>说明：<code>reactive()</code>传递原始值（如 <code>reactive(1)</code>）不会产生响应式效果。点击上方按钮修改 <code>basicValue</code>，页面不会更新——因为 <code>basicValue</code> 不是响应式的，不会触发重新渲染。有时候看到其在某个事件后被渲染了，有可能是这个事件更新了其他的响应式数据，导致它的值被顺带更新了。</p>

    <h3>reactive 定义对象数据</h3>
    <h4>示例</h4>
    <div class="box">
      <p>{{ reactiveObject }}</p>
      <p>
        <el-button
          type="primary"
          @click="editName"
        >
          修改属性：name
        </el-button>
        <el-button
          type="primary"
          @click="addTimestamp"
        >
          添加属性：timestamp
        </el-button>
        <el-button
          type="primary"
          @click="editTimestamp"
        >
          修改属性：timestamp.y
        </el-button>
        
        <el-button
          type="primary"
          @click="deleteTimestamp"
        >
          删除属性：timestamp
        </el-button>
        <el-button
          type="primary"
          @click="editMark"
        >
          编辑引用类型属性：mark
        </el-button>
      </p>
    </div>

    <h4>代码</h4>
    <pre>
const reactiveObject = reactive({ 
  name: 'vue', // 基本类型 → reactiveObject.name 取到 'vue'（普通字符串）
  mark: { x: 1 } // 引用类型 → reactiveObject.mark 取到 Proxy({ x: 1 })（响应式对象）
  // timestamp: undefined // // 基本类型 → reactiveObject.timestamp 取到 undefined
})

const editName = () => reactiveObject.name = String(Date.now())
const addTimestamp = () => reactiveObject.timestamp = { y: Date.now() }
const editTimestamp = () => reactiveObject.timestamp.y = Date.now()
const deleteTimestamp = () => delete reactiveObject.timestamp // 等价于 reactiveObject.timestamp = undefined
const editMark = () => {
  let { mark } = reactiveObject
  mark.x = Date.now() // 保持响应式，更改的是响应式数据
  // mark = { x: Date.now() } // 丢失响应式：变量mark指向一个新的内存地址
}
</pre>

    <h3>reactive 对属性值的深度代理规则</h3>
    <p><code>reactive()</code> 内部用 Proxy 拦截属性访问，读取属性时：</p>
    <p>1、属性值是<em>引用类型</em>（对象/数组）→ 自动递归套一层 <code>reactive()</code> 再返回，拿到的是<em>响应式代理</em></p>
    <p>2、属性值是<em>基本类型</em>（字符串/数字/布尔）→ 无法被 Proxy 代理，直接返回<em>原始值</em></p>

    <h3>watch 监听说明</h3>
    <p>reactive 声明的数组/对象，只有在<em>不改变根数据的引用</em>的情况下才能被监听到，但此时新旧值相同（引用未变），无法做新旧差异比较（如果想做新旧比较，可以watch具体的属性，如() => reactiveObject.name）。改变引用时，watch 监听的还是最初的引用地址，那个地址的数据没有变化，所以不会触发。</p>
    <p>reactive 声明的对象，不管对象的属性的值是什么类型，都能被监听到，因为默认配置deep=true。</p>
    <p>ref 声明的数组，不改变引用地址的修改，监听不到，若要监听，需要配置deep:true，默认deep=false。</p>
    <p>reactive 声明的基本数据类型会丢失响应式，值虽然改变了，但 watch 监听不到，需要其他响应式数据触发渲染时才会一并更新。</p>
    <h4>watch reactive 对象的某个属性（对象自身也适用）时，结果取决于属性值的类型：</h4> 
    <table class="table">
      <thead>
        <tr>
          <th width="70">
            属性值类型
          </th>
          <th>直接监听</th>
          <th>getter函数 默认deep=false，只感知引用替换</th>
        </tr>
      </thead>
        
      <tbody>
        <tr>
          <td>基本类型</td>
          <td>
            <p>❌ 无法正常监听，报警告，但改动的数据可以render-渲染，父级数据的监听可以捕获到它的改变</p>
            <p>[Vue warn]: Invalid watch source: 'vue'  <br>A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.</p>
          </td>
          <td>✅ 可以正常监听，可以理解为基本类型的数据改变就是引用替换</td>
        </tr>
        <tr>
          <td>引用类型</td>
          <td>✅ 正常监听，默认deep=true</td>
          <td>✅ 正常监听，默认感知引用替换，感知不到内部属性变化。设置为deep=true时，即可感知内部属性变化。</td>
        </tr>
      </tbody>
    </table>

    <h4>watch( ( ) => reactiveObject.name ) 的 deep 行为</h4>
    <p>getter 函数只追踪<em>返回值引用的变化</em>，<code>deep</code> 是否需要取决于 <code>reactiveObject.name</code> 是原始值还是对象：</p>
    <pre>{{ `
// ① 直接 watch reactive 对象 → 默认 deep: true，可感知内部所有属性变化，如果改为getter函数，只能感知引用变化，感知内部属性变化需要再设置deep=true
watch(reactiveObject, handler)

// ② getter 返回属性的值是对象 → 默认 deep: false，只感知引用替换，感知不到内部属性变化
watch(() => reactiveObject.mark, handler)
reactiveObject.mark.x = Date.now()    // ❌ 不触发（引用未变），要想触发，deep需设置为true
reactiveObject.mark = { x: Date.now() } // ✅ 触发（引用变了）

// ③ getter 返回属性的值是原始值 → 直接感知，无需 deep（推荐，精准监听）
watch(() => reactiveObject.name, handler) // ✅ 精准追踪到 name 的变化` }}</pre>
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
    <h4>❌ 不能作为 watch 源的：</h4>
    <ul>
      <li>普通变量（如 <code>let x = 1</code>）</li>
      <li>解构出来的响应式属性（<code>const { a } = state</code> — <code>a</code> 已变为普通值，失去响应性）</li>
      <li>非响应式对象（普通 <code>const reactiveObject = { a: 1 }</code>）</li>
      <li><code>undefined</code> / <code>null</code></li>
      <li>getter 函数的返回值本身不是响应式数据（如 <code>() => 1 + 1</code>）</li>
    </ul>
  </div>
</template>
<script setup>
import { reactive, watch } from 'vue'

// reactive 基本类型示例
// 报警告： [Vue warn] value cannot be made reactive: 1
let basicValue = reactive(1)
const changeBasicValue = () => { basicValue = 22 }
// watch () => basicValue 
// 如果直接 watch basicValue 警告： [Vue warn]: Invalid watch source:  1 A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types. 
// watch(() => basicValue,(newVal,oldVal) => {
//   console.log('watch-reactive-basicValue')
//   console.log('newVal:', newVal)
//   console.log('oldVal:', oldVal)
// })

// reactive 对象深度代理示例
const reactiveObject = reactive({ 
  name: 'vue', // 基本类型 → reactiveObject.name 取到 'vue'（普通字符串）
  mark: { x: 1 } // 引用类型 → reactiveObject.mark 取到 Proxy({ x: 1 })（响应式对象）
  // timestamp: undefined // // 基本类型 → reactiveObject.timestamp 取到 undefined
})

const editName = () => reactiveObject.name = String(Date.now())
const addTimestamp = () => reactiveObject.timestamp = { y: Date.now() }
const editTimestamp = () => reactiveObject.timestamp.y = Date.now()
const deleteTimestamp = () => delete reactiveObject.timestamp // 等价于 reactiveObject.timestamp = undefined
const editMark = () => {
  let { mark } = reactiveObject
  mark.x = Date.now() // 保持响应式，更改的是响应式数据
  // mark = { x: Date.now() } // 丢失响应式：变量mark指向一个新的内存地址
}

watch(reactiveObject,(newVal,oldVal) => {
  console.group('%c watch-reactive-reactiveObject','color: purple',)
  console.log('newVal:', newVal)
  console.log('oldVal:', oldVal)
  console.groupEnd()
})

// 当name是一个基本数据类型时，报警告，是引用类型的值是没有问题
// [Vue warn]: Invalid watch source: 'vue'  A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.
// watch(reactiveObject.name,(newVal,oldVal) => {
//   console.log('watch-reactive-reactiveObject.name')
//   console.log('newVal:', newVal)
//   console.log('oldVal:', oldVal)
// })

// 监听初始化时未声明的属性：timestamp，值为undefined，直接监听报警告，getter监听没问题
watch(
  () => reactiveObject.timestamp,
  (newVal,oldVal) => {
    console.group('%c watch-reactive-() => reactiveObject.timestamp','color: purple',)
    console.log('newVal:', newVal)
    console.log('oldVal:', oldVal)
    console.groupEnd()  
  }
  ,{ deep: true }
)

// 当name是一个基本数据类型时，可以使用getter 函数
watch(() => reactiveObject.name,(newVal,oldVal) => {
  console.group('%c watch-reactive-() => reactiveObject.name','color: purple',)
  console.log('newVal:', newVal)
  console.log('oldVal:', oldVal)
  console.groupEnd()
})

// 监听一个子属性是引用类型，需要设置deep为true
watch(
  reactiveObject.mark,
  (newVal,oldVal) => {
    console.group('%c watch-reactive-() => reactiveObject.mark','color: purple',)
    console.log('newVal:', newVal)
    console.log('oldVal:', oldVal)
    console.groupEnd()
  },
  // { deep: true }
)
</script>
