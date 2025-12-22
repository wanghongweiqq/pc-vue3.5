<template>
  <div class="pg-ref-dom">
    <div class="ly-box">
      <CpCrumbs />

      <div class="content">
        <h1>ref</h1>
        <p>在 Vue 中使用ref获取 DOM 元素，最核心的步骤就两步：</p>
        <p>1、在模板中绑定 ref：在需要获取的 DOM 元素上，通过 ref属性给它起一个唯一的标识符。</p>
        <p>2、在脚本中访问 ref：在组件脚本中，通过 this.$refs（Vue 2）或对应的 ref变量（Vue 3）来访问该元素</p>
      </div>
      <RefOptions />

      <div class="content">
        <RefComposition ref="pareatRefComposition" />
        <p>
          <el-button
            size="small"
            type="primary"
            @click="parentRefFuncComposition"
          >
            父组件触发子组件的ref
          </el-button>
        </p>
      </div>

      <div class="content">
        <RefUseTemplateRef ref="parentRefUseTemplateRef" />
        <p>
          <el-button
            size="small"
            type="primary"
            @click="parentRefFuncUseTemplateRef"
          >
            父组件触发子组件的ref
          </el-button>
        </p>
      </div>

      <div class="content">
        <h2>关键注意事项</h2>
        <p>1、<em>访问时机至关重要</em>：必须在组件挂载完成之后才能通过 ref访问到 DOM 元素。在 setup函数或 beforeCreate、created生命周期中直接访问会得到 null，因为此时 DOM 还未渲染 。务必在 onMounted(Vue 3) 或 mounted(Vue 2) 及其之后的生命周期或事件（如按钮点击）中操作。</p>
        <p>2、<em>响应式更新与 $nextTick</em>：如果 DOM 元素是通过 v-if或 v-for动态渲染的，可能需要在数据更新后，使用 Vue.nextTick（或 this.$nextTick）来确保访问的是更新后的 DOM </p>
        <pre>
// Vue 3 示例
import { nextTick } from 'vue'
const showInput = ref(false)
const toggleAndFocus = async () => {
  showInput.value = true
  await nextTick() // 等待 DOM 更新
  inputRef.value?.focus()
}</pre>
        <p>3、<em>操作子组件</em>：ref也可以绑定在子组件上，用于调用子组件暴露的方法或访问其数据 。在 Vue 3 中，子组件需使用 defineExpose宏显式暴露其内部属性或方法，父组件才能通过 ref访问到 。</p>
        <p>4、<em>避免滥用</em>：Vue 是数据驱动的框架，应优先考虑通过改变数据（数据绑定）来更新视图。直接操作 DOM 应是最后的选择，仅在焦点管理、媒体播放、集成第三方库等特定场景下使用</p>
      </div>

      <div class="content">
        <h2>获取 DOM 元素方式合集</h2>
        <table class="table">
          <tbody>
            <tr>
              <th width="150">
                方法
              </th>
              <th>说明</th>
              <th>推荐度</th>
            </tr>
            <tr>
              <td>ref属性</td>
              <td>Vue 官方推荐，与组件实例生命周期紧密关联，最安全可靠</td>
              <td>5颗星</td>
            </tr>
            <tr>
              <td>事件参数 $event</td>
              <td>在事件处理函数中，可通过 $event.target获取触发事件的 DOM 元素 。适用于事件上下文。</td>
              <td>4颗星</td>
            </tr>
            <tr>
              <td>原生 DOM API</td>
              <td>如 document.querySelector，可能绕过 Vue 的响应式系统，易导致选择器冲突或时机错误，不推荐</td>
              <td>2颗星</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import CpCrumbs from '@/components/crumbs/'
import RefOptions from './ref-options'
import RefComposition from './ref-composition'
import RefUseTemplateRef from './ref-useTemplateRef'
import { useTemplateRef } from 'vue'

const parentRefComposition = useTemplateRef('pareatRefComposition')
const parentRefUseTemplateRef = useTemplateRef('parentRefUseTemplateRef')

const parentRefFuncComposition = () => {
  parentRefComposition.value.focus()
}
const parentRefFuncUseTemplateRef = () => {
  parentRefUseTemplateRef.value.focus()
}
</script>
<style lang="scss">
.pg-ref-dom {
  input[type=text] {
    box-sizing: border-box;
    height: 32px;
    padding: 12px;
    margin-right: 12px;
    border-width: 1px;
  }
}
</style>
