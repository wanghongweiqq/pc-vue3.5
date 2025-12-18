<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-04-08 16:29:03
 * @Description: 渡一学习的案例
 * @FilePath: /vue3.0/src/views/demo/duyi.vue
-->
<template>
  <div class="pg-duyi">
    <div class="ly-box">
      <TrafficLight />
      <ScopePromotion />
      <RemoveDuplicateArray />
      <QueueOrder />
      <RenderOrder />
      <RenderAnimation />
    </div>
  </div>
</template>

<script setup>
import TrafficLight from './duyi/traffic-light.vue'
import QueueOrder from './duyi/queue-order'
import RenderOrder from './duyi/render-order'
import RenderAnimation from './duyi/render-animation'
import RemoveDuplicateArray from './duyi/remove-duplicate-array'
import ScopePromotion from './duyi/scope-promotion'

</script>