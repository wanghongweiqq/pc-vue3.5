<template>
  <div class="content">
    <h2>循环中动态改变数组</h2>
    <p>主要是比较：for循环、for of、forEach</p>
     <pre>{{ `let arr = [1,2,3,4]
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
console.log('最终arr',arr,arr.length)` }}</pre>
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
</template>
<script setup>
const arrayLoopFor = () => {
  let arr = [1,2,3,4]
  for(let i = 0; i < arr.length; i++) {
    console.log('arr-for',arr,arr.length)
    console.log('数组索引:',i, ' 值:',arr[i])
    if(arr[i] === 4) { arr.unshift(7) }
    if(arr.length > 10) break
  }
  console.log('最终arr',arr,arr.length)
}
const arrayLoopForOf = () => {
  let arr = [1,2,3,4]
  for(let [i,item] of arr.entries()) {
    console.log('arr',arr,arr.length)
    console.log('数组索引:',i, ' 值:',item)
    if(item === 4) { arr.unshift(7) }
    if(arr.length > 10) break
  }
  console.log('最终arr',arr,arr.length)
}
const arrayLoopForEach = () => {
  let arr = [1,2,3,4]
  arr.forEach((item,i) => {
    console.log('arr-forEach',arr,arr.length)
    console.log('数组索引:',i, ' 值:',item)
    if(item === 1) { arr.splice(1,0,1) }
  })
  console.log('最终arr',arr,arr.length)
}
</script>
