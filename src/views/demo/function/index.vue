<template>
  <div class="pg-func">
    <CpCrumbs />
    <el-tabs v-model="activeTab">
      <el-tab-pane
        label="工厂函数"
        name="factory"
      >
        <FunctionFactory />
      </el-tab-pane>
      <el-tab-pane
        label="构造函数"
        name="constructor"
      >
        <FunctionConstructor />
      </el-tab-pane>
      <el-tab-pane
        label="原型"
        name="prototype"
      >
        <FunctionPrototype />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import CpCrumbs from '@/components/crumbs/'
import FunctionFactory from './function-factory'
import FunctionConstructor from './function-constructor'
import FunctionPrototype from './function-prototype'

export default {
  components: {
    CpCrumbs,
    FunctionFactory,
    FunctionConstructor,
    FunctionPrototype,
  },
  data () {
    return{
      activeTab: 'factory',
      a: 1
    }
  },
  mounted () {
    this.Animal()
  },
  methods: {
    animal () {
      function animal (name,sex) {
        let obj = new Object()
        obj.name = name
        obj.sex = sex
        obj.saySex = function () {
          console.log(this)
          console.log(`我的性别是${ this.sex }`)
        }
        return obj
      }
      let monkey = animal('猴子','母')
      let monkey2 = animal('猴子','母')

      console.log('工厂函数:')
      console.log(monkey)
      console.log(monkey === monkey2)
      console.log(monkey.sex === monkey2.sex)
      monkey.saySex()
      console.log(monkey.constructor === animal)
      console.log(monkey.constructor === Object)
      console.log(monkey instanceof animal)
      console.log(monkey instanceof Object)
      console.log(Object.prototype.toString.call(monkey))
      console.log('\n')
    },
    Animal () {
      function Animal (name,sex) {
        this.name = name
        this.sex = sex
        this.foods = ['香蕉']
        this.saySex = function () {
          console.log(`我的性别是${ this.sex }`)
        }
      }
      let monkey = new Animal('猴子','母')
      console.log('构造函数:')
      console.log(monkey)
      console.log(monkey.color)
      monkey.saySex()
      console.log(monkey.constructor === Animal)
      console.log(monkey.constructor === Object)
      console.log(monkey instanceof Animal)
      console.log(monkey instanceof Object)
      console.log(Object.prototype.toString.call(monkey))
      console.log(Object.prototype.toString.bind(monkey)())
      console.log(Object.prototype.toString.apply(monkey))
      console.log('\n')

      console.log('构造函数-prototype:')
      Animal.prototype.sayName = function () {
        console.log(this)
        console.log(`我的姓名是${ this.name }`)
      }
      Animal.prototype.setName = function (name) {
        this.name = name
      }
      Animal.prototype.color = 'white'
      let dog = new Animal('狗','公')
      console.log(monkey.color)
      console.log(dog.color)

      dog.color = 'black'
      console.log(dog.color)
      console.log(monkey.color)
      delete dog.color
      console.log(dog.color)

      console.log(dog.__proto__ === Animal.prototype)
      console.log(dog.__proto__.__proto__ === Object.prototype)
      console.log(dog.__proto__.__proto__.__proto__ === null)
      console.log(dog.prototype)

      monkey.foods.push('苹果')
      console.log(monkey)
      console.log(dog)
      console.log(monkey.foods)
      console.log(dog.foods)
      console.log(monkey.foods === dog.foods)
    },
    myPrototype () {
      function Person () {}
      Person.prototype.name = ['a','b']
      Person.prototype.year = 0,
      Person.prototype.sayName = function () {
        console.log(this.name)
      }
      let person1 = new Person()
      console.log('person1')
      console.log(person1)
      console.log(person1.__proto__)
      console.log(person1.__proto__.constructor)
      console.log( person1.name)

      person1.name.push(1)

      console.log(person1)
      console.log(person1.name)
      console.log('\n')

      let person2 = new Person()
      console.log('person2')
      console.log(person2)
      console.log( person2.name)
      console.log('\n')
    }
  }
}
</script>
