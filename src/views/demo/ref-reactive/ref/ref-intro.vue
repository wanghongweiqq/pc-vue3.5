<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:18:00
 * @Description: ref 介绍
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/ref/ref-intro.vue
-->
<template>
  <div class="content">
    <h2>ref 介绍</h2>
    <p>ref 用来创建响应式数据：字符串、数字、布尔、数组、对象等。返回一个包装对象实例，内部真实数据存在 .value 属性里。</p>
    <p>主要有以下两种使用场景：</p>
    <p>1、在 script setup /ts 逻辑里读写都要加 <em>.value</em>。</p>
    <p>2、模板编译时 Vue 会自动<em>解包</em> ref，直接写变量名即可。</p>
    
    <h3>ref创建的是一个 Ref 响应式包装对象</h3>
    <p>ref 通过 RefImpl 类实现，使用 .value 的 getter/setter 拦截变更。</p>
    
    <h4>RefImpl 类</h4>    
    <pre>
class RefImpl {
  // 内部原始值
  private _value: any
  // 原始参数（如果是对象/数组，用于对比）
  private _rawValue: any
  // 标记这是ref实例
  public __v_isRef = true

  constructor(rawValue) {
    this._rawValue = rawValue
    // 如果传入对象/数组，内部会用 reactive 包装
    this._value = convert(rawValue)
  }

  // .value 的 getter
  get value() {
    // 依赖收集：当前组件副作用存入ref的依赖集合
    track(this, TrackOpTypes.GET, 'value')
    return this._value
  }

  // .value 的 setter
  set value(newVal) {
    // 新旧值对比，相同则不更新
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      // 新值对象自动转响应式
      this._value = convert(newVal)
      // 触发所有收集到的副作用（更新视图、watch）
      trigger(this, TriggerOpTypes.SET, 'value', newVal)
    }
  }
}
    </pre>
    
    <h4>RefImpl 类实例</h4>    
    <pre>
RefImpl:{
  "dep": {
    activeLink: undefined,
    computed: undefined,
    key: undefined,
    map: undefined,
    sc: 0,
    subs: undefined,
    subsHead: undefined,
    version: 1,
    __v_skip: true,
  },
  "__v_isRef": true,
  "__v_isShallow": false,
  "_rawValue": 1,
  "_value": 1,
  <em>value: 1,</em>
  [[Prototype]]: {
    constructor: class RefImpl,
    value: 1,
    get value: ƒ value(),
    set value: ƒ value(newValue),
    [[Prototype]]: Object,
  },
 }
    </pre>

    <h3>读写流程</h3>
    <h4>读取 refDemo.value</h4>
    <p>1、触发 get value()；</p>
    <p>2、track() 收集当前运行的副作用（渲染 effect、watch 副作用）；</p>
    <p>3、返回内部 _value。</p>
    
    <h4>赋值 refDemo.value = xxx</h4>
    <p>1、触发 set value(newVal)；</p>
    <p>2、对比新旧值，无变化直接终止；有变化继续3；</p>
    <p>3、更新内部 _rawValue、_value；</p>
    <pre>如果是引用类型数据（如数组），RefImpl构造函数里 convert 会把对象用 reactive 代理：
this._value = reactive(rawValue)
此时外部使用的地方：
refDemo.value 得到的是 Proxy 对象；
refDemo.value[0].name = xx：只会触发 Proxy 内部拦截，不会触发 RefImpl 的 value setter；
这种情况下，watch(refDemo, fn, {deep:false}) 监听不到，因为 RefImpl.value 本身没有被重新赋值。</pre>
    <p>4、trigger() 执行所有收集的副作用：更新页面、触发 watch。</p>
  </div>
</template>