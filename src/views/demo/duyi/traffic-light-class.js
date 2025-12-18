/*
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-03-31 17:44:09
 * @Description: 信号灯类
 * @FilePath: /vue3.0/src/views/demo/duyi/traffic-light-class.js
 */
export default class TrafficLight {
  constructor (lights) {
    this._light = lights
    this._currentIndex = 0
    this._time = Date.now()
  }

  // Class 的 getter 本质是通过 Object.defineProperty 实现的属性描述符
  // 核心特性：1、拦截属性读取‌：当访问该属性时自动触发 getter 函数；2、无参数‌：不能接受参数 3、与数据属性共存‌：可与普通属性或 set 配对使用
  // 典型使用场景：1、动态计算属性 ‌2、封装私有属性（结合 # 私有字段或闭包实现数据保护）3、与 set 配对（set可设置参数）
  get currentLight () {
    return this._light[this._currentIndex]
  }
  get keepTime () {
    return Date.now() - this._time // Date.now()是Date的静态方法，无对象实例化开销，相比对象方new Date().getTime()，执行速度更快
  }
  _update () {
    if(this.keepTime >= this.currentLight.duration) {
      this._time += this.currentLight.duration
      this._currentIndex = ( this._currentIndex + 1) % this._light.length
    }
  }
  getCurrentLight () {
    this._update()
    return {
      color: this.currentLight.color,
      remain: this.currentLight.duration - this.keepTime 
    }
  }
}