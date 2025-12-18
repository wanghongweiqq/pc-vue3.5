<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-04-10 16:49:57
 * @Description: 任务安排，支持链式调用
 * @FilePath: /vue3.0/src/views/demo/task/task-batch.vue
-->
<template>
  <div class="bcp-task-arrange">
    <div class="content">
      <h2>批量处理任务，支持同时最多处理N个异步任务</h2>
      <p>
        <el-button
          size="small"
          type="primary"
          @click="taskBatchAdd"
        >
          添加任务并不执行
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="taskBatchStart"
        >
          执行
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="taskBatchIns1.pause()"
        >
          暂停
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="taskBatchIns1.setNum(4)"
        >
          修改数量
        </el-button>
      </p>
      <pre>
function taskBatch () {
  console.log('this',this)
  let max = 2// 允许运行的最大任务数
  let doingQueue = [] // 在运行队列中的任务
  let remainQueue = [] // 在等候队列中的任务
  let result = []// 任务运行后的结果
  let isPaused = false // 是否处于暂停状态
  let doingNum = 0 // 正处于运行状态下的任务的个数,它并不是doingQueue的长度，因为doingQueue队列添加一个任务后长度加1，然后执行execute，会立刻又减少一个长度，而这时doingNum并没有减少，因为这个任务还没有执行完

  // 计算任务，将任务分配到不同的队列
  function computedTasks (list) {
    if(list && list.length > 0) {
      remainQueue = remainQueue.concat(list)
    }
    let doingQueueCanAddNum = max - doingNum
    console.log('doingQueueCanAddNum',doingQueueCanAddNum) 
    if(doingQueueCanAddNum > 0) {
      doingQueue = doingQueue.concat(remainQueue.splice(0,doingQueueCanAddNum))
      doingNum = doingQueue.length
    }
  }

  function pause () {
    isPaused = true
    return this
  }

  function play () {
    isPaused = false
    return new Promise( (resolve) => {
      const execute = () => {
        console.log('execute')
        while(doingQueue.length > 0 && !isPaused) {
          const task = doingQueue.shift()
          // doingNum++
          console.log('while',doingNum,doingNum)
          task().then((res) => {
            console.log('res', res)
            doingNum--
            result.push(res)
            if(remainQueue.length > 0) {
              const willAddTask = remainQueue.shift()
              doingQueue.push(willAddTask)
              doingNum++
              // 暂停后添加，这里不做加法，会导致计算的doingNum不准，偏小，computedTasks后就会导致数量doingQueue偏大，就是说添加超了
              return execute()
            }
            console.log('doingNum11', doingNum)
            if(doingNum === 0) {
              resolve(result)
            }
          })
        }
      }
      execute()
    })
  }

  // play() //方法第一个参数是任务列表的话，初始话时就默认paly的话，会导致拿不到任务执行完的结果，因为初始话后返回的是taskBatch定义的return，是一个含有暂停、启动等相应方法的对象
  function add (list) {
    computedTasks(list)
    return this
  }

  function setNum (num) {
    if(Number.isInteger(num) && num > 0) {
      max = num
    }else{
      return console.log('设置同时运行个数有误，请设置为正整数！')
    }
    computedTasks()
    return this
  }

  return {
    pause,
    play,
    add,
    setNum
  }
}
export default taskBatch
</pre>
    </div>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import { onMounted, reactive } from 'vue'
import taskBatch from './task-batch.js'

let taskBatchIns1 = reactive({})// 批量任务调用的实例

const tasks = [
  { name: '语文',time: 2 },
  { name: '数学',time: 5 },
  { name: '英语',time: 2 },
  { name: '课间操',time: 5 },
  { name: '物理',time: 1 },
  { name: '化学',time: 1 },
]

// 任务生成器
function creatTask (name,time = 0) {
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

// 批量任务调用
const taskBatchInit = () => {
  taskBatchIns1 = taskBatch()
  // console.log('taskBatchIns1',taskBatchIns1)
}

// 批量任务添加
const taskBatchAdd = () => {
  const taskList1 = Array.from({ length: tasks.length },(_,index) => {
    const { name,time } = tasks[index]
    return creatTask(name,time)
  })
  taskBatchIns1.add(taskList1)
}

// 批量任务执行
const taskBatchStart = () => {
  taskBatchIns1.play().then(val => { console.log('最终结果：',val) })
}
onMounted(() => {
  taskBatchInit() // 批量任务初始话
})

</script>
