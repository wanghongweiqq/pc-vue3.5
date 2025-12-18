<template>
  <div class="pg-vuex">
    <div class="ly-box">
      <cp-crumbs />
      <div class="content">
        <h2><strong>deep</strong>copy</h2>
        <h3>JSON.parse(JSON.stringify(xxx))的弊端</h3>
        <pre>
//弊端1：如果obj里面有时间对象，时间将只是字符串的形式，而不是对象的形式
const test1 = {
  a: [new Date(1536627600000), new Date(1540047600000)]
};
const copy1= JSON.parse(JSON.stringify(test1))
console.log(copy1)  //{a:["2018-09-11T01:00:00.000Z", "2018-10-20T15:00:00.000Z"]}

//弊端2：如果obj里有RegExp(正则表达式的缩写)、Error对象，则序列化的结果将只得到空对象
let test2 = {
  a:new RegExp('\\w+'),
  b:new Error(1),
};
const copy2= JSON.parse(JSON.stringify(test2))
console.log(copy2)  //{a:{},b:{}}

//弊端3：如果obj里有函数function undefined symbol，则序列化的结果会把属性丢失
const test3 = {
  a: function func() {
    console.log('func')
  },
  b:undefined,
};
const copy3= JSON.parse(JSON.stringify(test3))
console.log(copy3)  //{}//连key值a都没了

//弊端4：如果obj里有NaN、Infinity和-Infinity，则序列化的结果会变成null
const test4 = {
  a: NaN,
  b: Infinity,
};
const copy4= JSON.parse(JSON.stringify(test4))
console.log(copy4)  //{a:null,b:null}

//弊端5：JSON.stringify()只能序列化对象的可枚举的自有属性，例如 如果obj中的对象是有构造函数生成的， 则使用JSON.parse(JSON.stringify(obj))深拷贝后，会丢弃对象的constructor
function Person(name) {
  this.name = name;
}
const lisi = new Person('lisi');
const test5 = {
  a: lisi,
};
const copy5= JSON.parse(JSON.stringify(test5))
console.log(test5)  //{a:Person{name:"lisi"}}
console.log(copy5)  //{a:{name:"lisi"}}
          </pre>
        <h3>JSON.parse(JSON.stringify(xxx))的妙用</h3>
        <pre>
//妙用1：判断数组是否包含某对象
let obj1 = [
  {name:'echo'},
  {name:'听风是风'},
  {name:'天子笑'},
],
obj2 = {name:'天子笑'};
//因为数组和对象是引用值不能比较，所以需要序列化一下转成字符串
console.log(JSON.stringify(obj1).indexOf(JSON.stringify(obj2)) !== -1)  //true
console.log(obj1.indexOf(obj2) !== -1)  //false

//妙用2：判断两数组/对象是否相等
let array1 = [1,2,3]
let array2 = [1,2,3]
console.log(JSON.stringify(array1) === JSON.stringify(array2))  //true

//妙用3：让localStorage/sessionStorage可以存储对象,localStorage/sessionStorage默认只能存储字符串
//存
function setLocalStorage(key,val){
  window.localStorage.setItem(key,JSON.stringify(val));
}
//取
function getLocalStorage(key){
  return JSON.parse(window.localStorage.getItem(key));
};
//测试
setLocalStorage('demo',[1,2,3]);
console.log(getLocalStorage('demo'))  //[1,2,3]

//注意1：JSON.stringify()与toString()这两者虽然都可以将目标值转为字符串，但本质上还是有区别的
let array3 = [1,2,3];
console.log(JSON.stringify(array3))  //'[1,2,3]'
console.log(array3.toString())  //1,2,3
          </pre>
        <h3>深拷贝的实现</h3>
        <pre>
  dataType (data) {
    if (data instanceof Element) {
      return 'element'
    }
    if (typeof data === 'symbol') {
      return 'symbol'
    }
    const map = {
      '[object String]': 'string',
      '[object Number]': 'number',
      '[object Boolean]': 'boolean',
      '[object Object]': 'object',
      '[object Array]': 'array',
      '[object Function]': 'function',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
    }
    return map[Object.prototype.toString.call(data)]
  },
  // 数据深拷贝，支持Symbal
  deepCopy (data) {
    let newData = null
    const type = this.dataType(data)
    if(type === 'array' || type === 'object') {
      newData = type === 'array' ? [] : {}
      let proto = [...Object.keys(data), ...Object.getOwnPropertySymbols(data)]
      proto.map((key) => {
        newData[key] = this.deepCopy(data[key])
      })
      return newData
    }else{
      return data
    }
  }
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
  mounted () {
    this.demo()
  },
  methods: {
    demo () {
      let ele = document.querySelector('h2')
      let s = Symbol('s') // ES6 引入Symbol的原因:对象属性名不重复
      let data0 = {
        a: { x: 1 },
        b: 2,
        c: [3,4,[5,6]],
        d: new Date(1536627600000),
        e: new RegExp('\\w+'),
        f: undefined,
        g: function func () {
          console.log('func')
        },
        h: ele,
        i: [1,2],
        [s]: 'Symbol',
      }
      const deep0 = this.$utils.deepCopy(data0)
      const copy0 = JSON.parse(JSON.stringify(data0))

      console.log('复制：原数据-深拷贝ok-深拷贝JSON')
      console.log(data0) // 在此节点，输出整体显示修改后的数据a: 10（因为后面修改了a属性的值），但具体的属性值还是修改前的{x: 1}
      console.log(deep0)
      console.log(copy0)
      data0.a = 10
      data0.c[2][0] = 50
      // data0.d = new Date(1636647600000)
      // data0.h=11 //data0：h属性修改前还是element,修改后变成11，不影响deep0
      ele.innerHTML = '深拷贝' // data0、deep0修改前后h属性的值都变成element:<h2>1111</h2>
      console.log('修改后：原数据-深拷贝ok-深拷贝JSON')
      console.log(data0)
      console.log(deep0)
      console.log(copy0)
      // 全等于：基本数据类型、new Date 、element 只是判断值是否相等
      console.log(`deep0.b===data0.b //${ deep0.b === data0.b } b=2`) // true 基本数据类型 b=2
      console.log(`deep0.d===data0.d //${ deep0.d === data0.d } d=new Date(1636647600000)`) // true d=new Date(1636647600000) 输出:Tue Sep 11 2018 09:00:00 GMT+0800 (中国标准时间)
      console.log(`deep0.h===data0.h //${ deep0.h === data0.h } h=获取的dom元素`) // true
      console.log(`deep0[s]===data0[s] //${ deep0[s] === data0[s] } Symbol`) // true
      // 全等于：除上面的引用类型数据，不全等
      console.log(`deep0.i===data0.i //${ deep0.i === data0.i } i=[1,2]`) // true
    }
  }
}
</script>
