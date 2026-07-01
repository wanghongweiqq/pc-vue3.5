<template>
  <div class="content">
    <h2>数组常用方法</h2>
    <h3>返回新数组的方法，并不改变原数组</h3>
    <p>最新返回新数组的方法：toSorted / toReversed / toSpliced / with</p>
    <p>老方法有：filter / map / concat / 解构</p>
    <p>with(index, value) 替换数组中指定索引位置的元素，并返回一个包含此更改的新数组，index支持负数，一次只能替换一个值。</p>
     <pre>{{ `const array1 = [2,5,41,11,8,3]
const array2 = array1.toSorted((a,b) => a - b)
const array3 = array1.toReversed()
const array4 = array1.toSpliced(1,1,100,'c') // 第三个参数及以后为剩余参数，表示添加项数
const array5 = array1.with(0,'a')
` }}</pre>
    <p>
      <el-button
        size="small"
        type="primary"
        @click="arrayChange"
      >
        最新返回新数组的方法
      </el-button>
    </p>
    <h3>改变原数组的方法</h3>
    <p>push、pop、unshift、shift、<em>sort、reverse、splice</em></p>
    <p>注意这些方法的返回值，一般添加方法返回的都是修改后的原数组长度，删除方法都是返回的删除的数组项。pop、shift返回的是删除的数组项（只会是一个），而splice返回的是一个含有删除项的数组（里面可能还有多个数组项，由数组长度和前两个参数决定）</p>
  </div>
</template>
<script setup>
const arrayChange = () => {
  const array = [2,5,41,11,8,3]
  const array1 = array.toSorted((a,b) => a - b)
  const array2 = array.toReversed()
  const array3 = array.toSpliced(1,1,100,'c')
  const array4 = array.with(0,'a')
  console.log('blueM','原数组',array)
  console.log('array.toSorted((a,b) => a - b)', array1)
  console.log('array.toReversed()', array2)
  console.log('array.toSpliced(1,1,100,"c")', array3)
  console.log('array.with(0,"a")', array4)
}
</script>
