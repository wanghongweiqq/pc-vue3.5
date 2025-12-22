<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-04-10 16:49:57
 * @Description: 信号灯
 * @FilePath: /vue3.0/src/views/demo/duyi/traffic-light.vue
-->
<template>
  <div class="content bcp-traffic-light">
    <h2>信号灯</h2>
    <p>requestAnimationFrame：一个更优的动画执行方法。window下的方法，主流显示器的刷新频率为60hz（每秒 60 次），此时 requestAnimationFrame 的回调函数每 ‌16.67 毫秒‌（≈1000ms/60）执行一次‌。其返回值是一个 ‌非零长整型数值（long 类型整数）‌,作为唯一标识符，可以用cancelAnimationFrame取消动画请求。诸如setTimeout等定时器都要在组件卸载时注销。</p>
    <p class="traffic-light">
      <span
        v-for="item of lightList"
        :key="item.color"
        :style="{'background-color':item.color}"
        :class="{'current':item.color === currentLight.color}"
      >{{ remainTime(item) }}</span>
    </p>
    <p>
      <el-button
        size="small"
        type="primary"
        @click="lightRestart"
      >
        重置
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="lightPause"
      >
        暂停
      </el-button>
    </p>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import {
  ref,
  reactive,
  onMounted ,
  computed,
  onBeforeMount,
  onUpdated,
  onUnmounted,
} from 'vue'
import TrafficLight from './traffic-light-class.js'

const lightList = reactive([
  { color: 'red',duration: 3000 },
  { color: 'yellow',duration: 2000 },
  { color: 'green',duration: 5000 },
])
let currentLight = reactive({})

// 含有参数的计算属性，普通的计算属性是返回一个值，带参数的计算属性就是返回一个方法，方法里有对应的参数
const remainTime = computed(() =>
  (item) => item.color === currentLight.color ? Math.round( currentLight.remain / 1000 ) : ''
)

let rafTag = null

const init = () => {
  const light = new TrafficLight(lightList)
  console.log('light')
  console.log(light)

  const rafLight = () => {
    const { color,remain } = light.getCurrentLight()
    currentLight.color = color
    currentLight.remain = remain
    rafTag = requestAnimationFrame(rafLight)
  }
  rafLight()
}

onMounted(() => {
  init()
})
onUnmounted(() => {
  rafTag && cancelAnimationFrame(rafTag)
})
function lightRestart () {
  console.log('init-target', typeof new.target)
  rafTag && cancelAnimationFrame(rafTag)
  init()
}
function lightPause () {
  cancelAnimationFrame(rafTag)
}
</script>
<style lang="scss">
.bcp-traffic-light {
  .traffic-light {
    display: flex;

    >span {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      margin-right: 20px;
      font-size: 16px;
      font-weight: bold;
      color: white;
      text-shadow: 0 0 2px black;
      border-radius: 50%;
      opacity: 0.5;

      &.current {
        opacity: 1;
      }
    }
  }
}
</style>
