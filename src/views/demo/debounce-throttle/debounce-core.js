/*
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-07-20 14:14:32
 * @Description: debounce核心方法
 * @FilePath: /vue3.0/src/views/demo/debounce-throttle/debounce-core.js
 */

import { ref, onUnmounted } from 'vue'

function useDebounce (type) {
  console.log('a',type)
  const debounceTimer = ref(null)
  const debounceIsPending = ref(false)

  const clearDebounce = () => {
    if (debounceTimer.value) {
      clearTimeout(debounceTimer.value)
      debounceTimer.value = null
      debounceIsPending.value = false
    }
  }
  
  const setDebounce = (fn, delay = 1000) => {
    clearDebounce()
    debounceIsPending.value = true
    
    debounceTimer.value = setTimeout(() => {
      fn()
      debounceTimer.value = null
      debounceIsPending.value = false
    }, delay)
  }
  // options选项api形式的时候可以在业务层的卸载钩子中手动清除：unmounted () { clearDebounce() }
  if(type !== 'options') {
    onUnmounted(() => {
      clearDebounce()
    })
  }
  // 使用数组的形式，更方便同一组件内多次配置
  return [
    setDebounce,
    clearDebounce,
    debounceIsPending,
    debounceTimer,
  ]
  // return {
  //   debounceIsPending,
  //   setDebounce,
  //   clearDebounce
  // }
}

export default useDebounce