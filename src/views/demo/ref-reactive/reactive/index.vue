<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:18:00
 * @Description: ref的使用
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/reactive/index.vue
-->
<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane
      label="reactive object"
      name="object"
    >
      <ReactiveObj />
    </el-tab-pane>
    <el-tab-pane
      label="reactive array "
      name="array"
    >
      <ReactiveArray />
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ReactiveObj from './reactive-object'
import ReactiveArray from './reactive-array'

const route = useRoute()
const activeTab = ref(route.query.subTab || 'object')

</script>
