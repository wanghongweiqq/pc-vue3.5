<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:18:00
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/views/demo/function/index.vue
-->
<template>
  <div class="pg-func">
    <CpCrumbs />
    <el-tabs v-model="activeTab">
      <el-tab-pane
        label="工厂函数"
        name="factory"
      >
        <FunctionFactory v-if="activeTab === 'factory'" />
      </el-tab-pane>
      <el-tab-pane
        label="构造函数"
        name="constructor"
      >
        <FunctionConstructor v-if="activeTab === 'constructor'" />
      </el-tab-pane>
      <el-tab-pane
        label="原型"
        name="prototype"
      >
        <FunctionPrototype v-if="activeTab === 'prototype'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import CpCrumbs from '@/components/crumbs/'
import FunctionFactory from './function-factory'
import FunctionConstructor from './function-constructor'
import FunctionPrototype from './function-prototype'

export default {
  components: {
    CpCrumbs,
    FunctionFactory,
    FunctionConstructor,
    FunctionPrototype,
  },
  data () {
    return{
      activeTab: 'factory',
    }
  },
}
</script>
