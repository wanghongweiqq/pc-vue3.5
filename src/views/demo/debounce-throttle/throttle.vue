<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-07-17 23:25:51
 * @Description: 防抖的使用
 * @FilePath: /vue3.0/src/views/demo/debounce-throttle/throttle.vue
-->

<template>
  <div class="throttle">
    <h3>可以查看防抖的最优方法，其实是一样的</h3>
    <pre>
// 点击事件调用
@click="onSubmit(`节流提交：${Date.now()}`)" //有无参数都可以用这种形式
@click="setThrottle(onSubmit2)" //无参数还可以用这种形式，直接用节流解构的方法
@click="clearThrottle"

// 取消按钮
v-if="throttleIsPending"
@click="clearThrottle"

// 执行的方法
const onSubmit = (...args) => {
  setThrottle(() => {
    console.log('按钮被点击了，参数为：',...args)
  })
}
const onSubmit2 = () => {
  console.log('按钮被点击了，不涉及到参数')
}
</pre>
    <h4>useThrottle节流示例</h4>
    <p>
      <el-button
        size="small"
        type="primary"
        :disabled="throttleIsPending"
        @click="onSubmit(`节流提交：${Date.now()}`)"
      >
        节流提交-有参数
      </el-button>
      <el-button
        size="small"
        type="primary"
        :disabled="throttleIsPending"
        @click="setThrottle(onSubmit2)"
      >
        节流提交-无参数
      </el-button>
      <el-button
        v-if="throttleIsPending"
        size="small"
        type="primary"
        @click="clearThrottle"
      >
        清除节流
      </el-button>
    </p>

    <h4>utils节流示例</h4>
    <pre>
throttle (fn,delay = 2000) {
  console.log('throttle')
  let timer
  let isPending = false
  const throttled = (...args) => {
    if(!isPending) {
      isPending = true
      fn(...args)
      timer = setTimeout(() => {
        isPending = false
      },delay )
    }
  }
  throttled.clear = () => {
    timer && clearTimeout(timer)
    timer = null
    isPending = false
  }
  return throttled
}

// 点击事件调用
@click="utilsSubmit(`节流提交：${Date.now()}`)"
// 取消按钮
@click="utilsSubmit.clear"

const utilsSubmit = utils.throttle((...args) => {
  console.log('按钮被点击了，参数为：',...args)
},5000)</pre>
    <p>
      <el-button
        size="small"
        type="primary"
        @click="utilsSubmit(`节流提交：${Date.now()}`)"
      >
        节流提交-有参数
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="utilsSubmit.clear"
      >
        清除节流
      </el-button>
    </p>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
// import useThrottle from './throttle-core'
import useThrottle from './debounce-throttle-core'
import utils from '@/assets/js/utils.js'

const [setThrottle, clearThrottle, throttleIsPending] = useThrottle()

const onSubmit = (...args) => {
  setThrottle(() => {
    console.log('按钮被点击了，参数为：',...args)
  })
}
const onSubmit2 = () => {
  console.log('按钮被点击了，不涉及到参数')
}
const utilsSubmit = utils.throttle((...args) => {
  console.log('按钮被点击了，参数为：',...args)
},5000)
</script>
