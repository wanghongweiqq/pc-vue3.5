/* eslint-disable no-empty */
/*
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-05-20 15:15:23
 * @Description: promise的实现过程
 * @FilePath: /vue3.0/src/views/demo/duyi/my-promise.js
 */

// promise的三种状态
const PENDING = 'pending' // 等待
const FULFILLED = 'fulfilled' // 成功
const REJECTED = 'rejected' // 失败

class MyPromise {

  thenResult (funct, resolve, reject) {
    if(typeof funct === 'function') { // then的参数是方法
      const res = funct(this._result)
      if (res instanceof MyPromise) { // then里边又返回一个promise
        console.log('res instanceof MyPromise')
        res.then(resolve, reject)
      } else {
        resolve(res)
      }
    }else{ // then的参数不是方法，这时候需要把上一个合法的结果穿透过来
      const res = this._state === FULFILLED ? resolve : reject
      res(this._result)
    }
  }

  thenHandle (onFulfilled, onRejected, resolve, reject) {
    queueMicrotask(() => {
      try{
        if(this._state === FULFILLED) {
          this.thenResult(onFulfilled, resolve, reject)
        }else{
          this.thenResult(onRejected, resolve, reject)
        }
      }catch(error) {
        reject(error)
      }
    })

  }

  thenRun () {
    // console.log('this._state:', this._state)
    // console.log('this._thenList.length:', this._thenList.length)
    if(this._state === PENDING) return
    for(let item of this._thenList) {
      // while(this._thenList?.length > 0) { // 先进先出的取出来执行，其实和for of循环一样的效果
      const { onFulfilled, onRejected, resolve, reject } = item // item this._thenList.shift()
      this.thenHandle(onFulfilled, onRejected, resolve, reject)
    }
  }

  changeState (state, result) {
    if (this._state !== PENDING) return
    this._state = state
    this._result = result
    this.thenRun()
  }

  constructor (executor) {
    this._state = PENDING // 状态
    this._result = undefined // 结果
    this._thenList = [] // 长度最大为1

    const resolve = (value) => {
      this.changeState(FULFILLED, value)
    }
    const reject = (error) => {
      this.changeState(REJECTED, error)
    }

    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }

  then (onFulfilled, onRejected) {
    // console.log('then:', onFulfilled)
    return new MyPromise((resolve, reject) => {
      // console.log('then:return new MyPromise')
      this._thenList.push({ onFulfilled, onRejected, resolve, reject })
      // console.log(this._thenList.length)
      // console.log(this._thenList)
      this.thenRun()
    })
  }
  static resolve (value) {
    // 如果参数是Promise实例，直接返回
    if (value instanceof MyPromise) {
      return value
    }

    // 如果参数是thenable对象
    if (value && typeof value.then === 'function') {
      return new MyPromise(value.then)
    }

    // 普通值则返回一个已解决的Promise
    return new MyPromise(resolve => {
      resolve(value)
    }) 
  }
  static reject (value) {
    // 如果参数是Promise实例，直接返回
    if (value instanceof MyPromise) {
      return value
    }

    // 如果参数是thenable对象
    if (value && typeof value.then === 'function') {
      return new MyPromise(value.then)
    }

    // 普通值则返回一个已解决的Promise
    return new MyPromise((_,reject) => {
      reject(value)
    }) 
  }
  
}

export default MyPromise

