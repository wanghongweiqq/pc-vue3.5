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
    <p>reactive 声明的基本数据类型会丢失响应式，值虽然改变了，但 watch 监听不到，也不会立刻渲染，需要其他响应式数据触发渲染时才会一并更新。</p>
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
  // reactiveObject.mark = { x: Date.now() }
}

watch(
  reactiveObject,
  // () => reactiveObject,
  (newVal,oldVal) => {
    console.group('%c watch-reactive-reactiveObject','color: purple',)
    console.log('newVal:', newVal)
    console.log('oldVal:', oldVal)
    console.groupEnd()
  }
  // ,{ deep: true } // 监听reactive的数据时，deep默认值为true，此时引用变化和内部属性变化都能监听到，deep为false时，只能监听到引用变化
)

// 当name是一个基本数据类型时，报警告，是引用类型的值是没有问题
// [Vue warn]: Invalid watch source: 'vue'  A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.
// watch(reactiveObject.name,(newVal,oldVal) => {
//   console.log('watch-reactive-reactiveObject.name')
//   console.log('newVal:', newVal)
//   console.log('oldVal:', oldVal)
// })

// 当name是一个基本数据类型时，可以使用getter 函数
watch(() => reactiveObject.name,(newVal,oldVal) => {
  console.group('%c watch-reactive-() => reactiveObject.name','color: purple',)
  console.log('newVal:', newVal)
  console.log('oldVal:', oldVal)
  console.groupEnd()
})
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

// 监听一个子属性是引用类型，需要设置deep为true，需继续研究， reactiveObject.mark监听不到
watch(
  reactiveObject.mark, // 可以监听到
  // reactiveObject.mark,
  (newVal,oldVal) => {
    console.group('%c watch-reactive-() => reactiveObject.mark','color: purple',)
    console.log('newVal:', newVal)
    console.log('oldVal:', oldVal)
    console.groupEnd()
  },
  { deep: true }
)
</script>
