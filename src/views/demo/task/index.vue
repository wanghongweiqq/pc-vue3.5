<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-04-10 16:49:57
 * @Description: 任务安排，支持链式调用
 * @FilePath: /vue3.0/src/views/demo/task/index.vue
-->
<template>
  <div class="pg-task">
    <CpCrumbs />
    <TaskArrange />
    <TaskBatch />
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import CpCrumbs from '@/components/crumbs/'
import TaskArrange from './task-arrange.vue'
import TaskBatch from './task-batch.vue'

</script>
