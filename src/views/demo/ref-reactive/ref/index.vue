<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:18:00
 * @Description: ref的使用
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/ref/index.vue
-->
<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane
      label="ref 介绍"
      name="intro"
    >
      <RefIntro />
    </el-tab-pane>

    <el-tab-pane
      label="ref count"
      name="count"
    >
      <RefCount />
    </el-tab-pane>

    <el-tab-pane
      label="ref array"
      name="array"
    >
      <RefArray />
    </el-tab-pane>

    <el-tab-pane
      label="ref object"
      name="object"
    >
      <RefObject />
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import RefIntro from './ref-intro'
import RefCount from './ref-count'
import RefArray from './ref-array'
import RefObject from './ref-object'

const route = useRoute()
const activeTab = ref(route.query.subTab || 'intro')

</script>
