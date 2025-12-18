/*
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-07-20 14:14:32
 * @Description: throttle节流的核心方法
 * @FilePath: /vue3.0/src/views/demo/debounce-throttle/throttle-core.js
 */
import { ref, onUnmounted } from 'vue'

function useThrottle (type) {
  console.log('useThrottle')
  // 使用ref定义，这样才能实现响应式
  const throttleTimer = ref(null) // 计时器标识，主要是用来在delay后恢复throttleIsPending的状态
  const throttleIsPending = ref(false) // 是否正处于等待/挂起状态，可以在此状态下做一些：loading、disabled等

  const setThrottle = (fn, delay = 5000) => {
    console.log('setThrottle')
    if(!throttleIsPending.value) { // 不处于挂起/等待状态
      fn()
      throttleIsPending.value = true
      throttleTimer.value = setTimeout(() => {
        throttleIsPending.value = false
      },delay )
    }

  }
  const clearThrottle = () => {
    if(throttleTimer.value) {
      clearTimeout(throttleTimer.value)
      throttleIsPending.value = false
      throttleTimer.value = null
    }
  }
  // options选项api形式的时候可以在业务层的卸载钩子中手动清除：unmounted () {clearThrottle()}
  if(type !== 'options') {
    onUnmounted(() => {
      clearThrottle()
    })
  }
  return [
    setThrottle,
    clearThrottle,
    throttleIsPending,
  ]
}

export default useThrottle