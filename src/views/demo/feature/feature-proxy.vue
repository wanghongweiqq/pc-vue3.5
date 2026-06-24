<template>
  <div class="content">
    <h2>新的响应式机制采用了ES6的ProxyApi，抛弃了之前的Object.defineProperty()比较直观的解决的是Vue2中这两点问题</h2>
    <ul>
      <li><p>1、关于对象：Vue 无法检测 property 的添加或移除。由于 Vue 会在初始化实例时对 property 执行 getter/setter 转化，所以 property 必须在 <code>data</code> 对象上存在才能让 Vue 将它转换为响应式的。</p></li>
      <li>
        <p>2、关于数组：Vue 不能检测以下数组的变动：</p>
        <ol>
          <li>
            当你利用索引直接设置一个数组项时，例如：<code>vm.items[indexOfItem] = newValue</code>
          </li>
          <li>
            当你修改数组的长度时，例如：<code>vm.items.length = newLength</code>
          </li>
        </ol>
      </li>
    </ul>
  </div>
</template>
