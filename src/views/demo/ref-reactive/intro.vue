<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:18:00
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/intro.vue
-->
<template>
  <div class="content">
    <h2>ref 和 reactive</h2>
    <p>ref 和 reactive是vue3 中创建响应式数据的方法</p>

    <h3>组件形式</h3>
    <h4>Composition API</h4>
    <p>Composition API 中，reactive / ref 必须保持<em>根引用不变才能触发响应式</em>；特别说明ref给xx.value改引用地址，会触发响应式更新，但给.value的父级xx（根层级）改引用地址，会使数据xx丢失响应式。</p>

    <h4>Option API</h4>
    <p>Option API 的 data底层也是 reactive，Vue 内部做了这件事：this.$data = reactive(rawData)。其实可以理解为：data是根目录， data()返回的对象被Vue 自动包了一层 reactive，包裹后都是响应式的，我们每次都是直接操作的data下的属性（reactive对象的属性），如this.count，也没机会或者说没办法改动根引用this.data。</p>
    <p>Option API 把“根引用管理”完全封装掉了。由于 Vue 接管了赋值过程，开发者几乎不需要关心引用地址的问题。</p>
    <pre>
export default {
  data() {
    return {
      count: 0,
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</pre>

    <h3>响应式边界</h3>
    <p>日常修改数据的形式：</p>
    <p>1、链式：refObject.value.x</p>
    <p>2、解构：const { x }= refObject.value </p>
    <p>3、变量：const x = refObject.value.x </p>
    <p><em>只要更改的是响应式数据，就会触发响应式更新。无论采用以上哪种形式。</em></p>
    <p>解构、变量的形式定义的变量，如果直接赋值，就相当于给变量改变了引用地址（指向了一个全新的赛道），不再指向响应式数据，也就不会触发响应式更新。如果采用链式赋值（.x = newVal;），就还是指向响应式数据，因而会触发响应式更新，我们要通过“响应式对象的引用”去修改它的属性</p>

    <h3>这和 Vue 没关系，而是 JS 基础</h3>
    <pre>
const obj = { a: 1 } // 相当于我们的响应式数据
let a = obj.a
a = 2
console.log(obj.a) // 1 
</pre>
    <p>a 改变后，a 指向的内存地址是新的，而不是 obj.a 指向的内存地址，obj.a 保持不变。</p>
    
    <h3>核心区别</h3>
    <p>Vue3 中 ref 和 reactive 的核心区别体现在数据类型支持、访问方式、响应式原理和使用场景、调试信息差异等维度。</p>
    <table class="table">
      <thead>
        <tr>
          <th>维度</th>
          <th>ref</th>
          <th>reactive</th>
        </tr>
      </thead>  
      <tbody>
        <tr>
          <th>数据类型支持</th>
          <td>支持包装基本类型（字符串、数字、布尔值）和复杂类型数据（对象/数组）</td>
          <td>仅接收对象、数组等引用类型，传入基本类型会触发警告且无法实现响应式</td>
        </tr>
        <tr>
          <th>数据访问方式</th>
          <td>需要通过 .value 访问或修改值（模板中自动解包）</td>
          <td>可直接访问属性，无需额外操作</td>
        </tr>
        <tr>
          <th>响应式原理</th>
          <td>通过 RefImpl 类实现，使用 .value 的 getter/setter 拦截变更</td>
          <td>返回 Proxy 代理对象，深度追踪嵌套属性变化</td>
        </tr>
        <tr>
          <th>使用场景</th>   
          <td>
            <p>处理基本数据类型。</p>
            <p>需要整体替换对象引用（如重新赋值整个数组）。</p>
            <p>需要保持类型一致性（如函数参数传递）。</p>
          </td>
          <td>
            <p>处理包含多个属性的复杂对象（如表单数据）。</p>
            <p>需要保持对象引用稳定（避免解构丢失响应性）。</p>
          </td>
        </tr>
        <tr>
          <th>‌调试信息差异‌</th>
          <td>ref 控制台显示为 RefImpl 实例。</td>
          <td>reactive 显示为 Proxy 代理对象。</td>
        </tr>
      </tbody>
    </table>
   
    <h3>Vue3 为什么 ref 变量需要 .value</h3>
    <p>1、Proxy 无法直接代理基本类型，必须包装成对象。</p>
    <p>2、Vue3 需要通过.value 才能做依赖追踪和视图更新。</p>
    <p>3、.value提供了明确语义，便于类型提示和维护。</p>
  </div>
</template>
