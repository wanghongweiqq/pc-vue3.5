<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-07-17 23:25:51
 * @Description: 防抖的使用
 * @FilePath: /vue3.0/src/views/demo/debounce-throttle/debounce-all.vue
-->

<template>
  <div class="debounce-all-api">
    <h2>一、vue3.0版本中composition组合式api和options选项式api通用版本</h2>
    <h3>1、最优版本：useDebounceThrottle，vue的两种api形式都支持，有清除定时器的方法，还有等待/挂起状态：IsPendingDebounceThrottle是响应式的</h3>
    <p>为了方便同一组件内多次调用，设计为数据解构的形式（而不是对象，对象还要结构的时候使用别名 name：other name）</p>
    <p>当然也可以考虑将使用的地方再次封装为组件，这样就不用担心重复计时器的问题，但这样有些死板</p>
    <p>在组合式composition-api中支持卸载组件时自动清除计时器，在选项式options-api中需要手动在组件卸载时清除</p>
    <pre>
// debounce防抖和throttle节流的核心方法      
import { ref, onUnmounted } from 'vue'

function useDebounceThrottle (params = {}) {
  // type：类型，1、throttle：节流，默认值，2、debounce：防抖
  // mode：模式，1、composition：组合式，默认值，2、options：选项式
  const { type = 'throttle', mode = 'composition' } = params 
  console.log('useDebounceThrottle')
  // 使用ref定义，这样才能实现响应式
  const timerDebounceThrottle = ref(null) // 计时器标识，主要是用来在delay后恢复throttleIsPending的状态
  const IsPendingDebounceThrottle = ref(false) // 是否正处于等待/挂起状态，可以在此状态下做一些：loading、disabled或其他提示信息

  const clearDebounceThrottle = () => {
    if(timerDebounceThrottle.value) {
      clearTimeout(timerDebounceThrottle.value)
      IsPendingDebounceThrottle.value = false
      timerDebounceThrottle.value = null
    }
  }

  const setDebounceThrottle = (fn, delay = 5000) => {
    console.log('setDebounceThrottle')
    if(type === 'throttle') { // 节流
      if(!IsPendingDebounceThrottle.value) { // 不处于挂起/等待状态
        fn()
        IsPendingDebounceThrottle.value = true
        timerDebounceThrottle.value = setTimeout(() => {
          IsPendingDebounceThrottle.value = false
        },delay )
      }
    }else{ // 防抖
      IsPendingDebounceThrottle.value = true
      clearDebounceThrottle()
      timerDebounceThrottle.value = setTimeout(() => {
        fn()
        IsPendingDebounceThrottle.value = false
        timerDebounceThrottle.value = null
      }, delay)
    }
  }

  // options选项api形式的时候可以在业务层的卸载钩子中手动清除：unmounted () { clearDebounceThrottle() }
  if(mode !== 'options') {
    onUnmounted(() => {
      clearDebounceThrottle()
    })
  }

  return [
    setDebounceThrottle,
    clearDebounceThrottle,
    IsPendingDebounceThrottle,
  ]
}

export default useDebounceThrottle
</pre>
    <h4>composition组合式api示例</h4>
    <pre>
// 方法调用示例
@input="doSearch1"
@clear="clearDebounce"

import useDebounce from './debounce-throttle-core'
const [setDebounce, clearDebounce ,debounceIsPending] = useDebounce({ type: 'debounce' })
const delay = ref(5000)

const doSearch1 = (...args) => {
  console.log('防抖已触发，等待执行中')
  setDebounce(() => {
    console.log('输入框1参数为：',...args)
  },delay.value)
}       
</pre>
    <p>同一组件第一次使用</p>
    <p>
      <el-input
        v-model="searchValue1"
        placeholder="可防抖，参数为input的默认参数即value值"
        clearable
        @input="doSearch1"
        @clear="clearDebounce"
      >
        <template #prepend>
          {{ debounceIsPending?`等待执行，共需等待${delay}毫秒`:'未开始或已执行完' }}
        </template>
      </el-input>
    </p>
    <p>同一组件第二次使用</p>
    <p>
      <el-input
        v-model="searchValue2"
        placeholder="可防抖，参数为input的默认参数即value值"
        clearable
        @input="doSearch2"
        @clear="b"
      >
        <template #prepend>
          {{ c?`等待执行，共需等待${delay}毫秒`:'未开始或已执行完' }}
        </template>
      </el-input>
    </p>
    <DebounceOptionsUse />

    <h3>2、次优版本：工具类形式，vue的两种api形式都支持，有清除定时器的方法，没有有等待/挂起状态</h3>
    <pre>
// 防抖的核心方法，工具类形式：更简洁，功能也更强大
debounce (fn,delay = 2000) {
  let timer 
  const debounced = (...args) => {
    timer && clearTimeout(timer)
    timer = setTimeout(() => { 
      fn(...args)
    }, delay)
  }
  debounced.clear = () => {
    timer && clearTimeout(timer)
  }
  return debounced
}
</pre>
    <h4>composition组合式api示例</h4>
    <p>其实就是下面的composition组合式api</p>
    <pre>
// inputs事件调用，两种清除形式都可以
@input="doSearch3($event,'x')"
@clear="clearDebounce3"
@clear="doSearch3.clear"

// 工具类形式的调用方法
const doSearch3 = utils.debounce((...args) => { 
  console.log('输入框3参数为：',...args)
})
// 以下两种清除防抖的写法都可以
// const clearDebounce3 = doSearch3.clear
const clearDebounce3 = () => {
  doSearch3.clear()
}
</pre>
    <p>
      <el-input
        v-model="searchValue3"
        placeholder="可防抖，参数为input的默认参数即value值"
        clearable
        @input="doSearch3($event,'x')"
        @clear="doSearch3.clear"
      />
      <!-- @input="doSearch3" -->
    </p>
    <DebounceOptionsUtils />
    <p>其实下面的方法可以不用看了，最好用上面两种形式，vue3用最优方法1，vue3以下用方法2</p>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import {
  ref, 
} from 'vue'
// import useDebounce from './debounce-core'
import utils from '@/assets/js/utils.js'
import useDebounce from './debounce-throttle-core'
import DebounceOptionsUse from './debounce-all-options-use'
import DebounceOptionsUtils from './debounce-all-options-utils'
const [setDebounce, clearDebounce ,debounceIsPending] = useDebounce({ type: 'debounce' })
const[a, b, c] = useDebounce({ type: 'debounce' })

const searchValue1 = ref('')
const searchValue2 = ref('')
const delay = ref(5000)
const searchValue3 = ref('')

const doSearch1 = (...args) => {
  console.log('防抖已触发，等待执行中')
  setDebounce(() => {
    console.log('输入框1参数为：',...args)
  },delay.value)
} 
function doSearch2 (...args) {
  console.log('防抖已触发，等待执行中')
  a(() => {
    console.log('输入框2参数为：',...args)
  },delay.value)

} 

// 工具类形式的调用方法
const doSearch3 = utils.debounce((...args) => { 
  console.log('输入框3参数为：',...args)
})
// 以下两种清除防抖的写法都可以
// const clearDebounce3 = doSearch3.clear
const clearDebounce3 = () => {
  doSearch3.clear()
}

</script>
