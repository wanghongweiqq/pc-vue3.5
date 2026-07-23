<template>
  <div class="content">
    <p>选择排序（Selection Sort）是一种直观的排序算法，每次从待排序区间中选出最小（或最大）的元素，放到已排序区间的末尾。</p>
    <table class="table">
      <tbody>
        <tr><th>维度</th><th>说明</th><th>示例</th></tr>
        <tr>
          <th>核心思想</th>
          <td>将数组分为已排序区间和未排序区间。每轮遍历未排序区间，找到最小值，将其与未排序区间的第一个元素交换位置，然后将已排序区间扩大一位。重复此过程直到全部有序。</td>
          <td>[4, 0, 1, 2, 3, 5] → 第1轮选0与4交换 → [0, 4, 1, 2, 3, 5]</td>
        </tr>
        <tr>
          <th>时间复杂度</th>
          <td>O(n²)，无论数据是否有序都需完整扫描。比较次数固定为 n(n-1)/2。</td>
          <td>[1, 2, 3, 4, 5, 6] 已有序，仍需 15 次比较，无法提前退出</td>
        </tr>
        <tr>
          <th>空间复杂度</th>
          <td>O(1)，原地排序，仅用 minIndex 记录下标。</td>
          <td>仅需 minIndex 和临时变量，不额外分配数组</td>
        </tr>
        <tr>
          <th>稳定性</th>
          <td>不稳定。跳跃式交换可能跨过相等元素，破坏相对顺序。</td>
          <td>[5a, 8, 5b, 2] → 第1轮选2与5a交换 → [2, 8, 5b, 5a]，5b 跑到 5a 前面</td>
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
      执行选择排序
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

const code = `for (let i = 0; i < arr.length - 1; i++) {
  let minIndex = i
  for (let j = i + 1; j < arr.length; j++) {
    if (arr[j] < arr[minIndex]) {
      minIndex = j
    }
  }
  [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
}`

const result = ref([])
const count = ref(0)

const run = () => {
  const arr = [...props.list]
  let x = 0
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i
    for (let j = i + 1; j < arr.length; j++) {
      x++
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
    }
  }
  result.value = arr
  count.value = x
}
</script>