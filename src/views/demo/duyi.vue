<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-04-08 16:29:03
 * @Description: 渡一学习的案例
 * @FilePath: /vue3.0/src/views/demo/duyi.vue
-->
<template>
  <div class="pg-duyi">
    <el-tabs v-model="activeTab">
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
        label="交互/延时队列"
        name="queue"
      >
        <QueueOrder />
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
import TrafficLight from './duyi/traffic-light.vue'
import QueueOrder from './duyi/queue-order'
import RenderOrder from './duyi/render-order'
import RenderAnimation from './duyi/render-animation'
import RemoveDuplicateArray from './duyi/remove-duplicate-array'
import ScopePromotion from './duyi/scope-promotion'

const activeTab = ref('traffic')
</script>