<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-28 11:04:51
 * @Description: 子组件异步监听全局响应式变量vuex-父组件
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/watch/stop/stop-vuex.vue
-->
<template>
  <div class="content">
    <h3>实例1-子组件异步监听全局响应式变量vuex</h3>
    <p>操作步骤：父组件 -> 切换子组件状态（注销子组件） -> 点击“+1”、“-1”按钮 -> 观察子组件watch的console输出（会继续触发监听）</p>

    <h4>父组件</h4>
    <div class="box">
      <p>vuex -> state.num.count：{{ count }}</p>
      <p>
        <el-button
          type="primary"
          @click="countAdd"
        >
          +1
        </el-button>
      
        <el-button
          type="primary"
          @click="countSubtract"
        >
          -1
        </el-button>

        <el-button
          type="primary"
          @click="childSwitch"
        >
          切换子组件状态
        </el-button>
      </p>
    </div>

    <StopVuexChild v-if="childShow" />

    <h4>说明</h4>
    <p>count为全局响应式变量，在父组件的按钮“切换子组件状态”点击后注销子组件，其延时注册的监听不会被自动清理，这时点击父组件的按钮“+1”、“-1”会继续触发监听（可查看console的输出），这样会造成内存泄漏或报错（视监听的内部逻辑而定）。这时需要手动 stop监听。</p>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import StopVuexChild from './stop-vuex-child.vue'
import { MUT_COUNT } from '@/assets/js/mutation-types'

const store = useStore()
const childShow = ref(true)

const count = computed(() => {
  return store.state.num.count
})
const countAdd = () => {
  store.commit(MUT_COUNT,1)
}
const countSubtract = () => {
  store.commit(MUT_COUNT,-1)
}
const childSwitch = () => {
  childShow.value = !childShow.value
}
</script>
