<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-01-09 14:09:56
 * @Description: 时间翻转
 * @FilePath: /vue3.0/src/views/demo/css/time.vue
-->
<template>
  <div class="bcp-time content">
    <h2>时间翻转</h2>
    <div class="my-time">
      <TimeAnimation
        :value="year"
        type="year"
      />
      <span>-</span>
      <TimeAnimation
        :value="month"
        type="month"
      />
      <span>-</span>
      <TimeAnimation
        :value="day"
        type="day"
      />
      <span>&nbsp;</span>
      <TimeAnimation
        :value="hour"
        type="hour"
      />
      <span>:</span>
      <TimeAnimation
        :value="minute"
        type="minute"
      />
      <span>:</span>
      <TimeAnimation
        :value="second"
        type="second"
      />
    </div>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import{ ref,
  watch,
  onUnmounted,
  onBeforeMount,
  watchEffect,
  computed } from 'vue'
import TimeAnimation from './time-animation.vue'

const second = ref(null)
const minute = ref(new Date().getMinutes())
const hour = ref(new Date().getHours())
const day = ref(new Date().getDate())
const month = ref(new Date().getMonth() + 1)
const year = ref(new Date().getFullYear())
let timer = null
const obj1 = ref({
  width: '200px'
})

const init = () => {
  // let nowSecond = new Date().getSeconds()
  // if(second.value !== nowSecond) {

  // }
  second.value = new Date().getSeconds()
  timer = requestAnimationFrame(init)
}
onBeforeMount(() => {
  init()
  // setTimeout(() => {
  //   obj1.value = {
  //     width: '300px'
  //   }
  // },4000)
})
onUnmounted(() => {
  timer && cancelAnimationFrame(timer)
})

watch(second,(newValue,oldValue,) => {
  // console.log('blueM',oldValue,newValue)
},
{ immediate: true }
)
 
const prevSecond = computed(() => `${ animatingDuration.value / 1000 }s`)  

watchEffect(() => {
  if(second.value === 0) {
    minute.value = new Date().getMinutes()
  }
  if(minute.value === 0) {
    hour.value = new Date().getHours()
  }
  if(hour.value === 0) {
    day.value = new Date().getDate()
  }
  if(day.value === 1) {
    month.value = new Date().getMonth() + 1()
  }
  if(month.value === 1) {
    year.value = new Date().getFullYear()
  }
})

</script>

<style lang="scss">
.bcp-time {
  .my-time {
    display: flex;
    align-items: center;
    font-size: 80px;
    line-height: 1;

    >span {
      margin: -16px 5px 0;
    }
  }
}
</style>
