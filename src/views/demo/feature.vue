<!-- eslint-disable vue/no-v-model-argument -->
<template>
  <div class="pg-feature">
    <cp-crumbs />

    <div class="ly-box">
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
      <div class="content">
        <h2>vue3 实例</h2>
        <p>
          <el-button
            size="small"
            type="primary"
            @click="goodProxy"
          >
            修改对象、数组
          </el-button>
        </p>
        <p>{{ student.name }}：{{ student.sex }}</p>
        <p>{{ books }}</p>
      </div>
      <div class="content">
        <h2>子组件直接修改父组件的属性</h2>
        <p>
          <el-button
            size="small"
            type="primary"
            @click="showImage"
          >
            展示查看大图弹窗
          </el-button>
        </p>

        <CpSeeimages
          v-model:imageShow="isShowImage"
          :image-data="imageData"
        />
        <h3>Vue 3.0+ 使用v-model的形式修改</h3>
        <p>父组件传到子组件的props默认为：modelValue</p>
        <p>子组件触发父组件更新的事件默认为：update:modelValue</p>
        <p>不建议使用默认值，更建议使用具体名称的属性，如：v-model:xxxYyy的形式修改</p>
        <p>v-model:xxxYy 建议使用驼峰，在父组件中可以使用驼峰也可使用短横线, 在子组件中短横线的格式部分场景会有问题，定义属性（eslint报错）、watch中监听属性（监听不到）、模版中使用属性（无法识别）。其实html不区分大小写，js区分大小写）</p>
        <p>其实这是一个语法糖，父组件绑定一个事件：@update:modelValue(具名时为：xxxYyy)</p>
        <h3>Vue 2.0+ 使用xxx-yyy.sync的形式修改</h3>
        <p>父组件传到子组件的props为：xxxYyy</p>
        <p>子组件触发父组件更新的事件默认为：update:xxxYyy</p>
        <p>其实这也是一个语法糖，父组件绑定一个事件：@update:xxxYyy</p>
        <p>另外在该版本中v-model，传递给子组件的属性为：value,事件名称为：input。</p>
      </div>
    </div>
  </div>
</template>
<script>
import CpCrumbs from '@/components/crumbs/'
import CpSeeimages from '@/components/seeimages'

export default {
  components: {
    CpCrumbs,
    CpSeeimages,
  },
  data () {
    return{
      student: {
        name: 'wanghongwei',
      },
      books: ['语文','数学'],
      isShowImage: false,
      imageData: [
        require('@/assets/images/ziyi-2.jpeg'),
        require('@/assets/images/jiayi-4.jpeg'),
      ],
    }
  },
  watch: {
    student: {
      handler (newVal,oldVal) {
        console.log('newVal:', newVal)
        console.log('oldVal:', oldVal)
      },
      // deep: true,
      immediate: true,
    } ,
    books (newVal,oldVal) {
      console.log('newVal:', newVal)
      console.log('oldVal:', oldVal)
    }
  },
  mounted () {
    // this.proxy1()
    // this.proxy2()
    // this.proxy3()
    // this.proxy4()
    // this.proxy5()
    // this.memberStatic()
    // this.memberInstance()
    // this.memberPrototype()
  },
  methods: {
    // 展示查看大图弹窗
    showImage () {
      this.isShowImage = true
    },
    goodProxy () {
      this.student.sex = '男'
      // this.books[2] = '英语'
      this.books.length = 1
      // this.books = ['化学']
      // this.student = {
      //   sex: '男',
      //   name: 'wanghongwei',
      // }
    },
    proxy1 () {
      const sum = (a, b) => {
        return a + b
      }
      let proxy = new Proxy(sum, {
        apply: function (target, thisArg, argumentsList) {
          console.log('argumentsList')
          console.log(argumentsList)
          // argumentsList: 数组形式 [1, 2]
          return argumentsList[0] + argumentsList[1] * 100
        }
      })
      // 正常调用
      console.log(sum(1, 2)) // 3
      // 代理之后调用
      console.log(proxy(1, 2)) // 201
    },
    proxy2 () {
      const target = {
        greet (a, b) {
          return a + b
        }
      }
      const handler = {
        apply: function (target, thisArg, argumentsList) {
          return argumentsList[0] + argumentsList[1] * 100
        }
      }
      const proxy = new Proxy(target.greet, handler)
      console.log(target.greet(1,2)) // 3
      console.log(proxy(1,2)) // 201
    },
    proxy3 () {
      const target = {
        message: 'Hello, world!'
      }
      const handler = {
        get: function (target, prop, receiver) {
          return `Intercepted: ${ Reflect.get(target, prop, receiver) }`
        }
      }
      const proxy = new Proxy(target, handler)
      console.log(target.message) // Hello, world!
      console.log(proxy.message) // 输出：Intercepted: Hello, world!
    },
    proxy4 () {
      const target = {
        greet () {
          return 'Hello'
        }
      }
      const handler = {
        apply: function (target, thisArg, argumentsList) {
          return `${ Reflect.apply(target, thisArg, argumentsList) } World!`
        }
      }
      const proxy = new Proxy(target.greet, handler)
      console.log(2)
      console.log(proxy()) // 输出：Hello World!
    },
    proxy5 () {
      class Person {
        constructor (firstName, lastName) {
          this.firstName = firstName
          this.lastName = lastName
        }
        fullName () {
          return `${ this.firstName } ${ this.lastName }`
        }
        get fullName2 () {
          return `${ this.firstName } ${ this.lastName }`
        }
      }

      let args = ['小帅', '的编程笔记']

      let xiaoshuai = Reflect.construct(
        Person,
        args
      )

      console.log(xiaoshuai instanceof Person)// true
      console.log(xiaoshuai.fullName()) // 小帅 的编程笔记
      console.log(xiaoshuai.fullName2) // 小帅 的编程笔记
    },
    // 静态成员：静态成员的属性和方法不能通过实例对象调用，只能通过类的本身调用
    memberStatic () {
      class Person {
        // static sex = '男'
        // 在vue中直接使用static定义静态成员会报错。JavaScript 的 static 仅用于类（class）内部定义静态成员，而 Vue3 的组件通常通过对象或函数式语法（如 setup）声明，‌未采用类继承机制‌‌。因此在非类结构中直接使用 static 会导致语法错误。Vue3 推崇组合式 API（Composition API），通过 setup 函数实现逻辑复用和响应式数据管理，‌刻意避免依赖类实例的属性和方法‌（包括静态成员）‌。使用 <script setup> 时，代码默认被视为 ES 模块，‌不允许混合使用 export default 和类声明语法‌，进一步限制 static 的使用场景‌
      }
      Person.sex = '男' // 静态属性 sex
      Person.sayName = function () { // 静态方法 sayName
        console.log('Hello World')
      }

      console.log(Person.sex) // 男
      Person.sayName() // Hello World

      var person = new Person()
      console.log(person.sex) // undefined
      // person.sayName() // Uncaught TypeError: person.sayName is not a function
    },
    // 实例成员：实例成员的属性和方法不能通过类本身调用，只能通过实例化对象调用
    memberInstance () {
      function Person (name) {
        this.name1 = name || '默认实例名字' // 实例属性 name1
        this.say1 = function () {} // 实例方法 say1()
      }

      let person1 = new Person('小明')
      // 实例属性 age
      person1.name1 = '小丽'
      person1.age = 14
      // 实例方法 say2()
      person1.say2 = function () {
        console.log('Hello World')
      }

      // 实例成员的属性和方法不能通过类本身调用/
      console.log(Person.name) // Person，构造函数/类都有一个默认属性name，值为构造函数的名字
      console.log(person1.name1) // 小丽 > 小明 > 默认实例名字，值取值最后声明的值，this.name1最先声明
      console.log(Person.name1) // undefined
      // Person.say2() // Uncaught TypeError: Person.sayName is not a function

      let person2 = new Person()
      console.log(person1.age) // 14
      console.log(person2.age) // undefined
    },
    // 原型成员：类的原型的属性和方法也不能通过类本身调用，只能通过实例化对象调用
    memberPrototype () {
      function Person (name) {
        this.name = name // 实例属性 name
        this.say = () => '实例方法 this.say' // 实例方法 say()
      }
      Person.prototype.name = '王十八' // 声明原型属性
      Person.prototype.age = '18' // 声明原型属性
      Person.prototype.say = () => '构造函数的原型方法 Person.prototype.say' // 声明原型方法

      // 类的原型的属性和方法不能通过类本身调用，
      console.log(Person.age) // undefined
      // Person.say() // Uncaught TypeError: Person.say is not a function

      let person = new Person('小明')
      person.say = () => '实例方法 person.say'
      console.log(person.name) // 小明  new Person(name) 中的name参数赋值为什么此处展示什么，即使 为null/''，此处也不会是王十八，因为它认为实例含有实例属性name，这样就不会去构造函数的原型链上去查找
      console.log(person.age) // 18   可以使用实例对象调用原型属性，实际是 person.__proto__.age
      console.log(person.say()) // 实例优先调用实例成员，person.say > this.say，不存在时会调用构造函数的原型方法Person.prototype.say，实际是 person.__proto__.say()
    },
  }
}
</script>
