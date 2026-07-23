<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-06 16:34:26
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/views/demo/sort/quick.vue
-->
<template>
  <div class="content">
    <p>快速排序（Quick Sort）是一种基于分治思想的高效排序算法，由 C.A.R. Hoare 于 1960 年提出，是实际应用中最常用的排序算法之一。</p>
    <table class="table">
      <tbody>
        <tr><th>维度</th><th>说明</th><th>示例</th></tr>
        <tr>
          <th>核心思想</th>
          <td>从数组中选取一个基准值（pivot），将数组分为两部分：小于基准的放左边，大于等于基准的放右边。然后对左右两部分递归执行同样的操作，直到子数组长度为 1 或 0。</td>
          <td>[4, 0, 1, 2, 3, 5] → pivot=4，左[0,1,2,3] 右[5] → 递归左 → [0,1,2,3,4,5]</td>
        </tr>
        <tr>
          <th>时间复杂度</th>
          <td>平均 O(n log n)，每次 partition 约 n 次比较，递归深度 log n。最坏 O(n²)：pivot 每次选到最小/最大值，递归深度变为 n。</td>
          <td>最好 [4, 0, 1, 2, 3, 5]：pivot 居中，深度 ~3；最坏 [1, 2, 3, 4, 5, 6]：pivot 每次最小，深度 6，退化为 O(n²)</td>
        </tr>
        <tr>
          <th>空间复杂度</th>
          <td>O(log n)，递归调用栈的深度。最坏退化为 O(n)。</td>
          <td>均衡分区时递归深度 log₂6 ≈ 3；极端情况递归深度 6</td>
        </tr>
        <tr>
          <th>稳定性</th>
          <td>不稳定。经典原地实现中，partition 跳跃式交换会打乱相等元素的相对顺序。</td>
          <td>[5a, 3, 5b, 2, 5c, 1] → [1, 2, 3, 5a, 5c, 5b]，5b 和 5c 顺序颠倒</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="content">
    <p>原始数组：{{ list }}</p>
    <p>排序结果：{{ result }}</p>
    <p>执行次数：{{ count }}</p>
    <el-button
      size="small"
      type="primary"
      @click="run"
    >
      执行快速排序
    </el-button>
    <h4>算法逻辑：</h4>
    <pre>{{ code }}</pre>
  </div>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  list: { type: Array, required: true }
})

const code = `function quickSort(arr) {
  if (arr.length <= 1) return arr
  const pivot = arr[0]
  const left = arr.slice(1).filter(v => v < pivot)
  const right = arr.slice(1).filter(v => v >= pivot)
  return [...quickSort(left), pivot, ...quickSort(right)]
}`

const result = ref([])
const count = ref(0)

const quickSort = (arr) => {
  if (arr.length <= 1) return arr
  const pivot = arr[0]
  const left = []
  const right = []
  for (let i = 1; i < arr.length; i++) {
    count.value++
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return [...quickSort(left), pivot, ...quickSort(right)]
}

const run = () => {
  count.value = 0
  result.value = quickSort([...props.list])
}
</script>