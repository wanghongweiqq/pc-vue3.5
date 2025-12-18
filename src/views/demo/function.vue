<template>
  <div class="pg-func">
    <div class="ly-box">
      <CpCrumbs />
      <div class="content">
        <h2>工厂函数</h2>
        <p>工厂函数。顾名思义，就好比一个工厂一样，可以批量制造某种类型的东西。其实说白了就是封装了个方法减少重复工作</p>
        <pre>
function animal (name,sex) {
  let obj = new Object()  //引用原始对象，也可以let obj = {}
  obj.name = name
  obj.sex = sex
  obj.saySex = function () {
      console.log(`我的性别是${this.sex}`)  //this引用对象自身
  }
  return obj
}
let monkey = animal('猴子','母')
console.log('工厂函数:')
monkey.saySex() //我的性别是母
console.log(monkey instanceof animal) // false 判断实例是否属于某个原型用instanceof
console.log(monkey instanceof Object) // true
          </pre>
        <p>这样写主要是为了解决需要创建大量有属性重叠的对象，如果每个都new一下，然后逐一添加属性。这也是个累人的活。通过上面的代码中，我们声明了一个animal方法，此方法可批量制造动物。这样每次只需要简单的一行代码就可以搞定一个动物的创建。</p>
        <p>方便虽然方便，但是还是有缺点。就是每次新建的时候都需要在内部创建一个对象，然后进行一系列操作，最后返回。也就是说创建十次，那么就会创建十次全新的对象，然后返回并赋值。这样创建的十个对象在代码间的关系是没有的，换句话说就是我们都是动物，但是谁都不知道我们我们产自哪里，只知道出自Object。</p>
      </div>
      <div class="content">
        <h2>构造函数</h2>
        <p>应对某些场景，工厂函数并不能满足我们，如：我需要判断树是不是动物类型,你会发现你并没办法。只能知道他是Object。这时候构造函数就出现了。</p>
        <p>跟工厂函数很像，只是没有了创建对象和return，并且都用this添加属性。声明新对象的时候通过new关键字。这样做的好处是，新建的对象间是有关系的，我们可以看到，他的类型既是animal也是Object。就好比你是你爸爸的后代，但同时也是你爷爷的后代。</p>
        <pre>
注释行是伪代码，表示在 new 关键创建实例时，JS 背后帮我们做的事情。
function Animal (name,sex) { //用大写首字母对构造器函数命名是个好习惯
  // this = {};
  // this.__proto__ = Person.prototype
  this.name = name
  this.sex = sex
  this.saySex = function () {
    console.log(`我的性别是${this.sex}`) //内部使用this关键字给对象添加成员
  }
  // return this
}
let monkey = new Animal('猴子','母') //使用new关键字调用对象构造函数
console.log('构造函数:')
monkey.saySex()  //我的性别是母
console.log(monkey instanceof Animal) // true 判断实例是否属于某个原型用instanceof
console.log(monkey instanceof Object) // true
          </pre>
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
        <p>优点：解决对象类型识别的问题</p>
        <p>缺点：如果构造函数中有方法，会存在内存浪费问题。由于方法属于引用数据类型，所以会在内存中为其单独开辟一块空间进行存储，这样当new多个对象实例时就会开辟多个内存空间去存储一个相同的方法，不但浪费内存，还拉低执行效率（另外开辟空间也要时间）。</p>

        <dl>
          <dt>构造函数的属性和方法又被称为成员，成员分为两类：静态成员和实例成员。</dt>
          <dd>实例成员：构造函数内部通过this添加的成员，只能通过实例化的对象访问，如上面的 person1.sayName()；使用Person.sayName()会报错,not function。</dd>
          <dd>静态成员：在构造函数本身添加的成员。如Person.hobbies=‘打游戏’；静态成员只能通过构造函数本身来访问。如 console.log(Person.hobbies);使用console.log(person1.hobbies)结果为undefined</dd>
        </dl>
        <p>为了解决构造函数每次用 new 创建一个对象，就会重新将实例的方法创建一次的问题，可以改进如下：</p>
        <pre>
function Person(name) {
  this.name = name;
  this.sayName = sayName;
}
function sayName() {
  console.log(this.name);
}
let person1 = new Person('ooxx');
person1.sayName();  //ooxx
let person2 = new Person('ox');
console.log(person1.sayName===person2.sayName)  //true
          </pre>
        <p>改进之后，sayName() 为全局方法，只需创建一次即可所有实例对象共享。但是问题又来了，在全局作用域中定义一个仅供特定对象使用的方法有点不太好，而且如果对象需要定义很多方法，那么就要定义很多个全局函数。可以通过 原型 来解决上面问题。</p>
      </div>
      <div class="content">
        <h2>原型</h2>
        <p>原型： 每个函数都有 prototype 属性，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法。使用原型对象的好处就是可以让所有对象实例共享它所包含的属性和方法。</p>
        <pre>
function Person () {}
Person.prototype.name = ['a','b']
Person.prototype.year = 0,
Person.prototype.sayName = function () {
  console.log(this.name)
}
// 另一种写法
// Person.prototype = {
//   name: ['a','b'],
//   year: 0,
//   sayName: function () {
//     console.log(this.name)
//   }
// }
let person1 = new Person()
console.log('person1')
console.log(person1)
console.log( person1.name)// ['a','b']

person1.name.push(1) // 先去查找实例属性name，发现没有去prototype查找，找到后改变其值
// person1.name = ['a','b',1] // 含有=，操作的是实例属性，相当于新增（更新）一个name的实例属性，原型name没有被改变

console.log(person1)
console.log(person1.name) // ['a','b',1]

let person2 = new Person()
console.log('person2')
console.log(person2)
console.log( person2.name)// ['a','b',1]
console.log(person1.sayName === person2.sayName)		//true
    </pre>
        <p>注意：若在实例中添加与原型相同的属性，则会屏蔽原型的属性。</p>
        <p>原型优点：使用原型对象的好处是可以让所有对象实例共享它所包含的属性和方法。</p>
        <p>原型存在的致命问题： 不能像构造函数一样传递初始化参数，所有实例在默认情况下都将取得相同的属性值。也就是说所有实例共享属性，但是对于包含引用类型的属性来说，是致命的。举例如下</p>
        <p>构造函数的属性值是和js的数据类型一直，基本数据类型只要值相同就相等，引用数据类型必定不相等（除非后来人为指向同一个引用地址）</p>
        <p>原型上的属性的值是共用的，一个实例非“=”操作改变了其值（一般引用类型才有这种操作，如数组的push），其他实例的原型的该属性也会受到影响，使用"="赋值，这相当于新增/更新实例的属性，对原型没影响</p>
        <h2>最后总结:原型模式结合构造函数的混合模式</h2>
        <p>混合模式中构造函数模式用于定义实例属性和引用属性，而原型模式用于定义方法和共享属性。 每个实例都会有自己的一份实例属性，但同时又共享方法，最大限度的节省了内存。另外这种模式还支持传递初始数据，使用最广。</p>
        <img src="@/assets/images/prototype.png">
        <h2>动态原型模式</h2>
        <p>动态原型模式把所有信息都封装在了构造函数中，在构造函数中初始化原型（保留了同时使用构造函数和原型的优点）。可以通过检查某个应该存在的方法是否有效，来决定是否需要初始化原型。</p>
        <pre>
function Person(name){
  this.name = name;
  if (typeof this.sayName != "function"){//只在 sayName() 不存在的情况下，才会将它添加到原型中。此后，原型已经修改完毕，直接调用就可以了。
    Person.prototype.sayName = function(){
      console.log(this.name);
    }
  }
}
let person1 = new Person('ooxx');
person1.sayName();
          </pre>
      </div>
    </div>
  </div>
</template>
<script>
import CpCrumbs from '@/components/crumbs/'

export default {
  components: {
    CpCrumbs,
  },
  data () {
    return{
      a: 1
    }
  },
  mounted () {
    // this.animal()
    this.Animal()
    // this.myPrototype()
  },
  methods: {
    animal () {
      function animal (name,sex) {
        let obj = new Object()
        obj.name = name
        obj.sex = sex
        obj.saySex = function () {
          console.log(this)
          console.log(`我的性别是${ this.sex }`) // this引用对象自身
        }
        return obj
      }
      let monkey = animal('猴子','母')
      let monkey2 = animal('猴子','母')

      console.log('工厂函数:')
      console.log(monkey)
      console.log(monkey === monkey2)// 两个不同的实例，所以不同
      console.log(monkey.sex === monkey2.sex)
      monkey.saySex() // 我的性别是母
      console.log(monkey.constructor === animal) // false
      console.log(monkey.constructor === Object) // true
      console.log(monkey instanceof animal) // false
      console.log(monkey instanceof Object) // true
      console.log(Object.prototype.toString.call(monkey)) // '[object Object]'
      // animal.prototype.sayName = function () { // 工厂函数没有prototype，构造函数才有
      //   console.log(this)
      //   console.log(`我的姓名是${ this.name }`)
      // }
      // monkey.sayName() // 报错：monkey.sayName is not a function，因为工厂函数没有prototype，构造函数才有
      console.log('\n') // true
    },
    Animal () {
      function Animal (name,sex) { // 用大写首字母对构造器函数命名是个好习惯
        this.name = name
        this.sex = sex
        // this.foods = '香蕉'
        this.foods = ['香蕉']
        // this.color = 'red'
        this.saySex = function () {
          console.log(`我的性别是${ this.sex }`) // 内部使用this关键字给对象添加成员
        }
      }
      let monkey = new Animal('猴子','母') // 使用new关键字调用对象构造函数
      console.log('构造函数:')
      console.log(monkey)
      console.log(monkey.color)// undefined,此时monkey的原型上不具有color属性，当下面Animal.prototype.color = 'white' 后才有

      monkey.saySex() // 我的性别是母
      console.log(monkey.constructor === Animal) // true
      console.log(monkey.constructor === Object) // false
      console.log(monkey instanceof Animal) // true  判断实例是否属于某个原型用instanceof
      console.log(monkey instanceof Object) // true
      // 方法重用：call、bind、apply，Object.prototype.toString只能判断到通用的数据类型，如：Number、Object等，不能判断出是哪个构造函数实例化的，如：Animal
      console.log(Object.prototype.toString.call(monkey)) // '[object Object]'
      console.log(Object.prototype.toString.bind(monkey)()) // '[object Object]'
      console.log(Object.prototype.toString.apply(monkey)) // '[object Object]'
      console.log('\n') // 换行

      console.log('构造函数-prototype:')
      Animal.prototype.sayName = function () { // 不要用箭头函数Animal.prototype.sayName = () => { ，this会指到外面,vue的话会是当前vue组件，js的话会是window对象
        console.log(this)
        console.log(`我的姓名是${ this.name }`)
      }
      Animal.prototype.setName = function (name) {
        this.name = name
      }
      Animal.prototype.color = 'white' // 虽然原型是在实例monkey下面执行的，但上面实例monkey仍具有该原型的属性，及原型不分前后顺序
      let dog = new Animal('狗','公') // 使用new关键字调用对象构造函数
      console.log(monkey.color) // white
      console.log(dog.color) // white

      // dog.setName('齐天大圣')
      dog.color = 'black'
      console.log(dog.color) // black
      console.log(monkey.color) // white
      delete dog.color
      console.log(dog.color)// white

      // let dogs = new dog('狗s','公s') // 报错： dog is not a constructor"
      // console.log(dogs)

      console.log(dog.__proto__ === Animal.prototype) // true
      console.log(dog.__proto__.__proto__ === Object.prototype) // true
      console.log(dog.__proto__.__proto__.__proto__ === null) // true
      // dog.prototype.sayName = function () { // 报错： Cannot set property 'sayName' of undefined"
      //   console.log(`我的名字是${ this.name }`)
      // }
      console.log(dog.prototype) // undefined  只有函数才有prototype，实例只能继承函数的原型，不能自己添加原型
      // let cat = Animal('猫','公')
      // console.log(window)
      // console.log(cat) //undefined 构造函数的属性会绑定到window上

      // 构造函数的属性值是和js的数据类型一直，基本数据类型只要值相同就相等，引用数据类型必定不相等（除非后来人为指向同一个引用地址）
      // 原型上的属性的值是共用的，一个实例改变了其值，其他实例也会受到影响
      monkey.foods.push('苹果')
      console.log(monkey) // {name: "猴子", sex: "母", foods: Array(2), saySex: ƒ}
      console.log(dog) // {name: "狗", sex: "公", foods: Array(1), saySex: ƒ}
      console.log(monkey.foods ) // ["香蕉", "苹果"]
      console.log(dog.foods) // ["香蕉"]
      console.log(monkey.foods === dog.foods) // false 引用类型的数据，分别分配的内存存储的数据
    },
    myPrototype () {
      function Person () {}
      Person.prototype.name = ['a','b']
      Person.prototype.year = 0,
      Person.prototype.sayName = function () {
        console.log(this.name)
      }
      // 另一种写法
      // Person.prototype = {
      //   name: ['a','b'],
      //   year: 0,
      //   sayName: function () {
      //     console.log(this.name)
      //   }
      // }
      let person1 = new Person()
      console.log('person1')
      console.log(person1)
      console.log(person1.__proto__)
      console.log(person1.__proto__.constructor)
      console.log( person1.name)// ['a','b']

      person1.name.push(1) // 先去查找实例属性name，发现没有去prototype查找，找到后改变其值
      // person1.name = ['a','b',1] // 含有=，操作的是实例属性，相当于新增（更新）一个name的实例属性，原型name没有被改变

      console.log(person1)
      console.log(person1.name) // ['a','b',1]
      console.log('\n')

      let person2 = new Person()
      console.log('person2')
      console.log(person2)
      console.log( person2.name)//  person1.name.push(1): ['a','b',1]； person1.name = ['a','b',1]: ['a','b']
      console.log('\n')
    }
  }
}
</script>
