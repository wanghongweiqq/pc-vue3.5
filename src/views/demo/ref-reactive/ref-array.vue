<template>
  <div class="content">
    <h2>ref array : refArray</h2>
    <p>ref 声明的 Array 数据，各种改变.value的形式都能实现状态更新和渲染。</p>

    <h3>watch 监听说明</h3>
    <p>watch 默认不是深度监听（deep: false）。</p>
    <p>监听引用类型数据（本例为数组 refArray）时：</p>
    <ul>
      <li>未改变引用、只修改子项值（如修改数组某项属性）→ <em>监听不到</em></li>
      <li>改变 value 的引用（如 refArray.value = [...]）→ 能监听到，且能比较新旧值</li>
      <li>设置 deep: true → 两种操作都能监听到，但未改变引用时新旧值相同，无法做差异比较</li>
    </ul>
    <p>从中可以看出：ref 设定的数据，都希望通过改变 value 的引用地址来触发响应。基本类型修改即重新赋值，引用类型也需 value = 新值。</p>

    <h3>另外两个相关监听情形</h3>
    <p>1、<code>refArray.length</code> 无法被 watch</p>
    <p>2、<code>refArray.value</code> 要慎重，理解其监听的是最初分配给它的那个引用地址的数据</p>
    <ul>
      <li><code>refArray.value</code> 也能被 watch，但只有不改变引用时才能监听到（类似 reactive），且新旧值相同</li>
      <li><code>refArray.value</code> 之所以说要慎重，是应为获取的数据可能和你想象的会不一样（或者叫不准），比如先“末尾添加数组”（使用refArray.value = []的这种改变引用形式，其实此时watch->refArray.value 监听的还是最初的引用地址，那个地址的数据没有变化，所以不会触发watch），refArray.value换了新的引用地址，数组由两个变为了三个（前两个数组项还是引用的最初的地址，虽然是解构而来，但扔保持响应式），这时再点击“修改第一个数组项的version属性”来改变第一个数组的某个属性的值，这时watch->refArray.value 感应到了初始的数据的第一项的值改变了。结果就是watch->refArray.value还是按最初的两个数组时的数据进行的改变，而watch->refArray的数据由来是：前两个旧的数据+末尾添加数组，在deep为true时能感应到数据变化</li>
    </ul>

    <h3>示例</h3>
    <p>{{ refArray }}</p>
    <p>
      <el-button
        size="small"
        type="primary"
        @click="addArrayProperty"
      >
        修改第一个数组项的version属性
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="subtractArrayProperty"
      >
        删除第二个数组项的version属性
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="pushArray"
      >
        末尾添加数组
      </el-button>
    </p>
    <p><em>注意</em>：切勿使用 <code>refArray = { value: [...] }</code> 的形式，这样会失去响应式。虽然值改了，但此时的 value 已不是原本可在模板中自动解包的 Ref，会作为普通属性被渲染出来。</p>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

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
</script>
