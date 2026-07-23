<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:18:00
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/views/demo/feature/feature-vue3.vue
-->
<template>
  <div class="content">
    <h2>Vue 3 实例</h2>
    <p>
      <el-button
        size="small"
        type="primary"
        @click="goodProxy"
      >
        修改对象、数组
      </el-button>
    </p>
    <p>{{ student.name }}：{{ student.sex }}</p>
    <p>{{ books }}</p>
  </div>
</template>
<script setup>
import { reactive, watch } from 'vue'

const student = reactive({ name: 'wanghongwei' })
const books = reactive(['语文','数学'])

watch(() => student,(newVal,oldVal) => {
  console.log('watch -> getter函数 student', newVal,oldVal)
},{ immediate: true,deep: true })

watch( student,(newVal,oldVal) => {
  console.log('watch -> 直接监听 student', newVal,oldVal)
},{ immediate: true })

watch(books,(newVal,oldVal) => {
  console.log('newVal:', newVal)
  console.log('oldVal:', oldVal)
})

const goodProxy = () => {
  student.sex = '男'
  books.length = 1
}
</script>
