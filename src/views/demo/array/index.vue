<!--
 * @Description: 数组的操作
-->
<template>
  <div class="pg-array">
    <CpCrumbs />
    <el-tabs v-model="activeTab">
      <el-tab-pane
        label="创建数组"
        name="create"
      >
        <ArrayCreate />
      </el-tab-pane>
      <el-tab-pane
        label="常用方法"
        name="methods"
      >
        <ArrayMethods />
      </el-tab-pane>
      <el-tab-pane
        label="循环动态改变"
        name="loop"
      >
        <ArrayLoop />
      </el-tab-pane>
      <el-tab-pane
        label="类数组与可迭代"
        name="like"
      >
        <ArrayLike />
      </el-tab-pane>
      <el-tab-pane
        label="解构影响"
        name="destruct"
      >
        <ArrayDestruct />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted } from 'vue'
import CpCrumbs from '@/components/crumbs/'
import utils from '@/assets/js/utils'
import ArrayCreate from './array-create'
import ArrayMethods from './array-methods'
import ArrayLoop from './array-loop'
import ArrayLike from './array-like'
import ArrayDestruct from './array-destruct'

const activeTab = ref('create')

function jieGou () {
  let obj = { a: { l: 1 }, b: { l: 1 }, c: 3, d: 4,e: null }
  let objCopy = utils.copyDeep(obj)
  let { a, b, c, d,e = 1 } = obj
  a = { m: 2 }
  b.l = 2
  c = 'c'
  d = { l: 3 }
  console.log('greenM','log原数据：',objCopy)
  console.info('greenM','info原数据：',objCopy)
  console.log('redM','新数据：',obj)
  console.log('blueM','解构e时其默认值为1：',e)
}

onMounted(() => {
  jieGou(1,2)
})
</script>
