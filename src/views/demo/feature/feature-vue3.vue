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

watch(() => ({ ...student }),(newVal,oldVal) => {
  console.log('newVal:', newVal)
  console.log('oldVal:', oldVal)
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
