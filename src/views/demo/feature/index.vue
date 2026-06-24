<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div class="pg-feature">
    <cp-crumbs />
    <div class="ly-box">
      <el-tabs v-model="activeTab">
        <el-tab-pane
          label="Proxy API"
          name="proxy"
        >
          <FeatureProxy />
        </el-tab-pane>
        <el-tab-pane
          label="Vue.set"
          name="vue-set"
        >
          <FeatureVueSet />
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
  </div>
</template>
<script setup>
import { ref } from 'vue'
import CpCrumbs from '@/components/crumbs/'
import FeatureProxy from './feature-proxy'
import FeatureVueSet from './feature-vue-set'
import FeatureVue3 from './feature-vue3'
import FeatureVmodel from './feature-vmodel'
import FeatureOther from './feature-other'

const activeTab = ref('proxy')
</script>
