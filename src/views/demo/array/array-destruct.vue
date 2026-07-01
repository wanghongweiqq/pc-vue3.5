<template>
  <div class="content">
    <h2>解构对原数据的影响</h2>
     <pre>{{ `let a = { x: { l: 1 }, y: 2, z:null }
let { x, y, z=1 } = a
// a中原来是引用类型的x，分情况讨论
// x = { m: 2 } // 原数据a不会被改变，相当于给x重新赋值了
x.l = 2 // 原数据a会被改变，和之前的x指向同一个存储地址
// a中原来是基本类型的y，如何改变其值都不会影响a
y = 3
y = { m: 3 }
console.log(a)
// 解构赋值时，默认值仅在 undefined时生效：解构默认值只在对应的属性值为 undefined时才会使用。如果属性值为 null、false或 0等其他假值，默认值不会被启用
console.log(z) // 输出null
` }}</pre>
  </div>
</template>
