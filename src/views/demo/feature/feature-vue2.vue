<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:18:00
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/views/demo/feature/feature-vue2.vue
-->
<template>
  <div class="content">
    <h2>响应机制</h2>
    <p>Vue2采用的响应机制：<em>Object.defineProperty</em>，而Vue3采用了新的响应式机制：ES6的 <em>Proxy Api</em>。</p>
    <p>主要解决了Vue2中的以下两点问题。</p>
    <h3>1、关于对象：直接新增属性 / 删除属性</h3>
    <p>Object.defineProperty 只能劫持初始化时已存在的属性，后期新增 / 删除的属性无 get/set 劫持，无法触发更新。</p>
    <h4>问题代码</h4>
    <pre>
this.dataObj =  { name: '张三' }
this.dataObj.age = 18 // 新增属性，视图不更新
delete this.dataObj.name // 删除属性，视图不更新</pre>
    <h4>解决代码</h4>
    <pre>
dataObj:{..., age: null,}  // 在 data 中预定义属性（设为 null 或默认值），避免后续动态添加‌,
this.$set(this.dataObj, 'age', 18) // $set 可以新增属性，视图会更新
this.$delete(this.dataObj, 'name')  // $delete 可以删除属性，视图会更新
this.dataObj = { ...this.dataObj, age: 18 }  // 改变引用地址，整体替换对象</pre>

    <h3>2、关于数组：下标直接赋值 / 修改 length</h3>
    <p>Vue2 对数组的劫持仅重写了 push/pop/shift/unshift/splice/sort/reverse 7 个方法，下标赋值、length 修改无法被劫持。</p>
    <h4>问题代码</h4>
    <pre>
this.arr = [1,2,3]
this.arr[0] = 99  // 视图不更新
this.arr.length = 0  // 视图不更新</pre>  
    <h4>解决代码</h4>
    <pre>
this.$set(this.arr, 0, 99)  // $set 可以修改数组项，视图会更新
this.arr.splice(0,1,99)  // 使用可以被代理的数组方法修改，如: splice 
this.arr = [...this.arr]  // 整体覆盖数组，视图会更新</pre>

    <h3>Vue2 的解决办法总结：</h3>
    <p>1、使用Vue封装好的特有方法：全局 Vue.set；实例 this.$set、this.$delete；重新封装过具有拦截功能的js方法 push/pop/shift/unshift/splice/sort/reverse等。</p>
    <p>2、使用改变引用地址的方法：改变引用地址的赋值、解构、Object.assign();</p>
  </div>
</template>
