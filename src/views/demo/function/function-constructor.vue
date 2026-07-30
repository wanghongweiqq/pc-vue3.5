<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:18:00
 * @Description: 构造函数
 * @FilePath: /pc-vue3.5/src/views/demo/function/function-constructor.vue
-->
<template>
  <div class="content">
    <h2>构造函数</h2>
    <p>应对某些场景，工厂函数并不能满足我们，如：我需要判断树是不是动物类型,你会发现你并没办法。只能知道他是Object。这时候构造函数就出现了。</p>
    <p>跟工厂函数很像，只是没有了创建对象和return，并且都用this添加属性。声明新对象的时候通过new关键字。这样做的好处是，新建的对象间是有关系的，我们可以看到，他的类型既是animal也是Object。就好比你是你爸爸的后代，但同时也是你爷爷的后代。</p>
    <pre>{{ `注释行是伪代码，表示在 new 关键创建实例时，JS 背后帮我们做的事情。
function Animal (name,sex) { //用大写首字母对构造器函数命名是个好习惯
  // this = {};
  // this.__proto__ = Animal.prototype
  this.name = name
  this.sex = sex
  this.saySex = function () {
    console.log(\`我的性别是$\{this.sex\}\`) //内部使用this关键字给对象添加成员
  }
  // return this
}
let monkey = new Animal('猴子','母') //使用new关键字调用对象构造函数
console.log('构造函数:')
monkey.saySex()  //我的性别是母
console.log(monkey.constructor === Animal)  // true 构造器只能匹配上一个，构造函数的实例的构造器只能是该构造函数
console.log(monkey.constructor === Object)  // false
console.log(monkey instanceof Animal) // true 判断实例是否属于某个原型用instanceof,只要是原型链上的都成立
console.log(monkey instanceof Object) // true
` }}</pre>
    <ul>
      <li>所有的引用类型（数组、对象、函数），都具有对象特性，即可自由扩展属性（null除外）</li>
      <li>所有的引用类型（数组、对象、函数），都有一个__proto__属性，属性值是一个普通的对象</li>
      <li>所有的函数，都有一个prototype属性，属性值也是一个普通的对象</li>
      <li>所有的引用类型（数组、对象、函数），__proto__属性值指向它的构造函数的prototype属性值</li>
    </ul>
    <dl>
      <dt>构造函数调用过程中实际会经历以下 4 个步骤：</dt>
      <dd>①创建一个新的空对象</dd>
      <dd>②将构造函数的作用域赋值给此对象(使 this 指向这个新对象)</dd>
      <dd>③执行构造函数中的代码(为这个新对象添加属性)</dd>
      <dd>④返回新对象</dd>
    </dl>
    <p>优点：解决对象类型识别的问题。</p>
    <p>缺点：如果构造函数中有引用类型如方法，会存在内存浪费问题。由于方法属于引用数据类型，所以会在内存中为其单独开辟一块空间进行存储，这样当new多个对象实例时就会开辟多个内存空间去存储一个相同的方法，不但浪费内存，还拉低执行效率（另外开辟空间也要时间）。</p>
    <dl>
      <dt>构造函数的属性和方法又被称为成员，成员分为两类：静态成员和实例成员。</dt>
      <dd>实例成员：构造函数内部通过this添加的成员，只能通过实例化的对象访问，如上面的 person1.sayName()；使用Person.sayName()会报错,not function。<em>实例成员在每个实例中是单独存储的，即使是引用类型的数据也不会共享。原型链上的成员是共享的。</em></dd>
      <dd>静态成员：在构造函数本身添加的成员。如Person.hobbies='打游戏'；静态成员只能通过构造函数本身来访问。如 console.log(Person.hobbies);使用console.log(person1.hobbies)结果为undefined</dd>
    </dl>
    <p>为了解决构造函数每次用 new 创建一个对象，就会重新将实例的方法创建一次的问题，可以改进如下：</p>
    <pre>{{ `
function saySex () {
  console.log(\`function saySex -> 我的性别是$\{this.sex\}\`)
}   
` }}</pre>
    <p>改进之后，sayName() 为全局方法，只需创建一次即可所有实例对象共享。但是问题又来了，在全局作用域中定义一个仅供特定对象使用的方法有点不太好，而且如果对象需要定义很多方法，那么就要定义很多个全局函数。可以通过 原型 来解决上面问题。</p>
  </div>
</template>
<script>
export default {
  mounted () {
    this.Animal()
  },
  methods: {
    Animal () {
      // 这样能保证所有实例化的动物使用同一个saySex方法
      function saySex () {
        console.log(`function saySex -> 我的性别是${ this.sex }`)
      }     
      function Animal (name,sex) {
        this.name = name
        this.sex = sex
        this.foods = ['香蕉']
        // 实例化的动物各自单独使用一个saySex方法，会造成内存浪费
        // this.saySex = function () {
        //   console.log(`this.saySex -> 我的性别是${ this.sex }`)
        // }
        this.saySex = saySex
      }

      let monkey = new Animal('猴子','母')
      let dog = new Animal('狗','公')

      console.group('%c构造函数:','color:green')
      console.log('monkey:',monkey)
      console.log('monkey.color:',monkey.color)
      monkey.saySex()
      console.log('monkey.constructor === Animal:',monkey.constructor === Animal)
      console.log('monkey.constructor === Object:',monkey.constructor === Object)
      console.log('monkey instanceof Animal:',monkey instanceof Animal)
      console.log('monkey instanceof Object:',monkey instanceof Object)
      // console.log('Object.prototype.toString.call(monkey):',Object.prototype.toString.call(monkey))
      // console.log('Object.prototype.toString.bind(monkey)():',Object.prototype.toString.bind(monkey)())
      // console.log('Object.prototype.toString.apply(monkey):',Object.prototype.toString.apply(monkey))

      monkey.foods.push('苹果')
      console.log('monkey:',monkey)
      console.log('dog:',dog) 
      console.log('monkey.foods:',monkey.foods)
      console.log('dog.foods:',dog.foods)
      console.log('monkey.foods === dog.foods:',monkey.foods === dog.foods)
      console.log('monkey.saySex === dog.saySex:',monkey.saySex === dog.saySex)
      console.log('\n')

      console.log('构造函数-prototype:')
      Animal.prototype.sayName = function () {
        console.log(this)
        console.log(`我的姓名是${ this.name }`)
      }
      Animal.prototype.color = 'white'

      console.log('dog.color:',dog.color)
      console.log('monkey.color:',monkey.color)
      console.log('monkey.sayName===dog.sayName:',monkey.sayName === dog.sayName)

      dog.color = 'black'
      console.log('dog.color:',dog.color)
      console.log('monkey.color:',monkey.color)
      delete dog.color
      console.log('dog.color:',dog.color)

      console.log('dog.__proto__ === Animal.prototype:',dog.__proto__ === Animal.prototype)
      console.log('dog.__proto__.__proto__ === Object.prototype:',dog.__proto__.__proto__ === Object.prototype)
      console.log('dog.__proto__.__proto__.__proto__ === null:',dog.__proto__.__proto__.__proto__ === null)
      console.log('dog.prototype:',dog.prototype)
      console.groupEnd()
    },
  }
}
</script>
