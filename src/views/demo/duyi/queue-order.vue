<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-04-10 16:49:57
 * @Description: 交互队列、延时队列
 * @FilePath: /vue3.0/src/views/demo/duyi/queue-order.vue
-->
<template>
  <div class="content">
    <h2>交互队列、延时队列</h2>
    <p>点击开始后会触发“执行延时队列”，在4秒内再点击按钮触发“执行交互队列”，发现会先执行点击按钮的交互队列，再执行setTimeout的延迟队列</p>
    <p>
      <el-button
        size="small"
        type="primary"
        @click="begin"
      >
        开始
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="funcInteraction1"
      >
        执行交互队列1
      </el-button>
      <el-button
        id="interaction"
        size="small"
        type="primary"
      >
        执行交互队列2
      </el-button>
    </p>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
function delay (duration) {
  let start = Date.now()
  while(Date.now() - start < duration) {}
}
function funcInteraction () {
  console.log('添加交互队列')
  // const interaction = document.getElementById('interaction')
  const interaction = document.querySelector('#interaction')
  // interaction.addEventListener('click',() => {
  //   console.log('执行交互队列')
  // })
  interaction.onclick = () => {
    console.log('执行交互队列2')
  }
  delay(2000)
}
function funcInteraction1 () {
  console.log('执行交互队列1')
}
function funcDelay () {
  console.log('添加延时队列')
  setTimeout(() => {
    console.log('执行延时队列')
  },500)// 500毫秒后添加到延时队列，此时funcDelay都没有执行完呢，因为它后面做了2秒的delay
  delay(2000)
}
function begin () {
  funcDelay()
  funcInteraction()
  console.log('同步任务执行完，后续开始执行异步任务：延时队列、交互队列')
}
</script>
