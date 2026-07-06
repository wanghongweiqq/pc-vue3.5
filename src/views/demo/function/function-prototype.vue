<template>
  <div class="content">
    <h2>原型</h2>
    <p>原型： 每个函数都有 prototype 属性，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。使用原型对象的好处就是可以让所有对象实例共享它所包含的属性和方法。</p>
     <pre>{{ `function Person () {}
Person.prototype.name = ['a','b']
Person.prototype.year = 0,
Person.prototype.sayName = function () {
  console.log(this.name)
}
let person1 = new Person()
console.log('person1')
console.log(person1)
console.log( person1.name)// ['a','b']

person1.name.push(1) // 先去查找实例属性name，发现没有去prototype查找，找到后改变其值

console.log(person1)
console.log(person1.name) // ['a','b',1]

let person2 = new Person()
console.log('person2')
console.log(person2)
console.log( person2.name)// ['a','b',1]
console.log(person1.sayName === person2.sayName)		//true
` }}</pre>
    <p>注意：若在实例中添加与原型相同的属性，则会屏蔽原型的属性。</p>
    <p>原型优点：使用原型对象的好处是可以让所有对象实例共享它所包含的属性和方法。</p>
    <p>原型存在的致命问题： 不能像构造函数一样传递初始化参数，所有实例在默认情况下都将取得相同的属性值。也就是说所有实例共享属性，但是对于包含引用类型的属性来说，是致命的。举例如下</p>
    <p>构造函数的属性值是和js的数据类型一直，基本数据类型只要值相同就相等，引用数据类型必定不相等（除非后来人为指向同一个引用地址）</p>
    <p>原型上的属性的值是共用的，一个实例非"="操作改变了其值（一般引用类型才有这种操作，如数组的push），其他实例的原型的该属性也会受到影响，使用"="赋值，这相当于新增/更新实例的属性，对原型没影响</p>
    <h2>最后总结:原型模式结合构造函数的混合模式</h2>
    <p>混合模式中构造函数模式用于定义实例属性和引用属性，而原型模式用于定义方法和共享属性。 每个实例都会有自己的一份实例属性，但同时又共享方法，最大限度的节省了内存。另外这种模式还支持传递初始数据，使用最广。</p>
    <img src="@/assets/images/prototype.png">
    <h2>动态原型模式</h2>
    <p>动态原型模式把所有信息都封装在了构造函数中，在构造函数中初始化原型（保留了同时使用构造函数和原型的优点）。可以通过检查某个应该存在的方法是否有效，来决定是否需要初始化原型。</p>
     <pre>{{ `function Person(name){
  this.name = name;
  if (typeof this.sayName != "function"){//只在 sayName() 不存在的情况下，才会将它添加到原型中。此后，原型已经修改完毕，直接调用就可以了。
    Person.prototype.sayName = function(){
      console.log(this.name);
    }
  }
}
let person1 = new Person('ooxx');
person1.sayName();
` }}</pre>
  </div>
</template>
