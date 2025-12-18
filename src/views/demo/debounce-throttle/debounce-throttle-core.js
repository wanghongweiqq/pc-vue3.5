/*
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-07-20 14:14:32
 * @Description: debounce防抖和throttle节流的核心方法
 * @FilePath: /vue3.0/src/views/demo/debounce-throttle/debounce-throttle-core.js
 */
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
      // clearDebounceThrottle()
      timerDebounceThrottle.value && clearTimeout(timerDebounceThrottle.value)
      IsPendingDebounceThrottle.value = true
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