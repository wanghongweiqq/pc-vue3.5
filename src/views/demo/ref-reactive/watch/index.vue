<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-28 13:05:59
 * @Description: watch的使用
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/watch/index.vue
-->
<template>
  <el-tabs v-model="activeTab">
    <el-tab-pane
      label="参数"
      name="params"
    >
      <Params />
    </el-tab-pane>

    <el-tab-pane
      label="清理副作用"
      name="effect"
    >
      <SideEffect />
    </el-tab-pane>

    <el-tab-pane
      label="清理监听"
      name="stop"
    >
      <Stop />
    </el-tab-pane>
  </el-tabs>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import SideEffect from './side-effect'
import Params from './params'
import Stop from './stop'

const route = useRoute()
const activeTab = ref(route.query.subTab || 'effect')

</script>
