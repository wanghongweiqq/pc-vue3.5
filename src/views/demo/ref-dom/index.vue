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
        <RefComposition ref="parentRefComposition" />
        <h3>父子组件使用</h3>
        <p>1、子组件使用defineExpose暴露方法，该方法入参为一个对象，对象的key值为暴露给父组件的方法名，对象的value值子组件自身要执行的方法</p>
        <pre>
defineExpose({
  focus: domRefFunc,
})</pre>
        <p>2、父组件使用ref定义的变量调用子组件暴露的方法</p>
        <pre>
const parentRefComposition = ref(null)
const parentRefFuncComposition = () => {
  parentRefComposition.value.focus()
}</pre>
        <p>
          <el-button
            size="small"
            type="primary"
            @click="parentRefFuncComposition"
          >
            父组件触发子组件的ref
          </el-button>
        </p>
        <h4>react中父子组件使用</h4>
        <p>1、创建 Ref：在父组件中使用 useRef 创建一个 ref 对象。其实在父组件中像普通组件中那样使用ref即可，只是注意父组件要使用子组件暴露给他的方法名字，一般这个名字和操作dom的名字相同。</p>
        <p>2、转发 Ref：子组件使用 forwardRef 方法包裹，将父组件传入的 ref 作为子组件的第二个参数转发给子组件。这是因为函数式子组件默认不会接收ref属性，第一个参数props中不含有父组件的ref。</p>
        <p>3、暴露方法：在子组件中使用 useImperativeHandle Hook，将操作子组件dom的方法（如 focus）暴露给父组件。这样可以限制父组件只能调用特定的方法，而不是直接访问子组件的全部实例。，从而提供更精确和安全的组件间通信方式。</p>
        <p>4、触发焦点：在父组件中，通过 ref.current.focus()来触发焦点。</p>
        <pre>
// 父组件
const refParent = useRef(null)
const inputParentFocus = () => {
  refParent.current.focus()
}
&lt;Child ref={refParent} /&gt;

// 子组件
import React, { useRef, forwardRef, useImperativeHandle } from 'react'
const Child = (props, ref) => {
  const inputChildRef = useRef(null)
  // 使用命令的/必要的/规则的操作，它允许你自定义由ref暴露给父组件的实例值
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputChildRef.current.focus()
    },
    blur: inputChildBlur,
  }), [])
}
// forwardRef 使父组件的ref能够以第二个参数的形式传递过来
export default forwardRef(Child)
</pre>
      </div>

      <div class="content">
        <RefUseTemplateRef ref="parentRefUseTemplateRef" />
        <h3>父子组件使用</h3>
        <p>1、子组件使用defineExpose暴露方法，该方法入参为一个对象，对象的key值为暴露给父组件的方法名，对象的value值子组件自身要执行的方法</p>
        <pre>
defineExpose({
  focus, // 更简洁的写法，此时子组件直接将方法名命名为focus
})</pre>
        <p>2、父组件使用ref定义的变量调用子组件暴露的方法</p>
        <pre>
const parentRefUseTemplateRef = useTemplateRef('parentRefUseTemplateRef')
const parentRefFuncUseTemplateRef = () => {
  parentRefUseTemplateRef.value.focus()
}</pre>
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
        <p>2、<em>响应式更新与 $nextTick</em>：如果 DOM 元素是通过 v-if或 v-for动态渲染的，可能需要在数据更新后，使用 Vue.nextTick（或 this.$nextTick）来确保访问的是更新后的 DOM ，具体可见示例：<a href="/demo/setup#dom-ref">DOM ref</a></p>
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
import { ref,useTemplateRef } from 'vue'
import CpCrumbs from '@/components/crumbs/'
import RefOptions from './ref-options'
import RefComposition from './ref-composition'
import RefUseTemplateRef from './ref-useTemplateRef'

const parentRefComposition = ref(null)
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
