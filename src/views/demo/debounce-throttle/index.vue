<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-07-17 09:23:11
 * @Description: 防抖（Debounce）和节流（Throttle）
 * @FilePath: /vue3.0/src/views/demo/debounce-throttle/index.vue
-->
<template>
  <div class="pg-debounce-throttle">
    <CpCrumbs />
    <div class="ly-box">
      <div class="content">
        <h2>防抖（Debounce）和节流（Throttle）</h2>
        <p>
          防抖和节流是两种常用的前端性能优化技术，用于控制函数执行的频率，特别是在处理高频触发事件时（如滚动、输入、窗口调整等）
        </p>
      </div>
      <div class="content">
        <h2>节流（Throttle）</h2>
        <p>节流的核心思想是：在一定时间间隔内，函数只执行一次，无论事件触发多少次。</p>
        <p>应用场景：滚动事件、鼠标移动事件（不是鼠标滚动）、按键操作</p>
        <BcpThrottle />
      </div>
      <div class="content">
        <h2>防抖（Debounce）</h2>
        <p>防抖的核心思想是：在事件被触发后，等待一定时间间隔（delay）再执行函数。如果在等待时间内事件又被触发，则重新计时。</p>
        <p>应用场景：搜索框输入（等待用户停止输入后再发送请求）、窗口大小调整、表单验证</p>
        <p>下面使用输入框做输入防抖</p>
        <p>事件名称解释如下：我们使用input</p>
        <p>input：在 Input 值改变时触发</p>
        <p>change：仅当 modelValue 改变时，当输入框失去焦点或用户按Enter时触发</p>
        <BcpDebounceAll />
      </div>
      
      <BcpDebounceComposition />
      <BcpDebounceOptions />
    </div>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import CpCrumbs from '@/components/crumbs/'
import BcpDebounceAll from './debounce-all'
import BcpDebounceComposition from './debounce-composition'
import BcpDebounceOptions from './debounce-options'
import BcpThrottle from './throttle'
</script>
