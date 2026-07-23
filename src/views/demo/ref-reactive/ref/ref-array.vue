<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:23:49
 * @Description: ref array
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/ref/ref-array.vue
-->
<template>
  <div class="content">
    <h2>ref 数组格式 : refArray</h2>

    <h3>示例</h3>
    <div class="box">
      <p>{{ refArray }}</p>
      <p>
        <el-button
          type="primary"
          @click="addArrayProperty"
        >
          修改第一个数组项的version属性
        </el-button>
        <el-button
          type="primary"
          @click="subtractArrayProperty"
        >
          删除第二个数组项的version属性
        </el-button>
        <el-button
          type="primary"
          @click="pushArray"
        >
          末尾添加数组
        </el-button>
      </p>
    </div>

    <h3>代码</h3>
    <pre>
let refArray = ref([
  { name: 'vue',version: '2.5' },
  { name: 'react',version: '18.5' },
])

const addArrayProperty = () => refArray.value[0].version = '3.5'
const subtractArrayProperty = () => delete refArray.value[1].version
const pushArray = () => {
  const rn = { name: 'react-native', version: 'xx' }
  refArray.value = [...refArray.value,rn]
  // refArray.value.push({ name: 'wanghognwei ' })
  // refArray.value ++
   
  // refArray = { value: [...refArray.value,rn] } // 千万不要这样使用，这样会失去响应式，但值是改了，当有其他行为触发选按时，会按这里的最新值更新，但这时的value已经不是当初的可以在模版中解包的value，它会作为一个属性被渲染出来
  // console.log('refArray',refArray)
}

watch(refArray,(newVal,oldVal) => {
  console.log('watch-refArray',newVal,oldVal)
})
watch(refArray.value,(newVal,oldVal) => {
  console.log('watch-refArray.value',newVal,oldVal)
})
</pre>

    <h3>watch 监听说明</h3>
    <p>deep: false（默认）：只监听被监听变量本身的赋值，也就是 refArray.value = 新数组 这种整体替换；数组内部元素、对象内部属性变更，属于深层修改，不会触发 watch。 </p>
    <p>deep: true：递归监听所有深层属性，内部修改可捕获。</p>

    <h3>watch 为什么会这样呢</h3>
    <p>关键词：RefImpl setter、deep 监听、reactive Proxy 三者分工</p>

    <h4>1. 先重申两条不变事实</h4>
    <p>1、refArray.value = [] 整体替换，才会走 RefImpl 的 value setter。</p>
    <p>2、refArray.value[0].version = '3.5' 只会触发 内部 reactive Proxy 的 set 拦截，永远不会进入 RefImpl 的 value setter。</p>
    
    <h4>2. watch 普通模式（deep: false）做了什么</h4>
    <p>监听目标是 refArray（RefImpl 实例）</p>
    <p>watch 只会订阅 refArray的 getter/setter 变化</p>
    <p>只有 refArray.value = 新值 时，RefImpl 的 setter 执行 trigger，watch 才触发</p>
    <p>内部对象属性修改只会触发 reactive Proxy 的 trigger，watch 没有订阅 Proxy 内部属性，所以收不到通知</p>
    <h4>3. watch 开启 deep: true 发生了什么</h4>
    <p>当被监听的值是引用类型（对象 / 数组，也就是 refArray.value 是 reactive 代理），Vue 会递归遍历这个对象所有层级属性，全部收集依赖。</p>
    <p>1、执行 watch 初始化，读取 refArray.value → 触发 RefImpl 的 getter，拿到里面的 reactive 代理对象；</p>
    <p>2、deep: true 开启深度遍历：递归访问代理对象每一层属性；</p>
    <p>3、每访问一层属性，都会触发对应 reactive Proxy 的 getter，把当前 watch 副作用收集到 Proxy 的依赖池里；</p>
    <p>4、后续修改内部属性 refArray.value[0].name = 'xxx'：</p>
    <p>4.1、触发 reactive Proxy 的 set 拦截；</p>
    <p>4.2、Proxy 执行 trigger，找到之前收集好的 watch 副作用；</p>
    <p>4.3、执行 watch 回调，所以能监听到变化。</p>
    
    <h3>另外两个相关监听情形</h3>
    <p>1、<code>refArray.length</code> 无法被 watch。</p>
    <p>2、<code>refArray.value</code> 要慎重，理解其监听的是最初分配给value的那个引用地址的数据。</p>
    <div class="box">
      <p><code>refArray.value</code> 被 watch时，就相当于监听了一个reactive proxy对象，默认deep为true</p>
      <p><code>refArray.value</code> 之所以说要慎重，是应为value重新赋值后，这里监听不到,它监听的还是那个旧的引用地址。</p>
      <p>比如先“末尾添加数组”（使用refArray.value = []的这种改变引用形式，其实此时watch->refArray.value 监听的还是最初的引用地址，那个地址的数据没有变化，所以不会触发watch），refArray.value换了新的引用地址，数组由两个变为了三个（前两个数组项还是引用的最初的地址，虽然是解构而来，但扔保持响应式），这时再点击“修改第一个数组项的version属性”来改变第一个数组的某个属性的值，这时watch->refArray.value 感应到了初始的数据的第一项的值改变了。结果就是watch->refArray.value还是按最初的两个数组时的数据进行的改变，而watch->refArray的数据由来是：前两个旧的数据+末尾添加数组</p>
    </div>

    <p><em>注意</em>：切勿使用 <code>refArray = { value: [...] }</code> 的形式，这样会失去响应式。虽然值改了，但此时的 value 已不是原本可在模板中自动解包的 Ref，会作为普通属性被渲染出来。</p>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

let refArray = ref([
  { name: 'vue',version: '2.5' },
  { name: 'react',version: '18.5' },
])
const addArrayProperty = () => refArray.value[0].version = '3.5'
const subtractArrayProperty = () => delete refArray.value[1].version
const pushArray = () => {
  const rn = { name: 'react-native', version: 'xx' }
  refArray.value = [...refArray.value,rn]
  // refArray.value.push({ name: 'wanghognwei ' })
  // refArray.value ++
   
  // refArray = { value: [...refArray.value,rn] } // 千万不要这样使用，这样会失去响应式，但值是改了，当有其他行为触发选按时，会按这里的最新值更新，但这时的value已经不是当初的可以在模版中解包的value，它会作为一个属性被渲染出来
  // console.log('refArray',refArray)
}

watch(
  refArray,
  (newVal,oldVal) => {
    console.log('watch-refArray',newVal,oldVal)
  },
  // { deep: true }
)
watch(
  refArray.value,
  (newVal,oldVal) => {
    console.log('watch-refArray.value',newVal,oldVal)
  },
  // { deep: true } // 是否开启deep监听，效果一样，因为监听的为reactive proxy对象
)

// 和直接监听refArray是一样的修改
watch(
  () => refArray.value,
  (newVal,oldVal) => {
    console.log('watch-get-refArray.value',newVal,oldVal)
  },
  // { deep: true } // 是否开启deep监听，效果一样，因为监听的为reactive proxy对象
)
</script>
