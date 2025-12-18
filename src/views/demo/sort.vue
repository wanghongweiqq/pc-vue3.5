<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-03-19 16:20:00
 * @Description: 排序
 * @FilePath: /vue3.0/src/views/demo/sort.vue
-->
<template>
  <div class="pg-about">
    <div class="ly-box">
      <div class="content">
        <p>{{ list }}</p>
        <p>
          <el-button
            size="small"
            type="primary"
            @click="bubble"
          >
            冒泡排序
          </el-button>
        </p>
      </div>
    </div>
  </div>
</template>
<!--组合式/Composition API-->
<script setup>
import {
  reactive,
  onMounted ,
} from 'vue'
import utils from '@/assets/js/utils'

const list = reactive([4, 0, 1, 2, 3, 5])// 9次循环
// const list1 = reactive([0, 1, 2, 3, 4, 5]) // 5次循环

const bubble = (arr) => {
  let val = utils.deepCopy(arr)
  // let val = arr
  let x = 0 // 用于计算循环次数
  for(let i = 0; i < val.length - 1; i++) {
    let sortLength = val.length - 1 - i
    let l = 0
    for(let j = 0; j < sortLength; j++) {
      x++
      let tem = null
      if(val[j] > val[j + 1]) {
        tem = val[j]
        val[j] = val[j + 1]
        val[j + 1] = tem
      }else{
        l++
      }
    }
    if(sortLength === l) { // 用于退出循环
      break
    }
  }
  console.log('bubble:',val,x)
}

onMounted(() => {
  bubble(list) // 循环次数 9:5
})

</script>
