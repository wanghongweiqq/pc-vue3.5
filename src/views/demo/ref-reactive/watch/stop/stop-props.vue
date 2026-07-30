<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-07-28 11:04:51
 * @Description: 子组件异步监听父组件的props变量-父组件
 * @FilePath: /pc-vue3.5/src/views/demo/ref-reactive/watch/stop/stop-props.vue
-->
<template>
  <div class="content">
    <h3>实例2-子组件异步监听父组件的props变量</h3>
    <p>操作步骤：父组件 -> 切换子组件状态（注销子组件） -> 点击“+1”、“-1”按钮 -> 观察子组件watch的console输出（不会触发监听）</p>

    <h4>父组件</h4>
    <div class="box">
      <p>count：{{ count }}</p>
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

    <StopPropsChild
      v-if="childShow"
      :count="count"
    />

    <h4>说明</h4>
    <p>子组件异步监听父组件的props变量，原则上子组件卸载后其watch不会被 Vue 自动回收。但实际操作中，子组件的监听回调不会被触发，原因如下：</p>
    <pre>
2s 执行 watch，立刻执行一次 ()=>props.count → 收集依赖（此时组件还挂载着，依赖收集成功）
之后父组件销毁子组件 → 子组件实例 unmounted
父组件修改 count：
响应式触发更新，尝试通知所有收集过依赖的副作用
但是！子组件已经卸载，组件实例标记为已卸载，Vue 在派发更新时会跳过已卸载组件自身响应式数据（props/ref/reactive）相关的副作用，但不会跳过全局的响应式数据（如 vuex）相关的副作用。
</pre> 
  </div>
</template>
<script setup>
import { ref } from 'vue'
import StopPropsChild from './stop-props-child.vue'

const count = ref(0)
const childShow = ref(true)

const countAdd = () => {
  count.value++
}
const countSubtract = () => {
  count.value--
}

const childSwitch = () => {
  childShow.value = !childShow.value
}
</script>
