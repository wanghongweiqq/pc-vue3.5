<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-05-26 15:58:17
 * @Description: js作用域提升
 * @FilePath: /vue3.0/src/views/demo/duyi/scope-promotion.vue
-->

<template>
  <div class="content">
    <h2>js作用域提升可大致分为：</h2>
    <p>1、全局作用域（Global Scope）‌：在所有函数和代码块之外声明的变量或函数。全局变量可以在整个程序中访问，但如果滥用可能导致命名冲突和难以维护的代码。使用var声明的全局变量会成为window对象的属性‌</p>
    <p>2、函数作用域（Function Scope）：在函数内部声明的变量，只能在该函数内部访问。使用var声明的变量具有函数作用域，这有助于避免全局污染，但可能导致变量提升问题‌。</p>
    <p>3、块级作用域（Block Scope）‌：使用let和const关键字声明的变量，其作用域限定在最近的块（如if语句、for循环等）内。块级作用域提供了更精细的控制，减少了变量提升和意外的全局变量创建的风险‌。</p>
    <p>4、Script 作用域 ‌：在浏览器环境下，使用let和const声明的全局变量会被放到script作用域，可以直接访问这个全局变量，但不能通过window.xx访问‌</p>
    <p>5、‌模块作用域‌：在 Node.js 环境中，使用import和export声明的模块内部的变量具有模块作用域，只能在当前模块内部访问‌。</p>

    <h2>js作用域提升分为两种形式：</h2>
    <h3>1、变量声明作用域提升（var形式，函数表达式也可按此对待）</h3>
    <p>使用var关键字声明的变量会被提升，但只有声明本身被提升到最近的函数作用域，而初始化（即赋值）不会被提升。</p>
    <p><em>var变量不受{}块级作用域限制</em>，在循环/条件块中声明的变量会泄露到外部</p>
    <p>允许在同一作用域内多次var声明同一变量，后续声明的变量只要有值就会覆盖前面的同名变量，无值时不会覆盖前面已赋的值。</p>
    <p>同名函数声明的优先级高于变量声明</p>
    <p>let和const也会有作用域提升，但在他们声明的块级作用域内有暂时性死区。先使用后声明就会导致两种不同的结果。</p>
    <p>1、在同一作用域内会导致引用报错，在初始化之前不能访问：ReferenceError: Cannot access 'x' before initialization</p>
    <p>2、在内层块级作用域定义，外层函数作用域访问时会导致引用报错，变量未被定义：ReferenceError: x is not defined</p>

    <h3>2、函数声明作用域提升</h3>
    <h4>非严格模式下（ES5及其以前），浏览器的控制台默认就是此模式</h4>
    <p>函数内使用（内部可能含有块级作用域），声明提升到函数作用域内的顶部，赋值提升到最近作用域内的顶部，原位置相当于被删除。</p>
    <h4>严格模式下（ES6+），vue和react内都是严格模式。</h4>
    <p>声明和赋值都会提升到最近作用域内的顶部。</p>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'

// 经典案例-非严格模式下-可使用浏览器的控制台运行
function demoA1 () {
  // 非严格模式下，相当于将function a声明本身提升到此，但没有赋值
  console.log(-1, a) // -1 undefined 此处是函数声明导致的undefined，变量提升和函数提升都会导致undefined，函数提升的优先级更高。
  var a = 0
  console.log(0, a) // 0 0
  if(true) {
    // 非严格模式下，function a 在此赋值
    console.log(1, a) // 1 ƒ a() {}
    a = 2 // 函数声明会将上一个的同名变量a的值赋值到块级作用域外也就是函数作用域内，也就是将方法demoA1内的a的值赋值为2，后续该块级作用域内的同名变量a的值将不会往上一次传递，这就是js非标准写法导致的后果，不要问为什么
    console.log(2, a) // 2 2
    function a () {} // 不要在块级作用域内声明方法，这是一种非标准写法
    console.log(3, a) // 3 2
    a = 4
    console.log(4, a) // 4 4
  }
  console.log(5, a) // 5 2-非严格模式/0-严格模式
}

// 经典案例-严格模式下
function demoA2 () {
  console.log(-1, a) // -1 undefined，变量声明导致的undefined，如果没有下面的var a = 0，在严格模式下直接就报引用错误了：Uncaught (in promise) ReferenceError: a is not defined
  var a = 0
  console.log(0, a) // 0 0
  if(true) {
    // 严格模式下，相当于将现编的function a移动到此
    console.log(1, a) // 1 ƒ a() {}
    a = 2
    console.log(2, a) // 2 2
    function a () {}
    console.log(3, a) // 3 2
    a = 4
    console.log(4, a) // 4 4
  }
  console.log(5, a) // 5 0
}

// 经典案例-没有函数声明
function demoA3 () {
  var a = 0
  console.log(0, a) // 0 0
  if(true) {
    console.log(1, a) // 1 0
    a = 2 // 后续没有函数声明同名变量a的值会往上依次传递
    console.log(2, a) // 2 2
    a = 3
    console.log(3, a) // 3 3
    a = 4
    console.log(4, a) // 4 4
  }
  console.log(5, a) // 5 4
}

// var 变量声明-普通变量
function demoB1 () {
  console.log(0, a) // 0 undefined
  if(true) {
    console.log(1, a) // 1 undefined
    var a = 2
    console.log(2, a) // 2 2
  }
  console.log(3, a) // 3 2
}

// var 变量声明-函数表达式
function demoB2 () {
  console.log(0, a) // 0 undefined
  if(true) {
    console.log(1, a) // 1 undefined
    var a = function () {}
    console.log(2, a) // 2 ƒ () {}
  }
  console.log(3, a) // 3 ƒ () {}
}

// var 变量声明-能否提升到另一个方法内-不能
function demoB3 () {
  demoB2()
  console.log(100, a) // 报错：Uncaught (in promise) ReferenceError: a is not defined
}

// 函数声明-非严格模式下
function demoC1 () {
  console.log(0, a) // 0 undefined
  if(true) {
    console.log(1, a) // 1 ƒ a () {}
    function a () {}
    console.log(2, a) // 2 ƒ a () {}
  }
  console.log(3, a) // 3  ƒ a () {}
}

// 函数声明-严格模式下
function demoC2 () {
  // console.log(0, a) // 必须注释掉，否则报错：Uncaught (in promise) ReferenceError: a is not defined
  if(true) {
    console.log(1, a) // 1 ƒ a () {}
    function a () {}
    console.log(2, a) // 2 ƒ a () {}
  }
  // console.log(3, a) // 必须注释掉，否则报错：Uncaught (in promise) ReferenceError: a is not defined
}

onMounted(() => {
  demoA1()
  // demoA2()
  // demoA3()
  // demoB1()
  // demoB2()
  // demoB3()
  // demoC1()
  // demoC2()
})
</script>
