<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-07 10:47:40
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/views/demo/sort/bubble.vue
-->
<template>
  <div class="content">
    <p>冒泡排序（Bubble Sort）是一种简单的交换排序算法，因较小的元素会如同气泡般逐渐"浮"到数组的顶端而得名。</p>
    <table class="table">
      <tbody>
        <tr><th>维度</th><th>说明</th><th>示例</th></tr>
        <tr>
          <th>核心思想</th>
          <td>重复遍历数组，依次比较相邻的两个元素，如果顺序错误就交换它们。每轮遍历会将当前未排序区间中的最大值"冒泡"到最后的位置。经过 n-1 轮遍历后，数组有序。</td>
          <td>[4, 0, 1, 2, 3, 5] → 第1轮：0-1-2-3-4-5 完成排序</td>
        </tr>
        <tr>
          <th>时间复杂度</th>
          <td>O(n²)，两层循环。最好情况 O(n)：数组已有序，内层循环检测到无交换提前退出。</td>
          <td>最坏 [6, 5, 4, 3, 2, 1]：需 15 次比较；最好 [1, 2, 3, 4, 5, 6]：仅 5 次比较后退出</td>
        </tr>
        <tr>
          <th>空间复杂度</th>
          <td>O(1)，原地排序，仅用常数个临时变量。</td>
          <td>仅需 temp 变量暂存交换值，不额外分配数组</td>
        </tr>
        <tr>
          <th>稳定性</th>
          <td>稳定。比较条件是 > 而非 >=，相等元素不交换，相对顺序不变。</td>
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
      执行冒泡排序
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
  for (let j = 0; j < arr.length - 1 - i; j++) {
    if (arr[j] > arr[j + 1]) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
    }
  }
}`

const result = ref([])
const count = ref(0)

const run = () => {
  const arr = [...props.list]
  let x = 0
  for (let i = 0; i < arr.length - 1; i++) {
    const sortLength = arr.length - 1 - i
    let l = 0
    for (let j = 0; j < sortLength; j++) {
      x++
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      } else {
        l++
      }
    }
    if (sortLength === l) break
  }
  result.value = arr
  count.value = x
}
</script>