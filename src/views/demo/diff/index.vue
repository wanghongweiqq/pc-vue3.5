<template>
  <div class="pg-diff">
    <div class="ly-box">
      <CpCrumbs />
      <el-tabs v-model="activeTab">
        <el-tab-pane
          label="什么是 Diff"
          name="intro"
        >
          <DiffIntro />
        </el-tab-pane>
        <el-tab-pane
          label="Vue 2"
          name="vue2"
        >
          <DiffVue2 />
        </el-tab-pane>
        <el-tab-pane
          label="Vue 3"
          name="vue3"
        >
          <DiffVue3 />
        </el-tab-pane>
        <el-tab-pane
          label="React"
          name="react"
        >
          <DiffReact />
        </el-tab-pane>
        <el-tab-pane
          label="三者对比"
          name="compare"
        >
          <DiffCompare />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import CpCrumbs from '@/components/crumbs/'
import DiffIntro from './diff-intro'
import DiffVue2 from './diff-vue2'
import DiffVue3 from './diff-vue3'
import DiffReact from './diff-react'
import DiffCompare from './diff-compare'

const activeTab = ref('intro')
</script>
