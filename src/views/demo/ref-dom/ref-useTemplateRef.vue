<template>
  <h2>vue 3.5 useTemplateRef 推荐</h2>
  <p>在vue 3.5版本中提供的新方法，更符合语义，建议使用</p>
  <h3>自身组件使用</h3>
  <p>1、模版template中给input定义属性ref：ref="inputRefUseTemplateRef"</p>
  <p>2、js中使用先定义一个随意的变量，其值为useTemplateRef方法的结果，useTemplateRef的入参为模版中ref的值：const inputRef = useTemplateRef('inputRefUseTemplateRef')</p>
  <p>3、最后用该变量名执行相关的dom方法：inputRef.value.focus()</p>
  <input
    ref="inputRefUseTemplateRef"
    type="text"
  >
  <el-button
    size="small"
    type="primary"
    @click="domRefFunc"
  >
    获取input焦点
  </el-button>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import {
  useTemplateRef,
  defineExpose,
} from 'vue'

const inputRef = useTemplateRef('inputRefUseTemplateRef')

const domRefFunc = () => {
  inputRef.value.focus()
}
const domRefFuncBlur = () => {
  inputRef.value.blur()
}
defineExpose({
  focus: () => { // 也可直接使用子组件定义好的方法，如domRefFunc
    inputRef.value.focus()
  },
  // focus, // 更简洁的写法，此时子组件直接将方法名命名为focus
  blur: domRefFuncBlur
})
// 组件挂载后自动获取input焦点
// onMounted(() => {
//   inputRef.value.focus()
// })
// 以下两种方式访问dom都会报错，因为必须在组件挂载完成之后(onMounted才)能通过 ref访问到 DOM 元素
// onBeforeMount(() => {
//   inputRef.value.focus()
// })
// inputRef.value.focus()
</script>
