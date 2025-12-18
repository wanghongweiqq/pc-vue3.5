<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2021-11-29 10:10:36
 * @LastEditTime: 2025-03-21 10:05:34
 * @LastEditors: Please set LastEditors
 * @Description: async-await
 * @FilePath: /vue3.0/src/views/demo/async-await.vue
-->
<template>
  <div class="pg-async-await">
    <div class="ly-box">
      <cp-crumbs />
      <div class="content">
        <h1>async</h1>
        <p>async 是一个修饰符，async 定义的函数会默认的返回一个Promise对象resolve的值，因此对async函数可以直接进行then操作,返回的值即为then方法的传入函数</p>
        <h1>await</h1>
        <p>await 关键字 只能放在 async 函数内部， await关键字的作用 就是获取 Promise中返回的内容， 获取的是Promise函数中resolve或者reject的值</p>
        <p>// 如果await 后面并不是一个Promise的返回值，则会按照同步程序返回值处理</p>

        <h2>await 关键字 只能放在 async 函数内部， await关键字的作用 就是获取 Promise中返回的内容， 获取的是Promise函数中resolve或者reject的值</h2>
        <pre>
          test1 () {
            const x = function () { return 'step1' }
            const y = new Promise((resolve, reject) => {
              setTimeout(function () {
                resolve('step2')
              }, 1000)
            })

            async function asyFun () {
              const step1 = await x()
              console.log(`step1=${ step1 }`) // step1=step1，立即执行
              const step2 = await y
              console.log(`step2=${ step2 }`) // step2=step2，step1执行完后再等待1秒后执行
              const step3 = await 'step3'
              console.log(`step3=${ step3 }`) // step3=step3，等待step2执行完后立即执行
              const res = `${ step1 }-${ step2 }-${ step3 }`
              return res
            }
            asyFun().then((res) => { //如果asyFun方法最后没有return res，这里then方法中的参数res为undefined
              console.log(`res=${ res }`) // res=step1-step2-step3
            })
          }
        </pre>
        <h2>如果await 后面并不是一个Promise的返回值，则会按照同步程序返回值处理,为undefined</h2>
        <pre>
          test2 () {
            const x = function () { return 'step1' }
            const y = () => {
              // return new Promise((resolve, reject) => {
              //   setTimeout(function () {
              //     resolve('b')
              //   }, 1000)
              // })
              setTimeout(function () {
                return('b')
              }, 1000)
            }

            async function asyFun () {
              const step1 = await x()
              console.log(`step1=${ step1 }`) // step1=step1
              const step2 = await y() // 立即执行，和不带await修饰符执行y()的结果一致
              console.log(`step2=${ step2 }`) // step2=undefined
              const step3 = await 'step3'
              console.log(`step3=${ step3 }`) // step3=step3，三个结果按顺序同时输出
            }
            asyFun() 
          }
        </pre>
        <h2>await的重要应用,将异步调用设置为同步执行，</h2>
        <pre>
          test3 () {
            const timeStart = new Date().getTime()
            const asy = function (x) {
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve(x)
                }, 1000)
              })
            }

            const asyFun = async function () {
              const step1 = await asy('step1')
              console.log(`step1=${ step1 }`) // step1=step1 ,1秒后执行
              const step2 = await asy('step2')
              console.log(`step2=${ step2 }`) // step2=step2 ,1秒后执行
              const step3 = await asy('step3')
              console.log(`step3=${ step3 }`) // step3=step3 ,1秒后执行
              const timeEnd = new Date().getTime()
              console.log(`时间：${ parseInt((timeEnd - timeStart) / 1000) }s`)// 时间：3s
            }

            asyFun()
             
            // 使用promise亦可实现，方法1
            const asyFun2 = function () {
              const step1 = () => {
                return asy('step1')
              }
              const step2 = () => {
                return asy('step2')
              }
              const step3 = () => {
                return asy('step3')
              }
              step1().then(step1 => {
                console.log(`step1=${ step1 }`) 
                return step2()
              }).then(step2 => {
                console.log(`step2=${ step2 }`) 
                return step3()
              }).then(step3 => {
                console.log(`step3=${ step3 }`) 
                const timeEnd = new Date().getTime()
                console.log(`时间：${ parseInt((timeEnd - timeStart) / 1000) }s`) // 时间：3s
              })
            }
            asyFun2()

            // 使用promise亦可实现，方法2
            const asyFun3 = function () {
              asy('step1').then(step1 => {
                console.log(`step1=${ step1 }`) 
                return asy('step2')
              }).then(step2 => {
                console.log(`step2=${ step2 }`) 
                return asy('step3')
              }).then(step3 => {
                console.log(`step3=${ step3 }`) 
                const timeEnd = new Date().getTime()
                console.log(`时间：${ parseInt((timeEnd - timeStart) / 1000) }s`) // 时间：3s
              })
            }
            asyFun3() 
          }
        </pre>
        <h3> 虽然promis.then亦可实现，但可读性和复杂度方面没有前者优秀，具体如下，每一个步骤都需要之前每个步骤的结果</h3>
        <pre>
          test4 () {
            const timeStart = new Date().getTime()
            const asy = function () {
              let arg = ''
              for(let item of arguments) {
                arg += item
              }
              return new Promise((resolve) => {
                setTimeout(() => {
                  // console.log(x)
                  resolve(arg)
                }, 1000)
              })
            }

            // 使用async/await亦可实现
            const asyFun = async function () {
              const step1 = await asy('step1')
              console.log(`step1=${ step1 }`) // step1=step1 ,1秒后执行
              const step2 = await asy(step1,'step2')
              console.log(`step2=${ step2 }`) // step2=step1step2 ,再1秒后执行
              const step3 = await asy(step1,step2,'step3')
              console.log(`step3=${ step3 }`) // step3=step1step1step2step3 ,再1秒后执行
              const timeEnd = new Date().getTime()
              console.log(`时间：${ parseInt((timeEnd - timeStart) / 1000) }s`)// 时间：3s
            }
            // asyFun() 

            // 使用promise亦可实现
            const asyFun2 = function () {
              const step1 = () => {
                return asy('step1')
              }
              const step2 = (step1) => {
                return asy(step1,'step2')
              }
              const step3 = (step1,step2) => {
                return asy(step1,step2,'step3')
              }
              step1().then(step1 => {
                console.log(`step1=${ step1 }`) 
                return step2(step1).then(step2 => [step1,step2])
              }).then(array => {
                const [step1,step2] = array
                console.log(`step2=${ step2 }`) 
                return step3(step1,step2)
              }).then(step3 => {
                console.log(`step3=${ step3 }`)
                const timeEnd = new Date().getTime()
                console.log(`时间：${ parseInt((timeEnd - timeStart) / 1000) }s`) // 时间：3s
              })
            }
            asyFun2() 
          }
        </pre>
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
    this.test1()
    // this.test2()
    // this.test3()
    // this.test4(1,2)
  },
  methods: {
    // await的值含有Promise，会按照同步顺序等待后执行
    test1 () {
      // const x = function () { return 'step1' }
      function x () { return 'step1' }
      const y = new Promise((resolve) => {
        setTimeout(function () {
          resolve('step2')
        }, 1000)
      })

      async function asyFun () {
        const step1 = await x()
        console.log(`step1=${ step1 }`)// step1=step1，立即执行
        const step2 = await y
        console.log(`step2=${ step2 }`)// step2=step2，step1执行完后再等待1秒后执行
        const step3 = await 'step3'
        console.log(`step3=${ step3 }`)// step3=step3，等待step2执行完后立即执行
        const res = `${ step1 }-${ step2 }-${ step3 }`
        return res
      }
      asyFun().then((res) => { // 如果asyFun方法最后没有return res，这里then方法中的参数res为undefined
        console.log(`res=${ res }`)// res=step1-step2-step3
      })
    },
    // await的值不含有Promise，会按照同步顺序立即执行
    test2 () {
      const x = function () { return 'step1' }
      const y = () => {
        // return new Promise((resolve, reject) => {
        //   setTimeout(function () {
        //     resolve('step2')
        //   }, 1000)
        // })
        setTimeout(function () {
          return('step2')
        }, 1000)
      }

      async function asyFun () {
        const step1 = await x()
        console.log(`step1=${ step1 }`) // step1=step1
        const step2 = await y() // 立即执行，和不带await修饰符执行y()的结果一致
        console.log(`step2=${ step2 }`) // step2=undefined
        const step3 = await 'step3'
        console.log(`step3=${ step3 }`) // step3=step3，三个结果按顺序同时输出
      }
      asyFun() 
    },
    // await的重要应用,将异步调用设置为同步执行，
    test3 () {
      const timeStart = new Date().getTime()
      const asy = function (x) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(x)
          }, 1000)
        })
      }

      const asyFun = async function () {
        const step1 = await asy('step1')
        console.log(`step1=${ step1 }`) // step1=step1 ,1秒后执行
        const step2 = await asy('step2')
        console.log(`step2=${ step2 }`) // step2=step2 ,step1执行完后再等待1秒后执行
        const step3 = await asy('step3')
        console.log(`step3=${ step3 }`) // step3=step3 ,step2执行完后再等待1秒后执行
        const timeEnd = new Date().getTime()
        console.log(`时间：${ parseInt((timeEnd - timeStart) / 1000) }s`)// 时间：3s
      }

      asyFun()

      // 使用promise亦可实现，方法1
      const asyFun2 = function () {
        const step1 = () => {
          return asy('step1')
        }
        const step2 = () => {
          return asy('step2')
        }
        const step3 = () => {
          return asy('step3')
        }
        step1().then(step1 => {
          console.log(`step1=${ step1 }`) 
          return step2()
        }).then(step2 => {
          console.log(`step2=${ step2 }`) 
          return step3()
        }).then(step3 => {
          console.log(`step3=${ step3 }`) 
          const timeEnd = new Date().getTime()
          console.log(`时间：${ parseInt((timeEnd - timeStart) / 1000) }s`) // 时间：3s
        })
      }
      asyFun2()

      // 使用promise亦可实现，方法2
      const asyFun3 = function () {
        asy('step1').then(step1 => {
          console.log(`step1=${ step1 }`) 
          return asy('step2')
        }).then(step2 => {
          console.log(`step2=${ step2 }`) 
          return asy('step3')
        }).then(step3 => {
          console.log(`step3=${ step3 }`) 
          const timeEnd = new Date().getTime()
          console.log(`时间：${ parseInt((timeEnd - timeStart) / 1000) }s`) // 时间：3s
        })
      }
      asyFun3() 
    },
    // 虽然promis.then亦可实现，但可读性和复杂度方面没有前者优秀，具体如下，每一个步骤都需要之前每个步骤的结果
    test4 () {
      const timeStart = new Date().getTime()
      const asy = function () {
        let arg = ''
        for(let item of arguments) {
          arg += item
        }
        return new Promise((resolve) => {
          setTimeout(() => {
            // console.log(x)
            resolve(arg)
          }, 1000)
        })
      }

      // 使用async/await亦可实现
      const asyFun = async function () {
        const step1 = await asy('step1')
        console.log(`step1=${ step1 }`) // step1=step1 ,1秒后执行
        const step2 = await asy(step1,'step2')
        console.log(`step2=${ step2 }`) // step2=step1step2 ,再1秒后执行
        const step3 = await asy(step1,step2,'step3')
        console.log(`step3=${ step3 }`) // step3=step1step1step2step3 ,再1秒后执行
        const timeEnd = new Date().getTime()
        console.log(`时间：${ parseInt((timeEnd - timeStart) / 1000) }s`)// 时间：3s
      }
      asyFun() 

      // 使用promise亦可实现
      const asyFun2 = function () {
        const step1 = () => {
          return asy('step1')
        }
        const step2 = (step1) => {
          return asy(step1,'step2')
        }
        const step3 = (step1,step2) => {
          return asy(step1,step2,'step3')
        }
        step1().then(step1 => {
          console.log(`step1=${ step1 }`) 
          return step2(step1).then(step2 => [step1,step2])
        }).then(array => {
          const [step1,step2] = array
          console.log(`step2=${ step2 }`) 
          return step3(step1,step2)
        }).then(step3 => {
          console.log(`step3=${ step3 }`)
          const timeEnd = new Date().getTime()
          console.log(`时间：${ parseInt((timeEnd - timeStart) / 1000) }s`) // 时间：3s
        })
      }
      asyFun2() 
    }
  }
}
</script>
