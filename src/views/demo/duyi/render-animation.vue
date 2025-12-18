<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-04-15 15:59:48
 * @Description: 动画对渲染的影响
 * @FilePath: /vue3.0/src/views/demo/duyi/render-animation.vue
-->

<template>
  <div class="content">
    <h2>动画对渲染的影响</h2>
    <p>transform的动画会更高效和丝滑，因为它直接走的渲染的最后一步：draw，这一步在合成线程上，不在渲染主线程上，不会阻碍渲染主线程的继续执行。而 left / background-color / color 等会从渲染主线程的第二步“计算style”开始，一直执行到最后。</p>
    <p>
      <img
        src="@/assets/images/render-steps.png"
        alt="浏览器渲染的主要流程"
        width="800"
      >
    </p>
    <div :class="['circle',{'animation':isAnimation}]">
      <span>1</span>
      <span>2</span>
    </div>
    <p>
      <el-button
        size="small"
        type="primary"
        @click="animationSwitch(true)"
      >
        动画开始
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="animationSwitch(false)"
      >
        动画暂停
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="insetJs"
      >
        插入JS，执行5s的交互队列任务
      </el-button>
    </p>
  </div>
</template>

<!-- eslint-disable no-unused-vars -->
<script setup>
import {
  ref, 
  onMounted,
} from 'vue'

let isAnimation = ref(false)

function delay (duration) {
  let start = Date.now()
  while(Date.now() - start < duration) {}
}

function animationSwitch (bol) {
  isAnimation.value = bol
}

function insetJs () {
  delay(5000)
}

</script>
<style lang='scss'>
.circle {
  span {
    position: relative;
    display: block;
    width: 50px;
    height: 50px;
    font-weight: bold;
    line-height: 50px;
    color: #fff;
    text-align: center;
    background-color: red;
    border-radius: 50%;
    // transition: all 2s ease-in-out 0s;
  }

  @keyframes move1 {
    to { transform: translate(100px); }
  }

  @keyframes move2 {
    to {
      color: green;
      // background-color: green;
    }
  }

  @keyframes move3 {
    from { left: 0; }
    to { left: 100px; }
  }

  &.animation {
    :nth-of-type(1) {
      animation: move1 4s ease-in-out 0s infinite alternate;
    }

    :nth-of-type(2) {
      animation: move3 4s ease-in-out 0s infinite alternate;
    }
  }
}
</style>
