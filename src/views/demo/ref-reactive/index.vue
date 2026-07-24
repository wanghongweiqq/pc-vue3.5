<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:18:00
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/index.vue
-->
<template>
  <div class="pg-about">
    <el-tabs v-model="activeTab">
      <el-tab-pane
        label="基本信息"
        name="intro"
      >
        <Intro />
      </el-tab-pane>

      <el-tab-pane
        label="ref"
        name="ref"
      >
        <Ref />
      </el-tab-pane>

      <el-tab-pane
        label="reactive"
        name="reactive"
      >
        <Reactive />
      </el-tab-pane>
      <el-tab-pane
        label="proxy 与响应式边界"
        name="proxy"
      >
        <ProxyReactivity />
      </el-tab-pane>

      <el-tab-pane
        label="watch / watchEffect"
        name="watch"
      >
        <WatchWatchEffect />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Intro from './intro'
import Ref from './ref'
import Reactive from './reactive'
import ProxyReactivity from './proxy-reactivity'
import WatchWatchEffect from './watch-watcheffect'
const route = useRoute()
const activeTab = ref(route.query.tab || 'intro')
</script>
