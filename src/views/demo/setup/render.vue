<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-14 16:23:50
 * @Description: render 函数
 * @FilePath: /pc-vue3.5/src/views/demo/setup/render.vue
-->
<template>
  <div class="content">
    <p>script setup 中的普通代码只会在组件<em>初始化时执行一次</em>；触发页面事件（如点击）时，只会调用相应的方法，然后render 函数重新渲染template，不会从上到下将setup内的所有代码重新执行一遍。</p>
    <p>React中的render函数也会在每次状态更新时重新调用。</p>
    <p>调用次数：{{ count }}</p>
    <p>
      <el-button
        size="small"
        type="primary"
        @click="run"
      >
        调用方法
      </el-button>
    </p>
  </div>
</template>
<script setup>
import { ref } from 'vue'

console.log('setup 中的普通js代码只会在组件初始化时执行一次')

const count = ref(0)

const run = () => {
  count.value++
}
</script>