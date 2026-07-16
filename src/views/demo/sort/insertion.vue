<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-06 16:34:21
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/views/demo/sort/insertion.vue
-->
<template>
  <div class="ly-box">
    <div class="content">
      <p>插入排序（Insertion Sort）是一种简单直观的排序算法，它的工作原理类似整理扑克牌：将未排序的元素逐个插入到已排序区间的正确位置。</p>
      <table class="table">
        <tbody>
          <tr><th>维度</th><th>说明</th><th>示例</th></tr>
          <tr>
            <th>核心思想</th>
            <td>将数组分为已排序区间和未排序区间。每次取未排序区间的第一个元素，在已排序区间中从后向前扫描，找到合适位置插入。重复直到所有元素插入完毕。</td>
            <td>[4, 0, 1, 2, 3, 5] → 取0插入到4前 → [0, 4, 1, 2, 3, 5] → 取1插入到0和4之间 → [0, 1, 4, 2, 3, 5]</td>
          </tr>
          <tr>
            <th>时间复杂度</th>
            <td>O(n²)，两层循环。最好 O(n)：数组已有序时 while 内层不执行。</td>
            <td>最坏 [6, 5, 4, 3, 2, 1]：每次都要移到最前面；最好 [1, 2, 3, 4, 5, 6]：while 一次都不执行</td>
          </tr>
          <tr>
            <th>空间复杂度</th>
            <td>O(1)，原地排序，仅用 key 保存当前插入值。</td>
            <td>仅需 key 变量暂存当前值，不额外分配数组</td>
          </tr>
          <tr>
            <th>稳定性</th>
            <td>稳定。while 条件是 > 而非 >=，相等元素不会插入到前面，后出现的相等元素排在后面。</td>
            <td>[5a, 3, 5b, 2] → [2, 3, 5a, 5b]，5a 仍在 5b 前面</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="content">
      <p>原始数组：{{ list }}</p>
      <p>排序结果：{{ result }}</p>
      <p>循环次数：{{ count }}</p>
      <el-button
        size="small"
        type="primary"
        @click="run"
      >
        执行插入排序
      </el-button>
      <h4>算法逻辑：</h4>
      <pre>{{ code }}</pre>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  list: { type: Array, required: true }
})

const code = `for (let i = 1; i < arr.length; i++) {
  const key = arr[i]
  let j = i - 1
  while (j >= 0 && arr[j] > key) {
    arr[j + 1] = arr[j]
    j--
  }
  arr[j + 1] = key
}`

const result = ref([])
const count = ref(0)

const run = () => {
  const arr = [...props.list]
  let x = 0
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]
    let j = i - 1
    while (j >= 0 && arr[j] > key) {
      x++
      arr[j + 1] = arr[j]
      j--
    }
    if (j >= 0) x++
    arr[j + 1] = key
  }
  result.value = arr
  count.value = x
}
</script>