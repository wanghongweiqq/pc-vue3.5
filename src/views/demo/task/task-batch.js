/* eslint-disable no-await-in-loop */
/*
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-07-31 13:49:58
 * @Description: 批量处理任务，支持同时最多处理max个异步任务，最后执行完play().then()返回相应结果
 * @FilePath: /vue3.0/src/views/demo/task/task-batch.js
 */
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