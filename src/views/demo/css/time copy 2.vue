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
      <div
        class="box second"
        :class="{animating:activeSecond}"
      >
        <span>{{ second }}</span>
        <span>{{ second }}</span>
        <span>{{ second+1 }}</span>
        <span>{{ second+1 }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import{ ref,onMounted,onUnmounted,watch } from 'vue'

let second = ref(new Date().getSeconds())
let activeSecond = ref(false)
console.log('redM',second.value)
let timer = null
const init = () => {
  // let nowSecond = new Date().getSeconds()
  // if(second.value !== nowSecond) {

  // }
  second.value = new Date().getSeconds()
  timer = requestAnimationFrame(init)
}
onMounted(() => {
  init()
})
onUnmounted(() => {
  timer && cancelAnimationFrame(timer)
})
watch(second,() => {
  activeSecond.value = true
  setTimeout(() => {
    activeSecond.value = false
  },990)
})
</script>

<style lang="scss">
.bcp-time {
  .my-time {
    font-size: 80px;
    color: #fff;

    --width: 100px;
    --height: 100px;
    --duration: 0.6s;

    .box {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--width);
      height: var(--height);
      border: 1px solid #999;

      &::before {
        z-index: 99;
        width: 100%;
        height: 2px;
        content: ' ';
        background: linear-gradient(#000 1px, #fff 1px);
      }

      span {
        position: absolute;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 50%;
        overflow: hidden;
        // transition: all 0.6s ease-in 0s;
        backface-visibility: hidden;

        &:nth-of-type(2n+1) {
          top: 0;
          line-height: var(--height);
          background-color: $color-primary;
        }

        &:nth-of-type(2n) {
          bottom: 0;
          line-height: 0;
          background-color: $color-success;
          transform-origin: top center;
        }

        &:nth-of-type(2) {
          z-index: 2;
        }

        &:nth-of-type(3) {
          transform: rotateX(180deg);
          transform-origin: bottom center;
        }
      }

      &:hover,
      &.animating {
        @keyframes block2 {
          to { transform: rotateX(-180deg); }
        }

        @keyframes block3 {
          to { transform: rotateX(-0deg); }
        }

        span {
          &:nth-of-type(2) {
            animation: block2 var(--duration) ease 0s 1 normal forwards;
          }

          &:nth-of-type(3) {
            z-index: 3;
            animation: block3  var(--duration) ease 0s 1 normal forwards;
          }
        }
      }
    }
  }
}
</style>
