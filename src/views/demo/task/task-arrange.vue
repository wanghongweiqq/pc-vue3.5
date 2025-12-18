<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-04-10 16:49:57
 * @Description: 任务安排，支持链式调用
 * @FilePath: /vue3.0/src/views/demo/task/task-arrange.vue
-->
<template>
  <div class="pg-task">
    <div class="content">
      <h2>任务安排：支持链式调用、延迟执行</h2>
      <p>链式调用需要每次执行相应的方法后要返回this，this指向当前实例，就是闭包函数里返回的对象</p>
      <p>链式调用的方法需要使用函数声明的形式，不要使用箭头函数，会使实例失去可链性，因为箭头函数的this是undefined，不是当前实例，不具有可链性</p>
      <p>
        <el-button
          size="small"
          type="primary"
          @click="taskArrangeStart"
        >
          添加任务并执行
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="taskArrangeIns1.pause()"
        >
          暂停
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="taskArrangeGoOn"
        >
          继续执行
        </el-button>
      </p>

      <pre>
function taskArrange (name) {
  let tasks = []
  let isPaused = false

  const init = () => {
    console.log(`${ name } 开始执行任务！`)
    return 'init'
  }
  tasks.push(init)
  
  function creatTask (name,time = 0) {
    console.log('tasks',tasks)
    return() => {
      return new Promise((resolve) => {
        console.log(`“${ name }” 开始，需耗时 ${ time } 秒`)
        setTimeout(() => {
          console.log(`“${ name }” 结束，共耗时 ${ time } 秒`)
          const res = { name,time }
          resolve(res)
        },time * 1000)
      })
    }
  }

  function wait (time) {
    tasks.push(creatTask('等待',time))
    return this
  }

  function firstWait (time) {
    tasks.unshift(creatTask('最先等待',time))
    return this
  }

  function action (name,time = 1) {
    tasks.push(creatTask(name,time))
    return this
  }  

  function firstAction (name,time = 1) {
    tasks.unshift(creatTask(`最先${ name }`,time))
    return this
  }

  function execute () {
    (async () => {
      // 数组动态改变时最好使用while，这样逻辑更容易书写
      while(tasks.length > 0 && !isPaused) {
        const task = tasks.shift()
        // eslint-disable-next-line no-await-in-loop
        const result = await task() // 将执行完的任务从任务列表中移除
        console.log('任务执行完的返回结果：',result)
      }
    })()
    return this
  }

  function pause () {
    isPaused = true
    return this
  }

  function play () {
    isPaused = false
    execute()
    return this
  }

  return {
    wait,
    action,
    firstWait,
    firstAction,
    pause,
    play,
  }
}
export default taskArrange
</pre>
    </div>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import { onMounted, reactive,ref } from 'vue'
import taskArrange from './task-arrange.js'

let taskArrangeIns1 = reactive({})// 链式任务调用的实例

// 链式任务调用
const taskArrangeInit = () => {
  taskArrangeIns1 = taskArrange('王宏伟')
}

const taskArrangeStart = () => {
  taskArrangeIns1.action('学习',4).wait(5).firstAction('眼保健操',4).action('跳绳').play()
}

const taskArrangeGoOn = () => {
  taskArrangeIns1.firstWait(2).action('跳舞',4).play()
}

onMounted(() => {
  taskArrangeInit() // 链式任务初始话
})

</script>
