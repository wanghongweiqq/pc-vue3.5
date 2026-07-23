<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-06 16:34:02
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/views/demo/setup/index.vue
-->
<!--
 * @Description: 排序算法
-->
<template>
  <div class="pg-setup">
    <CpCrumbs />
    <el-tabs v-model="activeTab">
      <el-tab-pane
        label="render"
        name="render"
      >
        <Render />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import CpCrumbs from '@/components/crumbs/'
import Render from './render.vue'

const activeTab = ref('render')
</script>