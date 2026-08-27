<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-04-08 16:29:03
 * @Description: 渡一学习的案例
 * @FilePath: /pc-vue3.5/src/views/demo/duyi/index.vue
-->
<template>
  <div class="pg-duyi">
    <el-tabs v-model="activeTab">
      <el-tab-pane
        label="进程和线程"
        name="process"
      >
        <Process />
      </el-tab-pane>
      <el-tab-pane
        label="事件循环"
        name="event-loop"
      >
        <EventLoop />
      </el-tab-pane>
      <el-tab-pane
        label="队列优先级"
        name="queue"
      >
        <QueueOrder />
      </el-tab-pane>
      <el-tab-pane
        label="信号灯"
        name="traffic"
      >
        <TrafficLight />
      </el-tab-pane>
      <el-tab-pane
        label="作用域提升"
        name="scope"
      >
        <ScopePromotion />
      </el-tab-pane>
      <el-tab-pane
        label="数组去重"
        name="duplicate"
      >
        <RemoveDuplicateArray />
      </el-tab-pane>
      <el-tab-pane
        label="渲染顺序"
        name="render"
      >
        <RenderOrder />
      </el-tab-pane>
      <el-tab-pane
        label="动画与渲染"
        name="animation"
      >
        <RenderAnimation />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TrafficLight from './traffic-light.vue'
import Process from './process.vue'
import QueueOrder from './queue-order'
import RenderOrder from './render-order'
import RenderAnimation from './render-animation'
import RemoveDuplicateArray from './remove-duplicate-array'
import ScopePromotion from './scope-promotion'
import EventLoop from './event-loop.vue'

const activeTab = ref('process')
</script>