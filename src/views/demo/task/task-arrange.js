/*
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-07-31 13:49:58
 * @Description: 任务安排：支持链式调用、延迟执行
 * @FilePath: /vue3.0/src/views/demo/task/task-arrange.js
 */
function taskArrange (name) {
  let tasks = []
  let isPaused = false
  // console.log(`${ name } 安排任务开始！`)

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
  // return 定义的方法不要使用箭头函数，会使实例失去可链性，这里的this是：undefined
  // const wait = (time) => {
  //   tasks.push(creatTask('等待',time))
  //   console.log('this',this)
  //   return this
  // }

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

  // this 返回失效，使实例失去可链性
  // async function execute () {
  //   console.log('execute') 
  //   isPaused = false
  //   for(const item of tasks) {
  //     // console.log('for-tasks',item)
  //     if(!isPaused) {
  //       const result = await item()
  //       console.log('任务执行完的返回结果：',result)
  //     }
  //   }
  //   return this
  // }  
  function execute () {
    (async () => {
      // 数组动态改变时最好使用while，这样逻辑更容易书写
      while(tasks.length > 0 && !isPaused) {
        const task = tasks.shift()
        // eslint-disable-next-line no-await-in-loop
        const result = await task() // 将执行完的任务从任务列表中移除
        console.log('任务执行完的返回结果：',result)
      }
      // for循环的话，操作数据后，循环项可能被遗漏或重复执行，视使用的操作方法而定，如shift/push等
      // 这里如果只执行循环，而不移除执行的任务，将导致再次执行时，已执行的任务重复执行
      // for(const item of tasks) { 
      //   if(!isPaused) {
      //     const result = await item()
      //     console.log('任务执行完的返回结果：',result)
      //   }
      // }
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