<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-20 10:43:34
 * @Description: ref object
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/ref/ref-object.vue
-->

<template>
  <div class="content">
    <h2>ref 对象格式 : refObject</h2>
    <p>下面的示例主要讲了结构对ref响应式数据的影响</p>
    <p><em>解构本身不会破坏响应式，破坏响应式的是：把解构出来的变量当成“新变量”重新赋值，而不是修改原对象的属性。</em></p>

    <h3>示例</h3>
    <div class="box">
      <p>{{ refObject }}</p>
      <p>
        <el-button
          type="primary"
          @click="addObjectProperty"
        >
          修改version属性
        </el-button>
        <el-button
          type="primary"
          @click="subtractObjectProperty"
        >
          删除version属性
        </el-button>
        <el-button
          type="danger"
          @click="objectJieGou"
        >
          对refObject解构出value -> 对value重新赋值
        </el-button>
        <el-button
          type="danger"
          @click="objectJieGou2"
        >
          对refObject解构出value -> 将value继续解构出name -> 对name重新赋值
        </el-button>
        <el-button
          type="primary"
          @click="objectJieGou3"
        >
          对refObject解构出value -> 将value.name重新赋值
        </el-button>
      </p>
    </div>

    <h3>代码</h3>
    <pre>
let refObject = ref( { name: { firstname: 'vue' }, version: '2.5' })

const addObjectProperty = () => refObject.value.version = '3.5'
const subtractObjectProperty = () => delete refObject.value.version

// ❌ 对refObject解构出value -> 对value重新赋值, 会失去响应式
const objectJieGou = () => {
  let { value } = refObject
  value = { name: { firstname: 'vue3' } }
  console.log('对refObject解构 -> 子集value -> 重新赋值：',refObject,value)
}

// ❌ 对refObject解构出value -> 将value继续解构出name -> 对name重新赋值, 会失去响应式
const objectJieGou2 = () => {
  let { value } = refObject
  let { name } = value
  name = { firstname: 'react' } 
  // name.firstname = 'react' ✅ 还能保持响应式
}

// ✅ 对refObject解构出value -> 将value.name重新赋值, 保持响应式
const objectJieGou3 = () => {
  let { value } = refObject
  value.name = { firstname: Date.now() }
}
</pre>

    <h3>解析</h3>
    <h4>1、refObject是一个 RefImpl</h4>
    <pre>
refObject = {
  value: { // 属性value重新赋值，走RefImpl的setter，value的对象性质的值走reactive的Proxy
    name: { firstname: 'vue' },
    version: '2.5'
  }
}
</pre>
    <h4>2、let { value } = refObject</h4>
    <p>👉 把 refObject.value这个对象引用复制给了局部变量 value</p>
    <p>value是“指向这个响应式对象的一个普通变量”</p>
    <p>❌ 此时如果：value = { name: { firstname: 'vue3' } }，只是改了局部变量 name的指向，丢失了响应式</p>
    <p>✅ 此时如果：value.name = { firstname: 'vue3' }，修改的是响应式对象的数据，所以仍然是响应式的</p>

    <h4>3、let { name } = value</h4> 
    <p>👉 把 value.name的引用复制给了局部变量 name</p>
    <p>name现在是“指向响应式对象 { firstname: 'vue' }的一个普通变量”</p>
    <p>✅ 此时如果：name.firstname = 'react' 修改的是响应式对象的属性，所以还能保持响应式</p>
    <p>❌ 此时如果：name = { firstname: 'react' }，只是改了局部变量 name的指向，value.name / refObject.value.name也没变，他们依然指向的原来的响应式对象。Vue 根本感知不到这次“赋值”，因为根本就没有改动到响应式对象上</p>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

let refObject = ref( { name: { firstname: 'vue' } })

const addObjectProperty = () => refObject.value.version = '3.5'
const subtractObjectProperty = () => delete refObject.value.version
const objectJieGou = () => {
  let { value } = refObject
  value = { name: { firstname: 'vue3' } }
  console.log('对refObject解构出value -> 对value重新赋值：',refObject,value)
}
const objectJieGou2 = () => {
  let { value } = refObject
  let { name } = value
  name = { firstname: 'react' }
  // name.firstname = 'react' 这样还是响应式
  console.log('对refObject解构出value -> 将value继续解构出name -> 对name重新赋值：',refObject,value)
}

const objectJieGou3 = () => {
  let { value } = refObject
  value.name = { firstname: Date.now() }
  // value.name.firstname = Date.now()
  // refObject.value = { name: { firstname: Date.now() } }
  console.log('对refObject解构出value -> 将value.name重新赋值：',refObject,refObject.value)
}

watch( refObject,(newVal,oldVal) => {
  console.log('watch-refObject',newVal,oldVal)
},
{ deep: true }
)

// refObject.value = { name: { firstname: Date.now() } }，这样修改时将监听不到
watch(() => refObject.value,(newVal,oldVal) => {
  console.log('watch-refObject.value',newVal,oldVal,newVal === oldVal)
},
// { deep: true }
)

watch(refObject.value.name,(newVal,oldVal) => {
  console.log('watch-refObject.value.name',newVal,oldVal,newVal === oldVal)
},
// { deep: true }
)
</script>
