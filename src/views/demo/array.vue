<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-04-10 16:49:57
 * @Description: 数组的操作
 * @FilePath: /vue3.0/src/views/demo/array.vue
-->
<template>
  <div class="pg-array">
    <CpCrumbs />

    <div class="content">
      <h2>创建数组的方法</h2>
      <h3>new Array(n, ……)</h3>
      <p>n为单数字参数时创建指定长度的空数组（可能引发歧义）。该空数组称为稀疏数组，会导致相应项在数组的遍历方法中map、for循环不进行</p>
      <p>n为多参数时，参数作为数组元素。</p>
      <p>Array静态方法fill，可以用来填充元素：new Array(3).fill(1)</p>
      <pre>
let arr0 = new Array(3) //[空属性 × 3]
let arr1 = new Array(1,2,3) //[1, 2, 3]
let arr2 = new Array(3).fill(1) // [1, 1, 1]
</pre>
      <p>在JavaScript中，稀疏数组（Sparse Array）是指包含空位（empty slots）的数组，这些空位既不是undefined也不是null，而是未被赋值的索引位置。稀疏数组在使用map()和for循环时可能引发一些意料之外的行为</p>
      <h4>空位与undefined的区别</h4>
      <p>空位是未被初始化的索引（如new Array(3)生成[empty × 3]），['a', ,'c']数组的第2项也是空位。</p>
      <p>显式赋值为undefined的项不是空位，数组是密集数组（如[undefined, undefined, undefined]）。</p>
      <p>空位在遍历时有2中情况，可能被跳过，而undefined会被视为有效值处理，不会被跳过。</p>
      <p>1、for循环 / for of / entries 处理空位，空位返回 undefined</p>
      <p>2、forEach / map / filter / reduce / some等会跳过空位，执行下一项</p>
      <h4>性能影响</h4>
      <p>稀疏数组因空位需要额外判断，遍历速度通常比密集数组慢，尤其在大型数组中更明显</p>
      <p>
        <el-button
          size="small"
          type="primary"
          @click="testarraySparse"
        >
          稀疏数组的遍历
        </el-button>
      </p>
      <h3>Array.from( )（ES6引入）</h3>
      <p>将类数组对象（如字符串、arguments）或可迭代对象（如 Set）转换为数组，支持映射函数处理元素</p>
      <pre>
let arr0 = Array.from({ length: 3 },() => 2) // [2, 2, 2] 没有第二个参数时，值为undefined，不会像稀疏数组那样影响循环遍历
let arr1 = Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']
let arr2 = Array.from([1, 2, 3], x => x * 2); // [2, 4, 6]
</pre>

      <h3>Array.of( )（ES6引入）</h3>
      <p>所有参数均作为数组元素，解决new Array(n)的歧义</p>
      <pre>let arr = Array.of(5); // [5]，而非长度为5的空数组</pre>

      <h3>其他形式 </h3>
      <p>数组字面量，简洁且性能最佳，各元素已知的情况下最常用：let arr = [1, 2, 3]; </p>
      <p>扩展运算符：let arr2 = [...[1, 2], 3]; // [1, 2, 3] </p>
    </div>

    <div class="content">
      <h2>返回新数组的方法</h2>
      <p>最新返回新数组的方法：toSorted / toReversed / toSpliced / with</p>
      <p>老方法有：filter / map / concat / 解构</p>
      <p>with(index, value) 替换数组中指定索引位置的元素，并返回一个包含此更改的新数组，index支持负数，一次只能替换一个值。</p>
      <pre>
const array1 = [2,5,41,11,8,3]
const array2 = array1.toSorted((a,b) => a - b)
const array3 = array1.toReversed()
const array4 = array1.toSpliced(1,1,100,'c')
const array5 = array1.with(0,'a')
</pre>
    </div>

    <div class="content">
      <h2>循环中动态改变数组</h2>
      <p>主要是比较：for循环、for of、forEach</p>
      <pre>
let arr = [1,2,3,4]
// 数组用for of循环支持动态改变，i会一直按索引递增的形式遍历，不会说数组改变从第1个重新循环，i上限是新数组的长度，i对应的内容也是按最新的数据项
for(let i = 0; i &lt; arr.length; i++) {
  console.log('arr',arr,arr.length)
  console.log('数组索引:',i, ' 值:',arr[i])
  // if(arr[i] === 4) { arr.push(4) }
  if(arr[i] === 4) { arr.unshift(7) }
  if(arr.length > 10) break
}

for(let [i,item] of arr.entries()) {
  console.log('arr',arr,arr.length)
  console.log('数组索引:',i, ' 值:',item)
  // if(i === 4) { arr.push(4) }
  if(item === 4) { arr.unshift(7) }
  if(arr.length > 10) break
}
// 数组用forEach循环不会动态改变，i只会按初始状态执行，先拿到数组长度，然后这个值就不会改变，即使后面数组动态添加了也不会改变循环的次数，但i对应的内容是按最新的数据项
arr.forEach((item,i) => {
  console.log('arr',arr,arr.length)
  console.log(i,item)
  // if(item === 4) { arr.push(4) }
  // if(item === 4) { arr.unshift(7) }
  if(item === 1) { arr.splice(1,0,1) }

})
console.log('最终arr',arr,arr.length)
</pre>
      <p>
        <el-button
          size="small"
          type="primary"
          @click="arrayLoopFor"
        >
          for循环中动态改变数组
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="arrayLoopForOf"
        >
          for of循环中动态改变数组
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="arrayLoopForEach"
        >
          forEach循环中动态改变数组
        </el-button>
      </p>
    </div>

    <div class="content">
      <h2>类数组和可迭代对象</h2>
      <p>类数组对象和可迭代对象是两种与数组相似但各有特点的数据结构。理解它们的区别和联系，对于处理 DOM、函数参数等场景非常有帮助。</p>
      <table class="table">
        <tr>
          <th width="120">
            特性
          </th>
          <th width="400">
            类数组对象 (Array-like)
          </th>
          <th width="400">
            可迭代对象 (Iterable)
          </th>
        </tr>
        <tr>
          <td>核心定义</td>
          <td>具有数字索引和 length属性的对象</td>
          <td>实现了 Symbol.iterator方法的对象</td>
        </tr>
        <tr>
          <td>能否用 for循环 / for...of遍历</td>
          <td>一般不能（除非同时是可迭代对象）</td>
          <td>可以</td>
        </tr>
        <tr>
          <td>能否用 map、forEach遍历</td>
          <td>不能（即使是可迭代对象也不能）</td>
          <td>一般不可以（除了数组可以，字符串等都不可以）</td>
        </tr>
        <tr>
          <td>常见例子</td>
          <td>arguments对象、NodeList、HTMLCollection</td>
          <td>数组、字符串、Map、Set</td>
        </tr>
        <tr>
          <td>转换为真正数组的方法</td>
          <td>
            Array.from(arrayLike)<br>
            Array.prototype.slice.call(arrayLike)
          </td>
          <td>
            Array.from(iterable)<br>
            [...iterable](扩展运算符)
          </td>
        </tr>
        <tr>
          <td>判断方法</td>
          <td>typeof arrayLike.length === 'number' && arrayLike[0] !== undefined</td>
          <td>typeof arr[Symbol.iterator] === 'function'</td>
        </tr>
      </table>

      <h3>类数组 (Array-like)</h3>
      <p>以下是一些常见的类数组对象：</p>

      <table class="table">
        <tbody>
          <tr>
            <th>常见类数组对象</th>
            <th>描述</th>
            <th>是否可迭代</th>
            <th>是否活的 (Live)</th>
          </tr>
          <tr>
            <td>arguments</td>
            <td>函数内部包含所有实参的对象</td>
            <td>视情况而定，一般可以</td>
            <td>否</td>
          </tr>
          <tr>
            <td>NodeList</td>
            <td>如 document.querySelectorAll的返回结果</td>
            <td>是</td>
            <td>部分是</td>
          </tr>
          <tr>
            <td>HTMLCollection</td>
            <td>如 document.getElementsByTagName的返回结果</td>
            <td>否</td>
            <td>是</td>
          </tr>
          <tr>
            <td>String</td>
            <td>字符串</td>
            <td>是</td>
            <td>否</td>
          </tr>
        </tbody>
      </table>

      <h3>可迭代对象 (Iterable)</h3>
      <p>当你想使用数组的丰富方法（如 map, filter等）时，转换为真正的数组是最佳实践。推荐使用 Array.from()或扩展运算符 ...，它们代码更简洁，意图更清晰</p>
    </div>

    <div class="content">
      <h2>解构对原数据的影响</h2>
      <pre>
let a = { x: { l: 1 },y: 2 }
let { x,y } = a
// a中原来是引用类型的x，分情况讨论
// x = { m: 2 } // 原数据a不会被改变，相当于给x重新赋值了
x.l = 2 // 原数据a会被改变，和之前的x指向同一个存储地址
// a中原来是基本类型的y，如何改变其值都不会影响a
y = 3
y = { m: 3 }
console.log(a)</pre>
    </div>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import { onMounted } from 'vue'
import CpCrumbs from '@/components/crumbs/'
import utils from '@/assets/js/utils'

const testarraySparse = () => {
  // 稀疏数组
  const arraySparse = new Array(3)
  console.log('greenM','稀疏数组',arraySparse)
  // for循环/for of/entries 处理空位，空位返回 undefined
  for(let i = 0; i < arraySparse.length; i++) {
    console.log('for循环:',i,arraySparse[i])
  }
  for(let item of arraySparse) {
    console.log('for of:',item)
  }
  for(let [index,item] of arraySparse.entries()) {
    console.log('entries:',index,item)
  }
  // forEach/map/filter/reduce/some等 跳过空位，空位返回值不一定
  arraySparse.forEach((item,index) => {
    console.log('forEach:',index,item)
  })
  arraySparse.map((item,index) => {
    console.log('map:',index,item)
  })
  arraySparse.some((item,index) => {
    console.log('some:',index,item)
  })
  arraySparse.reduce((acc,item) => {
    acc += String(item)
    console.log('reduce:',acc,item)
    return acc
  },'')

  // null数组
  const arrayNull = ['a', null , undefined]
  console.log('greenM','null数组',arrayNull)
  for(let i = 0; i < arrayNull.length; i++) {
    console.log('for循环:',i,arrayNull[i])
  }
  for(let item of arrayNull) {
    console.log('for of:',item)
  }
  arrayNull.forEach((item,index) => {
    console.log('forEach:',index,item)
  })
  arrayNull.map((item,index) => {
    console.log('map:',index,item)
  })
  arrayNull.some((item,index) => {
    console.log('some:',index,item)
  })
  // reduce赋初始值的话循环次数=数组的长度，不赋初始值的话循环次数=数组的长度-1，直接拿第一项作为初始值然后从第二项开始循环
  arrayNull.reduce((acc,item) => {
    acc += String(item)
    console.log('reduce:',acc,item)
    return acc
  },'')
}

// 最新返回新数组的方法：toSorted / toReversed / toSpliced / with
const arrayChange = () => {
  const array = [2,5,41,11,8,3]
  const array1 = array.toSorted((a,b) => a - b)
  const array2 = array.toReversed()
  const array3 = array.toSpliced(1,1,100,'c')
  const array4 = array.with(0,'a')
  console.log('array =[2,5,41,11,8,3]')
  console.log('array.toSorted((a,b) => a - b)', array1)
  console.log('array.toReversed()', array2)
  console.log('array.toSpliced(1,1,100,"c")', array3)
  console.log('array.with(0,"a")', array4)
  // 老方法有：filter / map / concat / 解构
}

// 循环中动态改变数组，for循环类似于for of，forEach
const arrayLoopFor = () => {
  let arr = [1,2,3,4]
  // 数组用for of循环支持动态改变，i会一直按索引递增的形式遍历，不会说数组改变从第1个重新循环，i上限是新数组的长度，i对应的内容也是按最新的数据项
  for(let i = 0; i < arr.length; i++) {
    console.log('arr-for',arr,arr.length)
    console.log('数组索引:',i, ' 值:',arr[i])
    // if(arr[i] === 4) { arr.push(4) }
    if(arr[i] === 4) { arr.unshift(7) }
    if(arr.length > 10) break
  }
  console.log('最终arr',arr,arr.length)
}
const arrayLoopForOf = () => {
  let arr = [1,2,3,4]
  // 数组用for of循环支持动态改变，i会一直按索引递增的形式遍历，不会说数组改变从第1个重新循环，i上限是新数组的长度，i对应的内容也是按最新的数据项
  for(let [i,item] of arr.entries()) {
    console.log('arr',arr,arr.length)
    console.log('数组索引:',i, ' 值:',item)
    // if(i === 4) { arr.push(4) }
    if(item === 4) { arr.unshift(7) }
    if(arr.length > 10) break
  }
  console.log('最终arr',arr,arr.length)
}
const arrayLoopForEach = () => {
  let arr = [1,2,3,4]
  // 数组用forEach循环不会动态改变，i只会按初始状态执行，先拿到数组长度，然后这个值就不会改变，即使后面数组动态添加了也不会改变循环的次数，但i对应的内容是按最新的数据项
  arr.forEach((item,i) => {
    console.log('arr-forEach',arr,arr.length)
    console.log('数组索引:',i, ' 值:',item)
    // if(item === 4) { arr.push(4) }
    // if(item === 4) { arr.unshift(7) }
    if(item === 1) { arr.splice(1,0,1) }
  })
  console.log('最终arr',arr,arr.length)
}

const ArrayLikeObject = () => {
  function isArrayLike (obj) {
    if (obj === null || typeof obj !== 'object') return false
    const length = obj.length
    return typeof length === 'number' && length >= 0 && (length === 0 || (length - 1) in obj)
  }
  let arrayLike = { 0: 'a', '1': 'b',b: 'x', length: 2 }
  let string1 = 'abc'
  console.log(string1[1])
  console.log(isArrayLike(arrayLike))
  const arrResult = Array.from(arrayLike)
  console.log(arrResult)
  console.log(Array.isArray(arrayLike)) // 输出 false
}

function jieGou () {
  // console.log('arguments',arguments)
  // for(let item of arguments) {
  //   console.log('item',item)
  // }
  // let aaa = 'abc'
  // for(let i = 0; i < aaa.length; i++) {
  //   console.log('itemi',aaa[i])
  // }
  // aaa.map((item) => {
  //   console.log('item1',item)
  // })
  let obj = { a: { l: 1 }, b: { l: 1 }, c: 3, d: 4 }
  let objCopy = utils.deepCopy(obj)
  let { a, b, c, d } = obj
  // 1、对象obj中属性x的值是引用类型，分情况讨论
  a = { m: 2 } // 1.1、a在栈中的指针指向了堆中一个新的位置，原数据obj不会被改变，相当于给a重新赋值了
  b.l = 2 // 1.2、a在栈中的指针没有改变，原数据obj会被改变，和之前的b指向同一个存储地址
  // 2、对象obj中属性y的值是基本类型，如何改变其值都不会影响对象obj
  c = 'c'
  d = { l: 3 }
  console.log('greenM','原数据：',objCopy)
  console.log('redM','新数据：',obj)
}

onMounted(() => {
  // arrayChange() // 最新返回新数组的方法
  // ArrayLikeObject()
  jieGou(1,2)
})

</script>
