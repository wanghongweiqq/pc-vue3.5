<template>
  <div class="content">
    <h2>创建数组的方法</h2>
    <h3>new Array(n, ……)</h3>
    <p>n为单数字参数时创建指定长度的空数组（可能引发歧义）。该空数组称为稀疏数组，会导致相应项在数组的遍历方法中map、forEach循环不进行</p>
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
    <h3>Array.from( )（ES6引入），推荐</h3>
    <p>将类数组对象（如字符串、arguments）或可迭代对象（如 Set）转换为数组，支持映射函数处理元素</p>
    <pre>
let arr0 = Array.from({ length: 3 },() => 2) // [2, 2, 2] 没有第二个参数时，值为undefined，不会像稀疏数组那样影响循环遍历
let arr1 = Array.from('hello'); // ['h', 'e', 'l', 'l', 'o']
let arr2 = Array.from([1, 2, 3], x => x * 2); // [2, 4, 6]
</pre>
    <h3>Array.of( )（ES6引入）</h3>
    <p>所有参数均作为<em>数组元素</em>，解决new Array(n)的歧义</p>
    <pre>let arr = Array.of(5); // [5]，而非长度为5的空数组</pre>
    <h3>其他形式 </h3>
    <p>数组字面量，简洁且性能最佳，各元素已知的情况下最常用：let arr = [1, 2, 3]; </p>
    <p>扩展运算符：let arr2 = [...[1, 2], 3]; // [1, 2, 3] </p>
  </div>
</template>
<script setup>
const testarraySparse = () => {
  const arraySparse = new Array(3)
  console.log('greenM','稀疏数组',arraySparse)
  console.log('正常输出：稀疏数组',arraySparse)
  for(let i = 0; i < arraySparse.length; i++) {
    console.log('for循环:',i,arraySparse[i])
  }
  for(let item of arraySparse) {
    console.log('for of:',item)
  }
  for(let [index,item] of arraySparse.entries()) {
    console.log('entries:',index,item)
  }
  console.log('redM','forEach/map/filter/reduce/some等 跳过空位')
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

  const arrayNull = ['a', null , undefined]
  console.log('greenM6','null数组',arrayNull)
  console.log('正常输出：null数组',arrayNull)
  for(let i = 0; i < arrayNull.length; i++) {
    console.log('for循环:',i,arrayNull[i])
  }
  for(let item of arrayNull) {
    console.log('for of:',item)
  }
  for(let [index,item] of arrayNull.entries()) {
    console.log('entries:',index,item)
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
  arrayNull.reduce((acc,item) => {
    acc += String(item)
    console.log('reduce:',acc,item)
    return acc
  },'')
}
</script>
