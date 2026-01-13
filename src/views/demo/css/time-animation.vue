<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-01-09 14:09:56
 * @Description: 时间翻转动画子组件。感觉显示的时间总是比标准时间慢一点点，因为用来执行动画了，animatingDuration
 * @FilePath: /vue3.0/src/views/demo/css/time-animation.vue
-->
<template>
  <div
    class="bcp-time-animation"
    :style="styleWrap"
    :class="{animating:isAnimating,animated:isAnimated}"
  >
    <!-- <p>这里不能用“当前+下一个时间”的组合，会导致非秒的时间段显示错误，都多加了1</p> -->
    <span>{{ valuePrev }}</span>
    <span>{{ valuePrev }}</span>
    <span>{{ valueCurrent }}</span>
    <span>{{ valueCurrent }}</span>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->

<script setup>
import{ ref,defineProps,watch,computed } from 'vue'

// const props = defineProps({
//   value: {
//     type: Number,
//     default: '0'
//   }
// })
const {
  value = 0,
  type,
  styleCustom = {},
} = defineProps({
  value: Number,
  type: String,
  styleCustom: Object,
})

const animatingDuration = ref(800) // 动画持续时间，单位毫秒。该值必须比动画切换的周期小，比如秒的动画，切换周期为1000，那该动画持续时间必须小于1000
const animatingDurationToSecond = computed(() => `${ animatingDuration.value / 1000 }s`)
const isAnimated = ref(false)
const isAnimating = ref(false)
const valueCurrent = ref(null)
const valuePrev = ref(null)
const styleBind = ref({
  width: '100px',
  fontSize: '80px',
  color: '#fff',
  // 以上属性可以通过父组件的样式类名class或者style直接设置
  height: '100px', // height可以父组件设置，但其内部翻转模块需要该属性设置line-height，所以要通过父组件改变高度还是需要使用prop的styleCustom属性
  colorBgTop: '#308eff',
  colorBgBottom: '#00a854',
})

const styleWrap = computed(() => {
  if(valueCurrent.value.length > 2) {
    const widthArray = styleBind.value.width.split(/(?<=\d+)\B(?!\d)/)
    return {
      width: widthArray[0] * (valueCurrent.value.length / 2) + (widthArray[1] ? widthArray[1] : '')
    }
  }else{
    return null
  }
})

watch(() => value,() => {
  console.log(1)
  valueCurrent.value = String(value).padStart(2,'0')
  let prev = null
  if(value === 0 ) {
    switch(type) {
      case 'hour':
        prev = 23
        break
      default:
        prev = 59
    }
  }else{
    prev = value - 1
  }
  valuePrev.value = String(prev).padStart(2,'0')
  isAnimating.value = true
  isAnimated.value = false
  setTimeout(() => {
    isAnimating.value = false
    isAnimated.value = true
  },animatingDuration.value)
},
{ immediate: true })

watch(() => styleCustom,() => {
  console.log(111111,styleCustom)
  if(styleCustom) {
    // Object.assign(styleBind.value,styleCustom) // 也可以
    styleBind.value = {
      ...styleBind.value,
      ...styleCustom,
    }
  }
},
{ immediate: true },
)

</script>

<style lang="scss" >
.bcp-time-animation {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind('styleBind.width');
  height: v-bind('styleBind.height');
  font-size: v-bind('styleBind.fontSize');
  color: v-bind('styleBind.color');
  border: 1px solid #999;
  // transform-style: preserve-3d;
  perspective: 200px;

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
    backface-visibility: hidden;

    &:nth-of-type(2n+1) {
      top: 0;
      line-height: v-bind('styleBind.height');//不能用百分比，按字体大小转化百分比，100%的话字体行高是80px，这里需要设置为100px
      background-color: v-bind('styleBind.colorBgTop');
    }

    &:nth-of-type(2n) {
      bottom: 0;
      line-height: 0;
      background-color: v-bind('styleBind.colorBgBottom');
      transform-origin: top center;
    }

    &:nth-of-type(2) {
      z-index: 2;
    }

    &:nth-of-type(3) {
      transform: rotateX(-180deg);
      transform-origin: bottom center;//旋转角度特别重要，否则3d的perspective透视效果出不来，正顺序为：下->外->上->内
    }
  }

  @keyframes block2 {
    to { transform: rotateX(180deg); }
  }

  @keyframes block3 {
    to { transform: rotateX(0deg); }
  }

  &:hover,
  &.animating {
    span {
      &:nth-of-type(2) {
        animation: block2 v-bind(animatingDurationToSecond) ease 0s 1 normal forwards;
      }

      &:nth-of-type(3) {
        z-index: 2;
        animation: block3  v-bind(animatingDurationToSecond) ease 0s 1 normal forwards;
      }
    }
  }

  &.animated {
    span {
      &:nth-of-type(2) {
        z-index: 0;
      }

      &:nth-of-type(3) {
        z-index: 2;
        transform: rotateX(0deg);
      }

      &:nth-of-type(4) {
        z-index: 2;
      }
    }
  }
}
</style>
