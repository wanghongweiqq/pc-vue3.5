<!-- eslint-disable no-undef -->
<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-05-08 22:43:30
 * @Description: 数组去重
 * @FilePath: /vue3.0/src/views/demo/duyi/remove-duplicate-array.vue
-->
<template>
  <div class="content">
    <h2>数组去重</h2>
    <h3>原数据</h3>
    
    <p>原数据，属性值为undefined的数据不会在html中展示出来，如其中最后一个e后面是有f属性的 f: undefined</p>
    <p>{{ arrayOriginal }}</p>
    <h3>去重后的数据</h3>
    <p>没有过滤undefined，将undefined作为一个普通的值，这时{ e: 1 } 和 { e: 1, f: undefined }认为是不重复的。</p>
    <p>{{ result.arrayDefault }}</p>
    <p>过滤了undefined，删除了带有该值的属性，然后再去重，这时{ e: 1 } 和 { e: 1, f: undefined }认为是重复的。</p>
    <p>{{ result.arrayIsFilterUndefined }}</p>
  </div>
</template>

<script setup>

import {
  reactive,
} from 'vue'

let result = reactive({ arrayDefault: [], arrayIsFilterUndefined: [] })

let arrayOriginal = [
  { a: 1, b: 2 },
  { b: 2, a: 1 },
  { a: 1, b: '2' },
  { e: 1 },
  { e: 1, f: null },
  { e: 1, f: undefined },
  1, 
  1, 
  ['x','y'],
  ['y','x'],
]

// 是否为基本数据类型
function isBasic (val) {
  // const result = val === null || (typeof val !== 'object' && typeof val !== 'function')
  const result = val === Object(val) ? false : true
  return result
}

// 过滤掉值为undefined的属性
function removePropertyUndefined (arr) {
  return arr.filter(item => item[1] !== undefined)
}

// 判断数据是否相等
function isEqual (val1, val2, params) {
  if(isBasic(val1) || isBasic(val2)) {
    return Object.is(val1 , val2) // 更优 -0,+0/0 false ; +0,0 true ; NaN,NaN true;
    // return val1 === val2 // -0/+0/0/0.0 true ; NaN===NaN false
  }else{
    let a1 = Object.entries(val1)
    let a2 = Object.entries(val2)
    const { 
      isRemovePropertyUndefined = false , 
    } = params
    if(isRemovePropertyUndefined) {
      a1 = removePropertyUndefined(a1)
      a2 = removePropertyUndefined(a2)
    }
    if(a1.length !== a2.length) {
      return false
    }else{
      for(const [keyA1,valA1] of a1) {
        const isA2ContainsA1Key = a2.some(item => item[0] === keyA1) // 特殊情况a1的key值为undefined，a2中不含该key时，这时认为他俩是相等的，为了防止该情况的发生，要先判断a2中是否含有该key
        if(!isA2ContainsA1Key || !isEqual(valA1,val2[keyA1])) { // a2中不含有a1的key||含有a1的key但值不等
          return false
        }
      }
      return true
    }
  }
}

function removeDuplicateArray (arr = [],params = {}) {
  let res = []
  flag:for(const val1 of arr) {
    for(const val2 of res) {
      if(isEqual(val1,val2,params)) { // 相同
        continue flag
      }
    }
    res.push(val1)
  }
  return res
}

result.arrayDefault = removeDuplicateArray(arrayOriginal)
result.arrayIsFilterUndefined = removeDuplicateArray(arrayOriginal,{ isRemovePropertyUndefined: true })
console.log('数组去重')
console.log('原数组：',arrayOriginal)
console.log('去重数组-将undefined当普通有效值对待：',result.arrayDefault)
console.log('去重数组-将undefined的属性去除后去重：',result.arrayIsFilterUndefined)
</script>
