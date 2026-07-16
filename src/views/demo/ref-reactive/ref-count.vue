<template>
  <div class="content">
    <h2>ref基本数据类型：count</h2>
    <p>script setup 中的普通代码只会在组件<em>初始化时执行一次</em>；触发页面事件（如点击）时，只会调用 相应的方法，然后render 函数重新渲染 template，不会从上到下将 setup 内的所有代码重新执行一遍。</p>
    <p>{{ count }}</p>
    <p>
      <el-button
        size="small"
        type="primary"
        @click="countAdd"
      >
        +1
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="countSubtract"
      >
        -1
      </el-button>
    </p>
    <pre>{{ `// watch的完整形态，第一个是要监听的数据，第二个是一个方法，可以比较前后的数据，第三个是配置的对象
watch(
  count,
  (newVal,oldVal) => {
    console.log('watch-count')
    console.log('newVal:', newVal)
    console.log('oldVal:', oldVal)
  },
  {
    immediate: true, // 默认false
    deep: true, // 默认：对象=true,数组=false
  }
)` }}</pre>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

console.log('ref-count中的普通js')
const count = ref(0)
const countAdd = () => {
  count.value++
  console.log('点击事件count+1，count的value值立即更新。','count.value:',count.value,';  count:',count)
}
const countSubtract = () => count.value--
watch(
  count,
  (newVal,oldVal) => {
    console.log('watch-count')
    console.log('newVal:', newVal)
    console.log('oldVal:', oldVal)
  },
  {
    immediate: true, // 默认false
    deep: true, // 默认false
  }
)
</script>
