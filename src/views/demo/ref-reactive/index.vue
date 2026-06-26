<template>
  <div class="pg-about">
    <div class="ly-box">
      <el-tabs v-model="activeTab">
        <el-tab-pane
          label="ref 和 reactive"
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
          label="reactive obj"
          name="obj"
        >
          <ReactiveObj />
        </el-tab-pane>

        <el-tab-pane
          label="ref array"
          name="refArray"
        >
          <RefArray />
        </el-tab-pane>

        <el-tab-pane
          label="reactive array"
          name="reactiveArray"
        >
          <ReactiveArray />
        </el-tab-pane>

        <el-tab-pane
          label="proxy 与响应式边界"
          name="proxyReactivity"
        >
          <ProxyReactivity />
        </el-tab-pane>

        <el-tab-pane
          label="watch / watchEffect"
          name="watchWatchEffect"
        >
          <WatchWatchEffect />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import RefIntro from './ref-intro'
import RefCount from './ref-count'
import ReactiveObj from './reactive-obj'
import RefArray from './ref-array'
import ReactiveArray from './reactive-array'
import ProxyReactivity from './proxy-reactivity'
import WatchWatchEffect from './watch-watcheffect'

const activeTab = ref('intro')
</script>
