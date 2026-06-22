<template>
  <div class="pg-about">
    <div class="ly-box">
      <div class="content">
        <h2>ref和reactive</h2>
        <p>总的来说，vue3版本中 composition API的ref和reactive只要不改变引用地址就能触发响应式，而option API 中响应式基本不涉及引用地址是否改变，具体可见<a href="/demo/feature">feature页面</a>。</p>
        <p>2版本中的ref和reactive只要不改变引用地址就能触发渲染</p>
        <p>Vue3 中 ref 和 reactive 的核心区别体现在数据类型支持、访问方式、响应式原理和使用场景四个维度。</p>

        <h3>1、‌数据类型支持‌</h3>
        <p>ref 支持包装基本类型（字符串、数字、布尔值）和复杂类型数据（对象/数组），内部会对对象类型自动调用 reactive‌‌</p>
        <p>reactive 仅接收对象、数组等引用类型，传入基本类型会触发警告且无法实现响应式。‌‌</p>

        <h3>2、‌数据访问方式‌</h3>
        <p>ref 需要通过 .value 访问或修改值（模板中自动解包）。</p>
        <p>reactive 可直接访问属性，无需额外操作。‌‌</p>

        <h3>3、‌响应式原理</h3>
        <p>ref 通过 RefImpl 类实现，使用 .value 的 getter/setter 拦截变更。‌‌</p>
        <p>reactive 返回 Proxy 代理对象，深度追踪嵌套属性变化。‌‌</p>

        <h3>4、‌‌使用场景对比‌</h3>

        <h4>‌优先使用 ref 的场景‌。</h4>
        <p>处理基本数据类型。</p>
        <p>需要整体替换对象引用（如重新赋值整个数组）。‌‌</p>
        <p>需要保持类型一致性（如函数参数传递）。</p>

        <h4>优先使用 reactive 的场景‌。</h4>
        <p>处理包含多个属性的复杂对象（如表单数据）。</p>
        <p>需要保持对象引用稳定（避免解构丢失响应性）。‌‌</p>

        <h4>混合使用注意事项‌。</h4>
        <p>reactive 嵌套 ref 时，ref 会自动解包。</p>
        <p>ref 嵌套 reactive 时，需通过 .value 访问对象属性。‌‌</p>

        <h3>‌进阶特性差异‌</h3>
        <h4>‌模板渲染行为</h4>
        <p>ref 在模板中自动解包顶层属性，无需 .value‌‌</p>
        <p>reactive 需保持原始对象引用，直接渲染嵌套属性。‌‌</p>

        <h4>‌类型系统表现‌。</h4>
        <p>ref 返回 Ref &lt;T&gt;类型包裹的响应式引用。</p>
        <p>reactive 保留原始对象类型推断。‌‌</p>

        <h4>‌调试信息差异‌。</h4>
        <p>ref 控制台显示为 RefImpl 实例。</p>
        <p>reactive 显示为 Proxy 代理对象。‌‌</p>

        <h3>Vue3 为什么 ref 变量需要 .value</h3>
        <p>1、Proxy 无法直接代理基本类型，必须包装成对象。‌‌</p>
        <p>2、Vue3 需要通过.value 才能做依赖追踪和视图更新。‌‌</p>
        <p>3、.value提供了明确语义，便于类型提示和维护。‌‌</p>
      </div>
      <div class="content">
        <h2>ref基本数据类型：count</h2>

        <p>{{ count }}</p>
        <p>
          <el-button
            size="small"
            type="primary"
            @click="countAdd"
          >
            +1
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="countSubtract"
          >
            -1
          </el-button>
        </p>
      </div>

      <div class="content">
        <h2>reactive object : obj</h2>
        <p>{{ obj }}</p>
        <p>
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
            删除属性
          </el-button>
        </p>
      </div>

      <div class="content">
        <h2>ref array : refArray</h2>
        <p>{{ refArray }}</p>
        <p>
          <el-button
            size="small"
            type="primary"
            @click="addArrayProperty"
          >
            添加数组的属性
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="subtractArrayProperty"
          >
            删除数组的属性
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="pushArray"
          >
            添加数组
          </el-button>
        </p>
      </div>

      <div class="content">
        <h2>reactive array : reactiveArray</h2>
        <p>{{ reactiveArray }}</p>
        <p>
          <el-button
            size="small"
            type="primary"
            @click="addArrayPropertyReactive"
          >
            添加数组的属性
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="subtractArrayPropertyReactive"
          >
            删除数组的属性
          </el-button>
          <el-button
            size="small"
            type="primary"
            @click="pushArrayReactive"
          >
            添加数组
          </el-button>
        </p>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<!--组合式/Composition API-->
<script setup>
import {
  ref,
  reactive,
  watch,
} from 'vue'
console.log('组件（ref-reactive）中的script setup中的普通代码只会在初始化时触发一次执行，当触发页面的事件如点击时会触发render函数来渲染模版template里的内容')

// ref基本数据类型:count
const count = ref(0)
const countAdd = () => {
  count.value++
  console.log('点击事件count+1，count的value值立即更新。','count.value:',count.value,';  count:',count)
}
const countSubtract = () => count.value--
watch(
  count,
  (newVal,oldVal) => {
    console.log('watch-count')
    console.log('newVal:', newVal)
    console.log('oldVal:', oldVal)
  },
  {
    immediate: true, // 默认false
    deep: true, // 默认false
  }
)
// reactive object:obj
const obj = reactive({ name: 'Vue3' })
const objAddProperty = () => obj.age = 1
const objSubtractProperty = () => delete obj.age // obj.age = undefined
watch(obj,(newVal,oldVal) => {
  console.log('watch-obj')
  console.log('newVal:', newVal)
  console.log('oldVal:', oldVal)
})

let refArray = ref(
  [
    { name: 'vue',version: '2.5' },
    { name: 'react',version: '18.5' },
  ]
)
const addArrayProperty = () => refArray.value[0].version = '3.5'
const subtractArrayProperty = () => delete refArray.value[1].version
const pushArray = () => {
  // const a = [4,5]
  // refArray.value = [...refArray.value,...a]
  const a = [{ name: 'wanghognwei ' }]
  refArray.value = [...refArray.value,...a]
  // refArray.value.push({ name: 'wanghognwei ' })
  // refArray.value ++
  // refArray = { value: [...refArray.value,...a] } // 千万不要这样使用，这样会失去响应式，但值是改了，当有其他行为触发选按时，会按这里的最新值更新，但这时的value已经不是当初的可以在模版中解包的value，它会作为一个属性被渲染出来
  // console.log('refArray',refArray)
}

// ref 声明的Array数据，各种改变形式都能实现状态更新和渲染。
// watch默认不是深度监听
// watch监听引用类型数据（本例为数组refArray）的情况，默认deep=false（不设置为深度监听），未改变引用而是改变value数据的某一子项值（如给数组类型的数据末尾添加一项）不会被监听到。改变其属性value的引用（ refArray.value = [……]）才能被watch到，也能比较具体的新旧值。但设置为深度监听时，都可以被监听到，但未改变引用的时候新旧值一样（都是展示最新的数据，这时要在监听里面做新旧值的逻辑判断处理就实现不了，如果只是按最新值判断是可以的）
// 从中可以看出ref设定的数据，都是希望改变其value的引用地址，比如基本类型的数据，修改数据就相当于改变引用重新赋值，而引用类型的数据，value=新值，也是同样的道理。

// 另外两个相关监听情形如下：
// refArray.length无法被watch
// refArra.value也能被watch，但只能是不改变引用才能监听到，类似于reactive的监听。因为没有改变引用，新旧值还是一样的
watch(refArray,(newVal,oldVal) => {
  console.log('watch-refArray')
  console.log('newVal:', newVal)
  console.log('oldVal:', oldVal)
},
// { deep: true }
)
watch(refArray.value,(newVal,oldVal) => {
  console.log('watch-refArray.value')
  console.log('newVal:', newVal)
  console.log('oldVal:', oldVal)
},
// { deep: true }
)

let reactiveArray = reactive(
  [
    { name: 'Vue3' },
    { name: 'react',version: '18.5' },
  ]
)
const addArrayPropertyReactive = () => reactiveArray[0].version = '3.5'
const subtractArrayPropertyReactive = () => delete reactiveArray[1].version
const pushArrayReactive = () => {
  console.log('pushArrayReactive')
  // const a = [4,5]
  // reactiveArray = [...reactiveArray,...a]
  const a = [{ name: 'wanghognwei ' }]
  reactiveArray = [...reactiveArray,...a]
  // console.log('reactiveArray',reactiveArray)
  // reactiveArray.push({ name: 'wanghognwei ' })
  // reactiveArray.splice(reactiveArray.length ,0,...a)
  // reactiveArray ++
}

// reactive声明的数组改变引用不会同步状态和渲染最新状态，也就是丢失响应性。只有对数组不改变引用的操作才可以使其状态同步，比如数组的：push、unshift、splice等操作
// react 的hooks中state改变数组，要改变引用才会生效，两者是不同的
// reactive声明的数组/对象， 只有在不改变引用的情况下才能监听到，但新、旧值一样，因为引用一直没变，所以监听做新旧值的比较时没有意义
// reactive声明的基本数据类型时会丢失响应式，但值是变了，需要其他响应式数据触发渲染时才会一起渲染，watch是监听不到的

watch(reactiveArray,(newVal,oldVal) => {
  console.log('watch-reactiveArray')
  console.log('newVal:', newVal)
  console.log('oldVal:', oldVal)
},
// { deep: true }
)

</script>
