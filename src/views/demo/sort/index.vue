<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-06 16:34:02
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/views/demo/sort/index.vue
-->
<!--
 * @Description: 排序算法
-->
<template>
  <div class="pg-sort">
    <CpCrumbs />
    <div class="content">
      <h4>关键词含义</h4>
      <table class="table">
        <tbody>
          <tr><th>关键词</th><th>含义</th></tr>
          <tr><td>时间复杂度</td><td>算法执行所需时间随数据规模增长的趋势，用大 O 表示法描述。O(n²) 表示数据量翻倍时执行时间约变为 4 倍。</td></tr>
          <tr><td>空间复杂度</td><td>算法执行过程中额外占用的内存空间随数据规模增长的趋势。O(1) 表示原地排序，不需要额外空间。</td></tr>
          <tr><td>稳定性</td><td>排序前后值相等的元素相对顺序是否保持不变。稳定意味着相等元素不会因排序而交换位置。</td></tr>
        </tbody>
      </table>
    </div>
    <div class="content">
      <h4>算法对比</h4>
      <table class="table">
        <tbody>
          <tr><th>算法</th><th>核心思想</th><th>时间复杂度</th><th>空间复杂度</th><th>稳定性</th></tr>
          <tr><td>冒泡排序</td><td>相邻两两比较，大的往后冒</td><td>O(n²) / 最好 O(n)</td><td>O(1)</td><td>稳定</td></tr>
          <tr><td>选择排序</td><td>每轮选最小/最大放到对应位置</td><td>O(n²)</td><td>O(1)</td><td>不稳定</td></tr>
          <tr><td>插入排序</td><td>类似整理扑克牌，逐个插入</td><td>O(n²) / 最好 O(n)</td><td>O(1)</td><td>稳定</td></tr>
          <tr><td>快速排序</td><td>分治，选基准值 partition 左右递归</td><td>O(n log n) / 最坏 O(n²)</td><td>O(log n)</td><td>不稳定</td></tr>
        </tbody>
      </table>
    </div>
    <el-tabs v-model="activeTab">
      <el-tab-pane
        label="冒泡排序"
        name="bubble"
      >
        <BubbleSort :list="list" />
      </el-tab-pane>
      <el-tab-pane
        label="选择排序"
        name="selection"
      >
        <SelectionSort :list="list" />
      </el-tab-pane>
      <el-tab-pane
        label="插入排序"
        name="insertion"
      >
        <InsertionSort :list="list" />
      </el-tab-pane>
      <el-tab-pane
        label="快速排序"
        name="quick"
      >
        <QuickSort :list="list" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import CpCrumbs from '@/components/crumbs/'
import BubbleSort from './bubble.vue'
import SelectionSort from './selection.vue'
import InsertionSort from './insertion.vue'
import QuickSort from './quick.vue'

const activeTab = ref('bubble')
const list = ref([4, 0, 1, 2, 3, 5])
</script>