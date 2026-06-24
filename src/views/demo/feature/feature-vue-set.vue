<template>
  <div class="content">
    <h2>在 Vue2中需要使用 Vue.set 或实例方法 this.$set 来确保属性的响应式特性。</h2>
    <p>Vue.set对于对象，是通过内部API ( defineReactive ) 将新属性转换为响应式，并触发视图更新。对于数组，它会调用内部修改后的splice方法（拦截数组变更）</p>
    <pre>
    // target: 要操作的目标对象/数组
    // key: 要添加的属性名/索引值
    // value: 属性值/数组某一项的值

    // 全局方法
    Vue.set(target, key, value)
    Vue.set(this.user, 'age', 25)
    Vue.set(this.list, 0, newValue)

    // 组件内方法
    this.$set(target, key, value)
    this.$set(this.user, 'age', 25);
    this.$set(this.list, 0, newValue)
    </pre>
    <p>替换方案</p>
    <pre>
    // object
    // 1. 在 data 中预定义属性（设为 null 或默认值），避免后续动态添加‌,
    this.user={..., age: null,}
    // 2. 整体重新赋值：解构、Object.assign。需重新赋值，可能引发性能损耗‌
    this.user = { ...this.user, age: 25, }
    this.user = Object.assign({}, this.user, { age: 25, });

    // array
    // 数组一般场景都是全部项重新赋值，很少有修改个别项的情况，修改个别项可以使用：splice、push 等原生方法
    this.list.splice(1, 0, newValue1, ....., newValueX)
    this.list.push(newValue1, ....., newValueX)
    </pre>
  </div>
</template>
