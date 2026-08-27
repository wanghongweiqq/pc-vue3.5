<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-04-10 16:49:57
 * @Description: 交互队列、延时队列
 * @FilePath: /pc-vue3.5/src/views/demo/duyi/queue-order.vue
-->
<template>
  <div class="content">
    <h2>队列执行优先级：交互队列高于延时队列</h2>
    <h4>示例</h4>
    <div class="box">
      <p>点击“开始”按钮后会触发“执行延时任务”，在4秒内再点击按钮触发“执行交互任务”或者“普通交互任务”，发现会先执行交互任务，再执行setTimeout的延迟任务。</p>
      <p>虽然延迟队列里有先添加的任务，交互队列的任务是后添加的，但同步任务执行完后，渲染主线程认为交互队列的优先级更高（哪怕其任务是后添加），所以优先执行交互队列里的任务。</p>
      <p>
        <el-button
          size="small"
          type="primary"
          @click="begin"
        >
          开始
        </el-button>
        <el-button
          id="interaction"
          ref="interaction"
          size="small"
          type="primary"
        >
          执行交互任务
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="normalInteraction"
        >
          普通交互任务
        </el-button>
      </p>
    </div>

    <h4>代码</h4>
    <pre>{{ `// clickFun如何定义在方法funcInteraction内部，每次调用 funcInteraction，clickFun 都是一个全新的函数引用​，永远删不掉上一次绑定的监听，因为函数不是同一个。所以clickFun要定义在外边。
const clickFun = () => {
  console.log('执行交互任务')
}
  
function funcInteraction () {
  console.log('添加交互任务')
  // const interaction = document.getElementById('interaction')
  const realEl = document.querySelector('#interaction') // 这个id直接生成在了真是dom上，所以可以直接使用querySelector获取到，但要注意获取时机，必须在组件挂载完成后获取，否则获取不到

  // 以下使用的useTemplateRef获取的是组件实例的DOM元素，不是原生DOM元素，所以需要判断是否是组件实例
  // let realEl = null
  // const interactionRefEl = interactionRef.value

  // 判断：是组件实例 还是原生DOM
  // if(interactionRefEl?.$el) {
  //   realEl = interactionRefEl.$el // 统一获取 组件（el-button等）的 真实 DOM 元素实例
  // } else if(interactionRefEl instanceof HTMLElement) {
  //   realEl = interactionRefEl
  // }

  if (!realEl) return

  // 每执行一次funcInteraction，就会添加一次监听事件，导致监听重复，所以需要先删除之前的监听事件
  // realEl.removeEventListener('click',clickFun) 
  realEl.addEventListener('click',clickFun)

  // 直接使用onclick方法不会因为funcInteraction的重复执行而导致重复触发点击事件，因为onclick 只能绑定一个函数，后赋值的会直接覆盖前一个
  // interaction.onclick = () => {
  //   console.log('执行交互任务')
  // }
  delay(2000)
}

function funcDelay () {
  console.log('添加延时任务')
  setTimeout(() => {
    console.log('执行延时任务')
  },500)// 500毫秒后添加到延时队列，此时funcDelay都没有执行完呢，因为它后面做了2秒的delay
  delay(2000)
}

function begin () {
  funcDelay()
  funcInteraction()
  console.log('同步任务执行完，后续开始执行异步任务：延时任务、交互任务')
}

function normalInteraction () {
  console.log('执行普通交互任务')
}
` }}</pre>
  </div>
</template>
<script setup>
import { useTemplateRef ,onUnmounted } from 'vue'
import utils from '@/assets/js/utils'
const { delay } = utils
const interactionRef = useTemplateRef('interaction')
let realEl = null
// clickFun如何定义在方法funcInteraction内部，每次调用 funcInteraction，clickFun 都是一个全新的函数引用​，永远删不掉上一次绑定的监听，因为函数不是同一个。所以clickFun要定义在外边。
const clickFun = () => {
  console.log('执行交互任务', Date.now())
  setTimeout(() => {
    console.log('执行交互任务后的延时任务')
  },2000)
}
  
function funcInteraction () {
  console.log('添加交互任务')
  // const interaction = document.getElementById('interaction')
  realEl = document.querySelector('#interaction') // 这个id直接生成在了真是dom上，所以可以直接使用querySelector获取到

  // 以下使用的useTemplateRef获取的是组件实例的DOM元素，不是原生DOM元素，所以需要判断是否是组件实例
  // let realEl = null
  // const interactionRefEl = interactionRef.value

  // 判断：是组件实例 还是原生DOM
  // if(interactionRefEl?.$el) {
  //   realEl = interactionRefEl.$el // 统一获取 组件（el-button等）的 真实 DOM 元素实例
  // } else if(interactionRefEl instanceof HTMLElement) {
  //   realEl = interactionRefEl
  // }

  if (!realEl) return

  // 每执行一次funcInteraction，就会添加一次监听事件，导致监听重复，所以需要先删除之前的监听事件
  realEl.removeEventListener('click',clickFun) 
  realEl.addEventListener('click',clickFun)

  // 直接使用onclick方法不会因为funcInteraction的重复执行而导致重复触发点击事件
  // interaction.onclick = () => {
  //   console.log('执行交互队列2')
  // }
  delay(2000)
}

function funcDelay () {
  console.log('添加延时任务')
  setTimeout(() => {
    console.log('执行延时任务')
  },500)// 500毫秒后添加到延时队列，此时funcDelay都没有执行完呢，因为它后面做了2秒的delay
  delay(2000)
}

function begin () {
  funcDelay()
  funcInteraction()
  console.log('同步任务执行完，后续开始执行异步任务：延时任务、交互任务')
}

function normalInteraction () {
  console.log('执行普通交互任务')
}

onUnmounted(() => {
  console.log('组件卸载时，移除交互任务的监听事件')
  // 监听的点击事件被移除了，但clickFun内的延时任务还会继续执行，需要手动清除
  realEl && realEl.removeEventListener('click',clickFun) 
})

</script>
