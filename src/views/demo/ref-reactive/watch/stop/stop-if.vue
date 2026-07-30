<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-28 11:04:51
 * @Description: 子组件异步监听父组件的props变量-父组件
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/watch/stop/stop-if.vue
-->
<template>
  <div class="content">
    <h3>实例3-条件性监听</h3>
    <p>当count大于{{ maxNum }}时，停止监听</p>

    <div class="box">
      <p>count：{{ count }}</p>
      <p>
        <el-button
          type="primary"
          @click="countAdd"
        >
          +1
        </el-button>
      
        <el-button
          type="primary"
          @click="countSubtract"
        >
          -1
        </el-button>
      </p>
    </div>
    <pre>
const stop = watch(count, (newVal, oldVal) => {
  if (newVal > maxNum) {
    stop()
    console.log(`count > ${ maxNum }-> stop watch`, newVal, oldVal)
  }else{
    console.log('count-> watch', newVal, oldVal)
  }
})
</pre> 
    <h4>说明</h4>
    <p>watch()返回的那个 stop函数，内部做的是销毁这个 watcher 的副作用、从依赖列表中移除自己。一旦销毁了，watcher 本身就没了，不是一个"暂停/继续"的机制。所以它叫 stop，不叫 pause。停止监听之后，没法"恢复"。要重新监听，只能再调用一次 watch。</p>
    <p>如果需要在 暂停/开启 之间来回切换，可以在watch内部做相应判断（如if判断）。这样watcher 一直存在，只是逻辑上跳过执行，不会反复创建销毁。</p>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'

const maxNum = 3
const count = ref(0)

const countAdd = () => {
  count.value++
}
const countSubtract = () => {
  count.value--
}
const stop = watch(count, (newVal, oldVal) => {
  if (newVal > maxNum) {
    stop()
    console.log(`count > ${ maxNum }-> stop watch`, newVal, oldVal)
  }else{
    console.log('count-> watch', newVal, oldVal)
  }
})
</script>
