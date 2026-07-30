<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:18:00
 * @Description: 原型
 * @FilePath: /pc-vue3.5/src/views/demo/function/function-prototype.vue
-->
<template>
  <div class="content">
    <h2>原型</h2>
    <p>原型： 每个函数都有 prototype 属性，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。使用原型对象的好处就是可以让所有对象实例共享它所包含的属性和方法。</p>
    <pre>{{ `function Animal () {}
Animal.prototype.name = ['a','b']
Animal.prototype.year = 0,
Animal.prototype.sayName = function () {
  console.log(this.name)
}
let animal1 = new Animal()
console.log('animal1')
console.log(animal1)
console.log( animal1.name)// ['a','b']

animal1.name.push(1) // 先去查找实例属性name，发现没有去prototype查找，找到后改变其值

console.log(animal1)
console.log(animal1.name) // ['a','b',1]

let animal2 = new Animal()
console.log('animal2')
console.log(animal2)
console.log( animal2.name)// ['a','b',1]
console.log(animal1.sayName === animal2.sayName)		//true
` }}</pre>
    <p>注意：若在实例中添加与原型相同的属性，则会屏蔽原型的属性。</p>
    <p>原型优点：使用原型对象的好处是可以让所有对象实例共享它所包含的属性和方法。</p>
    <p>原型存在的致命问题： 不能像构造函数一样传递初始化参数，所有实例在默认情况下都将取得相同的属性值。也就是说所有实例共享属性，<em>但是对于包含引用类型的属性来说，是致命的</em>。举例如下。</p>
    <p>构造函数的属性值是和js的数据类型一直，基本数据类型只要值相同就相等，引用数据类型必定不相等（除非后来人为指向同一个引用地址）。</p>
    <p>原型上的属性的值是共用的，一个实例非"="操作改变了其值（一般引用类型才有这种操作，如数组的push），其他实例的原型的该属性也会受到影响，使用"="赋值，这相当于新增/更新实例的属性，对原型没影响。</p>
    <h2>最后总结:原型模式结合构造函数的混合模式</h2>
    <p>混合模式中构造函数模式用于定义实例属性和引用属性，而原型模式用于定义方法和共享属性。 每个实例都会有自己的一份实例属性，但同时又共享方法，最大限度的节省了内存。另外这种模式还支持传递初始数据，使用最广。</p>
    <img src="@/assets/images/prototype.png">
    <h2>动态原型模式</h2>
    <p>动态原型模式把所有信息都封装在了构造函数中，在构造函数中初始化原型（保留了同时使用构造函数和原型的优点）。可以通过检查某个应该存在的方法是否有效，来决定是否需要初始化原型。</p>
    <pre>{{ `function Animal(name){
  this.name = name;
  if (typeof this.sayName != "function"){//只在 sayName() 不存在的情况下，才会将它添加到原型中。此后，原型已经修改完毕，直接调用就可以了。
    Animal.prototype.sayName = function(){
      console.log(this.name);
    }
  }
}
let animal1 = new Animal('ooxx');
animal1.sayName();
` }}</pre>
  </div>
</template>
<script>
export default {
  mounted () {
    this.myPrototype()    
  },
  methods: {
    myPrototype () {
      function Animal () {}
      Animal.prototype.name = ['a','b']
      Animal.prototype.year = 0,
      Animal.prototype.sayName = function () {
        console.log(this.name)
      }
      const animal1 = new Animal()
      console.group('%c原型函数:','color:green')
      console.log('animal1:',animal1)
      console.log('animal1.__proto__:',animal1.__proto__)
      console.log('animal1.__proto__.constructor:',animal1.__proto__.constructor)
      console.log('animal1.name:',animal1.name)

      // animal1.name.push(1)改变了原型链上的数据，这些数据时共享的 对 animal2.name 也产生了影响
      animal1.name.push(1)
      console.log('animal1.name.push(1)') 
      console.log('animal1:',animal1) // 在Prototype上才能找到name属性
      console.log('animal1.name:',animal1.name)
      const animal2 = new Animal()
      console.log('animal2:',animal2)
      console.log('animal2.name:',animal2.name) 

      // animal2.name = [2] 改变了了实例的属性，对原型没影响
      animal2.name = [2]
      console.log('animal2.name = [2]') 
      console.log('animal2:',animal2) // 示例上新增了name属性
      console.log('animal2.name:',animal2.name)
      console.log('animal1.name:',animal1.name)
      console.groupEnd()
    }

  }
}
</script>
