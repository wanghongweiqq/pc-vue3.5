<!-- eslint-disable vue/no-ref-as-operand -->
<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:18:00
 * @Description: ref 基本数据类型：count
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/ref/ref-count.vue
-->
<template>
  <div class="content">
    <h2>ref 基本数据类型：count</h2>
    <h3>示例</h3>    
    <div class="box">
      <p>数字-count：{{ count }}</p>
      <p>
        <el-button
          type="primary"
          @click="countAdd"
        >
          +1
        </el-button>
        <el-button
          type="danger"
          @click="countAddJieGou"
        >
          对count解构 -> 子集value -> + 1
        </el-button>
        <el-button
          type="danger"
          @click="countAddGen"
        >
          直接给count赋值 + 1
        </el-button>
        <el-button
          type="primary"
          @click="countSubtract"
        >
          -1
        </el-button>
      </p>
    </div>

    <h3>代码</h3>
    <pre>
// 创建响应式数据
const count = ref(0)

// 改变响应式数据
const countAdd = () => {
  count.value++
}

// ❌ 解构后的count丢失响应式，每次都是在原来响应式的基础上操作
const countAddJieGou = () => {
  let { value } = count
  value++
}

// ❌ 直接给count赋值后丢失响应式，count的数据仍然可正常修改，就是丢失响应式
const countAddGen = () => {
  count = { value: count.value + 1 }
}

const countSubtract = () => count.value--
</pre>
    <h4>以下行为丢失响应式</h4>
    <p>1、解构count，然后再对解构出来的value进行操作</p>
    <p>2、直接给count根层级赋值</p>
    <p><small>注意：丢失响应式后，render渲染、wacth等副作用不会触发</small></p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
let count = ref(0)

const countAdd = () => {
  count.value++
  console.log('count',count)
}

const countAddJieGou = () => {
  let { value } = count
  value++
  console.log('解构后的count丢失响应式，每次都是在原来响应式的基础上操作，本例为：+1',value)
}

const countAddGen = () => {
  // count = { value: count.value + 1 }
  // console.log('直接给count赋值后的count丢失响应式，count的数据在正常修改',count)
}

const countSubtract = () => count.value--

watch( count, (newVal,oldVal) => {
  console.log('watch-count',newVal,oldVal)
},
)
</script>
