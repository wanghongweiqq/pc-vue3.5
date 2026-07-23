<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:18:00
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/views/demo/feature/index.vue
-->
<template>
  <div class="pg-feature">
    <cp-crumbs />
    <el-tabs v-model="activeTab">
      <el-tab-pane
        label="Vue2 弊端"
        name="Vue2"
      >
        <FeatureVue2 />
      </el-tab-pane>
      <el-tab-pane
        label="Vue 3 实例"
        name="vue3"
      >
        <FeatureVue3 />
      </el-tab-pane>
      <el-tab-pane
        label="v-model"
        name="vmodel"
      >
        <FeatureVmodel />
      </el-tab-pane>
      <el-tab-pane
        label="其他更新"
        name="other"
      >
        <FeatureOther />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import CpCrumbs from '@/components/crumbs/'
import FeatureVue2 from './feature-vue2'
import FeatureVue3 from './feature-vue3'
import FeatureVmodel from './feature-vmodel'
import FeatureOther from './feature-other'

const activeTab = ref('Vue2')
</script>
