/*
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-07-20 14:14:32
 * @Description: 页面/组件/功能的描述
 * @FilePath: /vue3.0/src/assets/js/debounce.js
 */

import { ref, onUnmounted } from 'vue'

export function useTimeout () {
  const timer = ref(null)
  const isPending = ref(false)
  console.log('timer-useTimeout',timer)

  const clearTimer = () => {
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
      isPending.value = false
    }
  }
  
  const setTimer = (callback, delay) => {
    clearTimer()
    isPending.value = true
    
    timer.value = setTimeout(() => {
      callback()
      isPending.value = false
      timer.value = null
    }, delay)
  }

  onUnmounted(() => {
    console.log('onUnmounted')
    clearTimer()
  })
  return {
    timer,
    isPending,
    setTimer,
    clearTimer
  }
}