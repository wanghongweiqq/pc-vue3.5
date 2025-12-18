<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2021-11-29 22:37:47
 * @LastEditTime: 2025-07-31 16:56:10
 * @LastEditors: Please set LastEditors
 * @Description: 时间循环：Event Loop
 * @FilePath: /vue3.0/src/views/demo/event-loop.vue
-->
<template>
  <div class="pg-func">
    <div class="ly-box">
      <cp-crumbs />
    
      <div class="content">
        <h1>Event Loop</h1>
        <h2>同步任务和异步任务</h2>
        <p>JavaScript是一门单线程执行的语言，在同一个时间只能做一件事情。这是因为它运行在浏览器的渲染主线程中，而渲染主线程只有一个。这就导致后面的任务需要等到前面的任务完成才能执行，如果前面的任务很耗时就会造成后面的任务一直等待。为了解决这个问题JS中出现了同步任务和异步任务。</p>

        <h3>（1）同步任务</h3>
        <p>在主线程上排队执行的任务只有前一个任务执行完毕，才能执行后一个任务，形成一个执行栈。执行栈管理同步任务</p>
        <h3>（2）异步任务</h3>
        <p>不进入主线程，而是进入任务队列，当主线程中的任务执行完毕，就从任务队列中取出任务放进主线程中来进行执行。由于主线程不断重复的获得任务、执行任务、再获取再执行，所以者种机制被叫做事件循环（Event Loop）.任务队列管理异步任务</p>

        <h2>异步任务分为：宏任务和微任务</h2>
        <h2>宏任务</h2>
        <p>macrotask 称为 Task，宏任务是由宿主（浏览器、Node）发起的，可以理解是每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）。</p>
        <h3>宏任务包含：</h3>
        <pre>
            script(整体代码) 
            setTimeout
            setInterval
            I/O
            UI交互事件
            postMessage
            MessageChannel
            setImmediate(Node.js 环境)
          </pre>
        <p>PS：script(整体代码) 实际上如果同时存在两个 script 代码块，会首先在执行第一个 script 代码块中的同步代码，如果这个过程中创建了微任务并进入了微任务队列，第一个 script 同步代码执行完之后，会首先去清空微任务队列，再去开启第二个 script 代码块的执行。所以这里应该就可以理解 script（整体代码块）为什么会是宏任务。</p>
        <h2>微任务</h2>
        <p>microtask 称为 Jobs,，微任务由 JS 自身发起，可以理解是在当前 task 执行结束后立即执行的任务。也就是说，在当前task任务后，下一个task之前，在渲染之前。</p>
        <p>所以它的响应速度相比setTimeout（setTimeout是task）会更快，因为无需等渲染。也就是说，在某一个macrotask执行完后，就会将在它执行期间产生的所有microtask都执行完毕（在渲染前）。</p>
        <h3>微任务包含：</h3>
        <pre>
            Promise.then/catch/finally
            async/await
            Object.observe
            MutationObserver
            process.nextTick(Node.js 环境)
          </pre>
        <p> PS：async/await</p>
        <p>ECMAScript2017中添加了async functions和await。 </p>
        <p>async关键字是将一个同步函数变成一个异步函数，并将返回值变为promise。</p>
        <p>而await可以放在任何异步的、基于promise的函数之前。在执行过程中，它会暂停代码在该行上，直到promise完成，然后返回结果值。而在暂停的同时，其他正在等待执行的代码就有机会执行了。</p>
        <p>await后面的函数执行完毕时，await会产生一个微任务(Promise.then是微任务)。但是我们要注意这个微任务产生的时机，它是执行完await之后，直接跳出async函数，执行其他代码(此处就是协程的运作，A暂停执行，控制权交给B)。其他代码执行完毕后，再回到async函数去执行剩下的代码，然后把await后面的代码注册到微任务队列当中。</p>
        <p>await function XXX()，执行顺序如下：先把XXX里的同步执行完，然后会跳出async方法，执行接下来的同步任务，XXX里的异步如promise.then会被添加到微任务队列，执行完这个微任务后会把await方法后面的任务继续添加进微任务队列，并执行这个微任务队列直到清空该队列</p>
        <p>Promise方法体里的逻辑会当做同步任务立即执行，之后的.then/catch/finally会被添加到微任务队列，then等链式的时候，是一个一个依次添加到微任务队列的，即执行完前面一个待执行下一个的时候才将下一个添加到微任务队列。</p>

        <h2>在事件循环中，每进行一次循环操作称为 tick，每一次 tick 的任务处理模型是比较复杂的，但关键步骤如下：</h2>
        <p>1、执行一个宏任务（栈中没有就从事件队列中获取）</p>
        <p>2、执行过程中如果遇到微任务，就将它添加到微任务的任务队列中</p>
        <p>3、宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）</p>
        <p>4、当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染</p>
        <p>5、渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取）</p>
      </div>
    </div>
  </div>
</template>
<script>
import CpCrumbs from '@/components/crumbs/'

export default {
  components: {
    CpCrumbs,
  },
  data () {
    return{
    }
  },
  mounted () {
    const request = { body: { username: 'username',password: 'password' } }
    const { body, body: { username, password } } = request
    // console.log(body,username,password)
    this.task0()
    // this.task1()
    // this.task1_2()
    // this.task2()
    // this.task3() // 原文链接：https://www.jianshu.com/p/fd15db94a034
    // this.task4() 
    // this.task5() 
    // this.task6() 
    // this.task7() 
  },
  methods: {
    // 简单版
    task0 () {
      console.log('script start') // 1
      // async2这个异步方法其实虚有其名，可以当做一个普通方法理解，因为内部并没有像Promise这样的异步返回，只定义了一个setTimeout的宏任务
      function async2 () { 
        // setTimeout(() => {
        //   console.log('async2 end') // 7
        // },0)
        return new Promise(resolve => {
          resolve('very good!')
        })
      }
      async function async1 () {
        const result = await async2()// await后面的代码不会立即执行，待async2返回值后，会作为微任务添加到微任务队列
        console.log('async1 end',result) // 4
      }
      async1()

      setTimeout(function () {
        console.log('setTimeout') // 8
      }, 0)

      new Promise(resolve => {
        console.log('Promise') // 2
        resolve()
      }).then(function () {
        console.log('promise1') // 5
      }).then(function () {
        console.log('promise2')// 6
      })

      console.log('script end') // 3
    },
    
    // 复杂版
    task1 () {
      console.log('script start') // 1

      const asy2 = async () => {
        console.log('asy2-start') // 3
        // await 12 和Promise.resolve(12)是等价的，前者时会自动添加Promise.resolve(xx)，使其变为异步任务
        const num = 12
        // await num
        const res = await Promise.resolve(num)
        console.log('asy2-await-finished',res) // 6
        setTimeout(() => {
          Promise.resolve().then(() => {
            console.log('asy2-setTimeout-promise-then') // 12
          })
          console.log('asy2-setTimeout') // 11
        }, 0)
        console.log('asy2-end') // 7
        return num

      }
      async function asy1 () {
        console.log('asy1-start') // 2
        const asy1Result = await asy2()
        console.log('asy1-end',asy1Result) // 9
      }

      const asy3 = async () => {
        console.log('asy3-start') // 4
        await Promise.resolve().then(() => {
          console.log('asy3-promise-then') // 8
        })
        console.log('asy3-end') // 10
      }

      asy1()
      asy3()

      console.log('script end') // 5
    },

    task1_2 () {
      console.log('script start') // 1

      const asy2 = async () => {
        const b = await new Promise((resolve) => {
          console.log('asy2-Promise') // 3
          setTimeout(() => { // 唯一的一个宏任务，等该任务执行完才执行b = await 下面的console.log(4)
            console.log(3) // 7
            resolve(100)
          }, 0)
        })
        console.log(4) // 8
        return b
      }
      async function asy1 () {
        console.log(1) // 2
        const c = await asy2()
        console.log(2,'c',c) // 9
      }

      const asy3 = async () => {
        console.log('a0') // 4
        await Promise.resolve().then(() => { // 宏任务出现后的第一个微任务，执行完一个又添加一个then,直到全部执行完
          console.log('a1') // 6_1
        }).then(() => {
          console.log('a2') // 6_2
        }).then(() => {
          console.log('a3') // 6_3
        })
      }

      asy1()
      asy3()

      console.log('script end') // 5
    },

    task2 () {
      console.log('script start') // 1

      async function async2 () {
        console.log('async2 start') // 3
        function study () {
          return new Promise(resolve => {
            console.log('study-start') // 4
            resolve('very good!')
          }).then((res) => {
            console.log('study-result: ',res) // 7
            return(res)
          })
        }
        let resultAsync1 = await study()
        console.log('async2  end. resultAsync1=',resultAsync1) // 9
        return resultAsync1
      }

      async function async1 () {
        console.log('async1 start') // 2
        let resultAsync2 = await async2()
        console.log('async1 end. resultAsync2=',resultAsync2) // 11
      }
      async1()

      setTimeout(function () {
        console.log('setTimeout') // 12
      }, 0)

      new Promise(resolve => {
        console.log('Promise') // 5
        resolve()
      }).then(function () {
        console.log('promise1') // 8
      }).then(function () {
        console.log('promise2') // 10
      })

      console.log('script end') // 6
    },

    task3 () {
      // 整体输出： d a c1 c2 g i c3 2 h b f 3 e

      // 第1遍事件循环

      // 执行代码块function task3（可以理解为宏任务队列的第1个任务）的同步任务，具体如下：
      // console.log('d') 输出：d  紧接着宏任务队列添加第1个任务：setTimeout
      // async1()中的同步任务， 输出：a c1 c2，此时微任务队列添加第1个任务：function async2.then
      // new Promise 输出：g，此时微任务队列添加第2个任务：new Promis.then
      // console.log('i') 输出：i

      // 此时代码块宏任务执行完毕后，开始清空微任务队列，具体如下： 
      // 1 function async2.then，输出：c3 2; 此时微任务队列添加第3个任务(其实此时是第2个，因为第1个已执行完)：async function async1中await后的代码
      // 2 new Promis.then，输出：h;
      // 3 async function async1中await后的代码，输出：b; 此时微任务队列添加第4个任务(其实此时是第1个，因为第1、2、3个已执行完)：async1().then
      // 4 async1().then，输出：f 3

      // 第2遍事件循环
      // setTimeout的任务，输出：e

      async function async1 () {
        console.log('a')// 2
        // eslint-disable-next-line no-use-before-define
        const res = await async2()// await会阻塞async2的返回值，先跳出async1进行往下执行（需要注意的是，现在async1中的res变量，还是undefined，没有赋值。 res是在清空微任务队列时赋值并执行后面程序。）
        console.log('b')// 10
        return res
      }

      function async2 () {
        console.log('c1') // 3
        return new Promise((resolve) => {
          console.log('c2') // 4
          resolve(2)
        }).then((x) => { 
          console.log('c3') // 7
          console.log(x)// 8
          return x + 1
        }) 
      } 

      console.log('d') // 1

      setTimeout(() => {
        console.log('e') // 13
      }, 0)

      async1().then(res => {
        console.log('f') // 11
        console.log(res) // 12
      })
      
      new Promise((resolve) => {
        console.log('g') // 5
        resolve()
      }).then(() => {
        console.log('h') // 9
      })

      console.log('i')// 6
    },
    
    // 宏任务队列
    task4 () {
      console.log('script start')      
      const num = 100
      setTimeout(() => { console.log('定时器2s') }, 2000) 
      setTimeout(() => { console.log('定时器1s') }, 1000) 
      console.log('我是中间的')      
      for (let i = 0; i < num; i++) { 
        console.log(`打印循环${ num }次: ${ i }`) 
        // setTimeout(() => { console.log(`打印循环${ num }次: ${ i }`) },i * 1000) 
      }
      console.log('script end')      
    },

    // 奇葩的 return Promise.resolve
    task5 () {
      console.log('script start') // 0
      Promise.resolve()
        .then(() => {
          console.log(0) // 4
          // return 2 + 2

          // 以下两种方式等效，相当于两次添加到微任务队列，一次pending，一次吸收
          // 方式1
          return Promise.resolve(4)

          // 方式2
          // return new Promise((resolve) => {
          //   console.log('change-resolve') 
          //   resolve(4)
          // })
          //   .then((x) => { 
          //     console.log('change-then') 
          //     return x 
          //   }) 
        })
        .then((res) => {
          console.log(res) // 11
        })

      Promise.resolve()
        .then(() => {
          console.log(1) // 5
        })
        .then(() => {
          console.log(2) // 7
        })
        .then(() => {
          console.log(3) // 9
        })
        .then(() => {
          console.log(5) // 12
        })
        .then(() => {
          console.log(6) // 13
        })

      new Promise(resolve => {
        console.log('resolve') // 1
        resolve()
      })
        .then(function () {
          console.log('then1') // 6
        })
        .then(function () {
          console.log('then2')// 8
        })
        .then(function () {
          console.log('then3')// 10
        })
      console.log('script end') // 2   
    },

    // 首先1秒时绿灯亮一次，之后2秒时黄灯亮一次；再之后3秒时红灯亮一次，如何让三个灯不断交替重复前面的亮灯？三个亮灯函数已经存在：
    // 以下用了三种方式实现，分别为：1、Promise 2、async/await 3、setInterval 
    task6 () {
      function green () {
        console.log('green')
      }
      function yellow () {
        console.log('yellow')
      }
      function red () {
        console.log('red')
      }

      const light = function (timmer, cb) {
        return new Promise( resolve => {
          setTimeout( () => {
            resolve()
            cb()
          }, timmer)
        })
      }

      console.log('script-start')
      function step1 () {
        Promise.resolve().then(() => {
          console.log(1)
          return light(1000, green)
        }).then(() => {
          console.log(2)
          return light(2000, yellow)
        }).then(() => {
          console.log(3)
          return light(3000, red)
        }).then(() => {
          step1()
        })
      }
      // step1()

      async function step2 () {
        await light(1000, green)
        await light(2000, yellow)
        await light(3000, red)
        step2()
      }
      // step2()

      function cell () {
        light(1000, green)
        light(3000, yellow)
        light(6000, red)
      }
      function step3 () {
        cell()
        setInterval(() => {
          cell()
        },6000)
      }
      step3()
      console.log('script-end')

    },
    
    // then方法接受的参数是函数，而如果传递的并非是一个函数，它实际上会将其解释为then(null)，这就会导致前一个Promise的结果会传递下面。
    task7 () {
      Promise.resolve(1)
        .then(console.log) // 1
        .then((res) => {
          console.log('res1',res) // res1 undefined，上面的console.log是一个方法，但没有返回值，所以这里为undefined
          return 2
        })
        .then(3)
        .then('3')
        .then((res) => {
          console.log('res2',res) // res2 2，上面的3不是一个方法，所以返回上一个合法then的结果
          // return res
          return Promise.resolve(4)
        })
        .then(Promise.resolve(5))
        .then(console.log) // 4，上面的Promise.resolve(5)不是一个方法，所以返回上一个合法then的结果
    }

  }
}
</script>
