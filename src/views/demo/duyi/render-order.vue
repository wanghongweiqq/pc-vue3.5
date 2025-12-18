<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-04-10 16:49:57
 * @Description: 渲染顺序
 * @FilePath: /vue3.0/src/views/demo/duyi/render-order.vue
-->
<template>
  <div class="content">
    <h2>渲染顺序</h2>
    <p>微队列和延时队列对渲染的影响，在vue组件中：微队列会清空后执行一次渲染，而延时队列执行一个渲染一次。在脱离vue组建的html页面中，通过MutationObserver观察得到，微队列的每个任务都会被渲染一次，不知道这种形式得出的结论准不准。</p>
    <p>{{ textContent }}</p>
    <p>
      <el-button
        size="small"
        type="primary"
        @click="begin"
      >
        开始
      </el-button>
    </p>
    <p>{{ renderOnce() }}</p>
    <p>{{ textContentComputed }}</p>
  </div>
</template>

<!-- eslint-disable no-unused-vars -->
<script setup>
import {
  ref, 
  computed
} from 'vue'

let textContent = ref('渲染的文字，点击开始按钮四秒后开始变化')
let textContent1 = ref('计算属性只有其关联的data变化才会重新计算')

// 计算属性
const textContentComputed = computed(() => {
  console.log('计算属性只有其关联的data变化才会重新计算。不会像方法那样每次模版render都会重新执行')
  return `计算属性得来：${ textContent1.value }`
})

function delay (duration) {
  let start = Date.now()
  while(Date.now() - start < duration) {}
}

function renderOnce () {
  console.log('页面渲染一次！')
  return ''
}
function begin () {
  setTimeout(() => {
    textContent.value = '0'
    console.log('第1个setTimeout：0',Date.now())
  },0)
  new Promise(resolve => {
    resolve('1')
  }).then((res) => {
    setTimeout(() => {
      textContent.value = '333'
      console.log('第2个setTimeout：333',Date.now())
    },1000)
    textContent.value = res
    console.log('第1个Promise：' + res,Date.now())
  })
  delay(2000)
  new Promise(resolve => {
    resolve('22')
  }).then((res) => {
    setTimeout(() => {
      textContent.value = '4444'
      console.log('第3个setTimeout：4444',Date.now())
    },1000)
    textContent.value = res
    console.log('第2个Promise：' + res,Date.now())
  })
  delay(2000)
  console.log('end')
}

</script>
