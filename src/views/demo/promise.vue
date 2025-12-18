<template>
  <div class="pg-func">
    <div class="ly-box">
      <cp-crumbs />
      <div class="content">
        <h1>promise</h1>
        <h2>promise是什么？</h2>
        <p>1、主要用于异步计算</p>
        <p>2、可以将异步操作队列化，按照期望的顺序执行，返回符合预期的结果</p>
        <p>3、可以在对象之间传递和操作promise，帮助我们处理队列</p>

        <h2>异步操作的常见语法</h2>
        <p>1、事件监听</p>
        <pre>
document.getElementById('#start').addEventListener('click', start, false);
function start() {
  // 响应事件，进行相应的操作
}
// jquery on 监听
$('#start').on('click', start)
          </pre>
        <p>2、回调</p>
        <pre>
// 比较常见的有ajax
$.ajax('http://www.wyunfei.com/', {
 success (res) {
   // 这里可以监听res返回的数据做回调逻辑的处理
 }
})

// 或者在页面加载完毕后回调
$(function() {
 // 页面结构加载完成，做回调逻辑处理
})
          </pre>
        <h2>异步操作的常见问题</h2>
        <ul>
          <li>1、之前处理异步是通过纯粹的回调函数的形式进行处理</li>
          <li>2、很容易进入到回调地狱中，嵌套层次深，不好维护，剥夺了函数return的能力</li>
          <li>3、问题可以解决，但是难以读懂，维护困难</li>
        </ul>
        <h2>promise详解</h2>
        <pre>
new Promise(function (resolve, reject) {
  // 一段耗时的异步操作
  resolve('成功') // 数据处理完成
  // reject('失败') // 数据处理出错
}).then(
  (res) => {console.log(res)},  // 成功
  (err) => {console.log(err)} // 失败
)
          </pre>
        <p>promise是一个对象，对象和函数的区别就是对象可以保存状态，函数不可以（闭包除外）</p>
        <p>并未剥夺函数return的能力，因此无需层层传递callback，进行回调获取数据</p>
        <p>代码风格，容易理解，便于维护</p>
        <p>多个异步等待合并便于解决</p>
        <h2>promise有三个状态：</h2>
        <p>1、pending[待定]初始状态</p>
        <p>2、fulfilled[实现]操作成功</p>
        <p>3、rejected[被否决]操作失败</p>

        <h2>.then()</h2>
        <p>1、接收两个函数作为参数，分别代表fulfilled（成功）和rejected（失败）</p>
        <p>2、.then()返回一个新的Promise实例，所以它可以链式调用</p>
        <p>3、当前面的Promise状态改变时，.then()根据其最终状态，选择特定的状态响应函数执行</p>
        <p>4、状态响应函数可以返回新的promise，或其他值，不返回值也可以我们可以认为它返回了一个null；</p>
        <p>5、如果返回新的promise，那么下一级.then()会在新的promise状态改变之后执行</p>
        <p>6、如果返回其他任何值，则会立即执行下一级.then()</p>

        <h2>.then()里面有.then()的情况</h2>
        <p>1、因为.then()返回的还是Promise实例</p>
        <p>2、会等里面的then()执行完，再执行外面的</p>

        <pre>
new Promise((resolve)=>{
  console.log('Step 1') //1
  setTimeout(()=>{
    resolve(100)
  },1000)
}).then((val)=>{ //val=100
  return new Promise(resolve=>{
    console.log('Step 1-1') //2
    setTimeout(()=>{
      resolve(val+10)
    },1000)
  }).then(val=>{ //val=110
    console.log('Step 1-2') //3
    return val+10
  }).then(val=>{ //val=120
    console.log('Step 1-3') //4
    return val+10
  })
}).then(val=>{ //val=130
  console.log('Step 2') //5
  console.log(val)  //6 val=130
})
          </pre>
        <p>了解了其 执行顺序后，我们最好将其展开，用链式的方式，这样会有更好的可读性</p>
        <pre>
new Promise((resolve)=>{
  console.log('Step 1') //1
  setTimeout(()=>{
    resolve(100)
  },1000)
}).then((val)=>{ //val=100
  return new Promise(resolve=>{
    console.log('Step 1-1') //2
    setTimeout(()=>{
      resolve(val+10)
    },1000)
  })
}).then(val=>{ //val=110
  console.log('Step 1-2') //3
  return val+10
}).then(val=>{ //val=120
  console.log('Step 1-3') //4
  return val+10
}).then(val=>{ //val=130
  console.log('Step 2') //5
  console.log(val)  //6 val=130
})
          </pre>

        <h2>then、catch、finally</h2>
        <p>then 、 catch 、 finally 都会返回一个新的promise， 所以可以链式调用。</p>
        <p>catch方法就是一个语法糖，只接收一个参数，onRejected处理程序。他的作用和调用Promise.prototype.then(null,onRejected)是一样的。</p>
        <p>在Promise中，返回任意一个非promise的值都会被包裹成promise对象，</p>
        <p>例如return 'hehe'会被包装为return Promise.resolve('hehe')。</p>
        <p>return 的值只会往下传给 then，无论中间是否有catch 或者 finally。</p>
        <p>finally方法没有参数</p>

        <h2>Promise的内置方法</h2>
        <p><b>Promise.all( )：</b>当有任务失败时立即catch输出失败，否则全部成功后由then输出，与Promise.any() 相反</p>
        <p><b>Promise.race( )：</b>先完成先输出,不管成功还是失败，谁先完成谁先输出，成功由then输出，失败由catch输出</p>
        <p>
          <b>Promise.allSettled( )：</b>会等所有异步任务执行完毕，获取全部子Promise的结果，不论成功还是失败，在then中返回数组格式的结果，每一个结果是一个对象，包含属性：status、value/reason，不执行catch，即使有子Promise失败
        </p>
        <p><b>Promise.any( )：</b>当成功时由then立即输出，失败时继续执行下一个。当全部任务失败时由catch输出，与Promise.all() 相反</p>
      </div>
    </div>
  </div>
</template>
<script>
import CpCrumbs from '@/components/crumbs/'
import MyPromise from './duyi/my-promise'

export default {
  components: {
    CpCrumbs,
  },
  data () {
    return{
    }
  },
  mounted () {
    // this.task5()
    // this.task()
    // this.promise_01()
    // this.promise_02()
    // this.promiseAll()
    // this.promiseAllSettled()
    // this.promiseRace()
    // this.promiseAny()
    
    // this.finally()
    // this.originalPromise()
    // this.myPromise()
    this.newArray0()
    // this.newArray()
  },
  methods: {
    newArray0 () {
      const a = new Array(3)
      a[0] = 1
      let x = 0
      const b = a.map(item => {
        x++
        return item * 10
      })
      console.log('a',a,x,a.join())
      console.log('b',b)
      const c = Array.from({ length: 3 })
      c[0] = 1
      let y = 0
      const d = c.map(item => {
        y++
        return item * 10
      })
      console.log('c',c,y,c.join())
      console.log('d',d)
    },

    newArray () {
      const a = new Array(3)
      a[0] = 1
      const b = a.map(item => item * 10)
      console.log('a',a)
      console.log('b',b)
      const c = Array.from({ length: 3 })
      c[0] = 1
      const d = c.map(item => item * 10)
      console.log('c',c)
      console.log('d',d)
    },
    task5 () {
      console.log('start')      
      Promise.resolve(0)
        .then((res) => {
          // console.log('0-0') // 1
          console.log(0) 
          // return Promise.resolve(4)
          // return 1 + 1
          new Promise((resolve) => {
            console.log('c1-1') // 4
            resolve(4)
            console.log('c1-2') // 4
          })
            .then((x) => { 
              console.log('c2') // 7
              console.log(x)// 8
              return x 
            }) 
          console.log('0-1') 
          return 'return'

        })
        .then((res) => {
          // console.log('res') // 3
          console.log(res) // 3
        })

      Promise.resolve('b')
        .then((res) => {
          console.log(1) // 2
          // console.log(res) // 2

          // return new Promise((resolve) => {
          //   console.log('d1-1') // 4
          //   resolve(4)
          //   console.log('d1-2') // 4
          // })

        })
        .then(() => {
          console.log(2) // 4
        })
        .then(() => {
          console.log(3)
        })
        .then(() => {
          console.log(5)
        })
        .then(() => {
          console.log(6)
        })
      // 微任务的队列
      // onsole.log('0')
      // onsole.log('1')
      // Promise.resolve(4).then
      // console.log(2) 

      //  Promise.resolve(4)11111
      // console.log(3) 

      // console.log(4) 
      // console.log(5) 
      // console.log(6) 
    
      //   setTimeout(() => {
      //     console.log('async2 end') // 7
      //   },0)
      new Promise(resolve => {
        console.log('Promise') // 2
        resolve()
      })
        .then(function () {
          console.log('promise1') // 5
        })
        .then(function () {
          console.log('promise2')// 6
        })
        .then(function () {
          console.log('promise3')// 6
        })
      console.log('end')      
    },

    // 单线程：宏任务、微任务
    task () {
      setTimeout(() => {
        console.log(1)
        new Promise((resolve) => {
          resolve()
        }).then(() => {
          console.log(2)
        }).finally(() => {
          console.log(5)
        })
        setTimeout(() => { console.log(0) }, 0)
      }, 0)

      setTimeout(() => {
        console.log(3)
        new Promise((resolve) => {
          resolve()
        }).then(() => {
          console.log(4)
        })
      }, 0)
      // 1 2 5 3 4 0
    },
    promise_01 () {
      new Promise((resolve, reject) => {
        var random = Math.random()
        if(random > 0.7 ) {
          resolve(`promise_01-成功:${ random }`)
        }else if(random > 0.3 ) {
          reject(`promise_01-失败:${ random }`)
          // reject(new Error(`promise_01-失败:${ random }`))
        }else{
          throw new Error(`promise_01-catch:${ random }`)
        }
      }).then((res) => { // 成功
        console.log(res)
      },(err) => { // 失败
        console.log(err)
        return 1
      }).catch((res) => { // 上面失败时不会执行此处的catch，因为被then的第二个参数执行了相关的error，取消第二个参数后reject和throw的错误会执行catch方法
        console.log(res)
      })
    },
    promise_02 () {
      new Promise((resolve) => {
        var random = Math.random()
        if(random > 0.5 ) {
          resolve(`promise_02-成功:${ random }`)
        }else{
          // 失败时，还可以throw new xxxx，必须使用throw不可以用return
          throw new Error(`promise_02-失败:${ random }`) // 分为：name（错误类型）、message（传进去的参数）， name:Error、EvalError、RangeError、ReferenceError、SyntaxError、TypeError、URIError
        }
      }).then((res) => { // error时不执行then
        console.log(`then1:${ res }`)
      }).catch((err) => { // catch1
        console.log(`err1:${ err }`)
        console.log(`name:${ err.name }`)
        console.log(`message:${ err.message }`)
        throw new Error('promise_02-失败1:')
      }).then(() => { // error时不执行then
        console.log('继续')
      }).catch((err) => { // catch2
        // 在上一次报错的执行完后有继续的报错才会执行到这里,下面的报错不会执行这里,虽然属于报错队列的第二个，但一直都不会被触发
        console.log(`错误:${ err }`)
      }).then(() => {
        console.log('继续2')
        throw new Error('promise_02-失败2:')
      }).catch((err) => { // catch3
        console.log(`错误2:${ err }`)
      })
    },
    // asyncFunc1:切菜
    asyncFunc1 () {
      console.log('开始切菜。')
      // eslint-disable-next-line no-unused-vars
      return new Promise(function (resolve,reject) { // 做一些异步操作
        setTimeout(function () {
          // console.log('切菜完毕！')
          // resolve('切好的菜')
          console.log('切菜切手了！')
          reject('切菜切手了，无法继续做饭')
        }, 1000)
      })
    },
    // asyncFunc2:烧水
    asyncFunc2 () {
      console.log('开始烧水。')
      var p = new Promise(function (resolve) { // 做一些异步操作
        setTimeout(function () {
          console.log('烧水完毕！')
          resolve('烧好的水')
        },2000)
      })
      return p
    } ,
    // asyncFunc3:煮粥
    asyncFunc3 () {
      console.log('开始煮粥。')
      // eslint-disable-next-line no-unused-vars
      return new Promise(function (resolve,reject) { // 做一些异步操作
        setTimeout(function () {
          console.log('煮粥完毕！')
          resolve('煮好的粥')
          // console.log('煮粥烫手了！')
          // reject('煮粥烫手了，无法继续做饭')
        }, 2000)
      })
    },

    // Promise.all() 当有任务失败时立即catch输出失败，否则全部成功后由then输出，与Promise.any() 相反
    // 1、当所有的子Promise都成功完成，该Promise完成，返回值是全部值的数组;
    // 2、当有任何一个失败，该Promise失败，返回值是第一个失败的子Promise结果
    promiseAll () {
      Promise.all([this.asyncFunc1(), this.asyncFunc2()]).then((result) => {
        console.log('Promise.all-都成功完成了大家一起输出-数组：')
        console.log(result)
      }).catch((err) => { // 任何一个失败
        console.log('Promise.all-失败原因：')
        console.log(err)
      })
    },
    // Promise.allSettled() 会等所有异步任务执行完毕，获取全部子Promise的结果，不论成功还是失败，
    // 在then中返回数组格式的结果，每一个结果是一个对象，包含属性：status、value/reason
    // 不执行catch，即使有子Promise失败
    promiseAllSettled () {
      Promise.allSettled([this.asyncFunc1(), this.asyncFunc2()]).then((result) => {
        console.log('Promise.allSettled-数组：')
        console.log(result)
        // result = [
        //   {
        //     'status': 'rejected',
        //     'reason': '切菜切手了，无法继续做饭'
        //   },
    
        //   {
        //     'status': 'fulfilled',
        //     'value': '烧好的水'
        //   }
        // ]
      }).catch((err) => { // 不执行catch，可以不用写catch
        console.log('Promise.allSettled-失败原因：')
        console.log(err)
      })
    },
    //  Promise.race() 先完成先输出:不管成功还是失败，谁先完成谁先输出，成功由then输出，失败由catch输出
    promiseRace () {
      Promise.race([this.asyncFunc1(), this.asyncFunc2()]).then((result) => {
        console.log('Promise.race-成功的先完成先输出：')
        console.log(result)
      }).catch((err) => { // 任何一个失败
        console.log('Promise.race-失败的先完成先输出：')
        console.log(err)
      })
    },
    // Promise.any() 当成功时由then立即输出，失败时继续执行下一个。当全部任务失败时由catch输出，与Promise.all() 相反
    promiseAny () {
      Promise.any([this.asyncFunc1(), this.asyncFunc3()]).then((result) => {
        console.log('Promise.any-当任何一个成功时then返回成功的结果')
        console.log(result)
      }).catch((err) => { // 全部失败
        // AggregateError 是 Error 的子类。
        console.log('Promise.any-当全部失败时catch返回一个Error的子类：')
        console.log(err) // AggregateError: No Promise in Promise.any was resolved
        console.log(typeof (err)) // object
        console.log(Object.prototype.toString.call(err)) // [object Error]
      })
    },
    finally () {
      var promise = new Promise((resolve) => {
        console.log('promise构建') // Promise 的 .then 或者 .catch 可以被调用多次, 但如果Promise内部的状态一经改变，并且有了一个值，那么后续每次调用.then或者.catch的时候都会直接拿到该值。
        setTimeout(() => {
          resolve('success1')
        }, 1000)
      })

      promise
        .then(res => {
          console.log('then:', res) // then: success1
          return 'bibi'
        }).finally((fin) => { // 其实finally方法没有参数
          console.log('final:',fin)// final: undefined
          return 'haha'
        }).then((res) => {
          console.log('final-after-then1:',res) // final-after-then1: bibi
        }).then((res) => {
          console.log('final-after-then2:',res)// final-after-then2: undefine,如果上一个then方法return 222，这里的res就是222

        })
      // then: success1
      // final: undefined
      // final-after-then1: bibi
      // final-after-then2: undefine

      // 以下用于验证promise只被执行1次
      promise.then(res => {
        console.log('then2:', res) // then: success1
        return 'bibi'
      })
      // then: success1
      // then2: success1
      // final: undefined
      // final-after-then1: bibi
      // final-after-then2: undefine

    },
    myPromise () {
      const p1 = new MyPromise((resolve, reject) => {
        console.log('p1')

        setTimeout(() => {
          // reject('p1信息') // 执行失败
          resolve('p1信息') // 执行成功
          // throw ('p1抛出错误') //异步的throw，会报错，构造器执行时没发现错误，计时结束时发生的错误已不能再执行构造器里的try、catch
        }, 1000)
        // throw new Error('p1抛出错误')
        // throw ('p1抛出错误')
        // reject('p1失败信息')
        // resolve('p1成功信息')
      })
        .then((res) => {
          console.log('p1-then1-fulfilled', res + 1)
          // return res 
          // throw '3333'
          // return setTimeout(() => {
          //   return res 
          // })
          // return Promise.resolve(res + 1)
          return MyPromise.reject(res )
          // return MyPromise.resolve(res ) //手写版只会执行1次微任务，而原生会执行2次微任务
          
        // return new MyPromise((resolve, reject) => {
        //   resolve(res)
        //   // reject(res)
        // })
        // .then((res) => {
        //   return res + '成功2'
        // }, (error) => {
        //   return error + '失败2'
        // })
        // .then((res) => {
        //   return res + '成功3'
        // }, (error) => {
        //   return error + '失败3'
        // })
        },
        // '失败信息',
        (error) => {
          console.log('p1-then1-rejected', error)
          return error
        },
        )

        .then(
        // 333
          (res) => {
            console.log('p1-then2-fulfilled', res + 2)
            // return Promise.resolve(res + 1)
            return res 
          }
          , (error) => {
            console.log('p1-then2-rejected', error + 2)
            return error
          })

        .then((res) => {
          console.log('p1-then3-fulfilled', res + 3)
          return res 
        }, (error) => {
          console.log('p1-then3-rejected', error + 3)
          return error
        })
        .then((res) => {
          console.log('p1-then4-fulfilled', res + 4)
        }, (error) => {
          console.log('p1-then4-rejected', error + 4)
        })
    },

    originalPromise () {
      // setTimeout(() => {
      const p2 = new Promise((resolve, reject) => {
        console.log('p2')
        // setTimeout(() => {
        //   // reject('p2信息1') // 执行失败
        //   resolve('p2信息1') // 执行成功
        //   // throw ('抛出错误') //异步的throw，会报错，构造器执行时没发现错误，计时结束时发生的错误已不能再执行构造器里的try、catch
        // }, 1000)
        // throw new Error('抛出错误')
        // throw ('抛出错误')
        // reject('失败信息')
        resolve('p2成功信息')
      })
        .then(
          (res) => {
            console.log('p2-then1-fulfilled', res + 1)
            // return res
            // throw '3333'
            // return setTimeout(() => {
            //   return res 
            // })
            // return Promise.resolve(res )
            return Promise.reject(res )
            // return new Promise((resolve, reject) => {
            //   // resolve(res)
            //   reject(res)
            // }).then((res) => {
            //   return res + '成功2'
            // }, (error) => {
            //   return error + '失败2'
            // })
          }
          ,
          // '失败信息',
          (error) => {
            console.log('p2-then1-rejected', error + 1)
            return error
          },
        )

        .then(
          // 33
          (res) => {
            console.log('p2-then2-fulfilled', res + 2)
            // return Promise.resolve(res + 1)
            return res 
          }
          , (error) => {
            console.log('p2-then2-rejected', error + 2)
            return error
          })
        .then((res) => {
          console.log('p2-then3-fulfilled', res + 3)
          return res
        }, (error) => {
          console.log('p2-then3-rejected', error + 3)
          return error
        })
        .then((res) => {
          console.log('p2-then4-fulfilled', res + 4)
        }, (error) => {
          console.log('p2-then4-rejected', error + 4)
          return error
        })

      // }, 1000)
      // Promise.resolve(1).then((res) => {
      //   console.log('promise.resolve-then', res)
      // })

    }
  }
}
</script>
