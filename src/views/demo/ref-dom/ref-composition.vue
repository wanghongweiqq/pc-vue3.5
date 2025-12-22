<template>
  <div class="content">
    <h2>Vue 3 Composition</h2>
    <p>模版template中给input定义属性ref：ref="inputRefNormal"</p>
    <p>js中先定义一个和模版中ref值相等的变量：const inputRefNormal = ref(null)，然后用该变量名执行相关的dom方法：inputRefNormal.value.focus()</p>
    <p>定义变量时ref的值最好使用null，测试使用其他数据也可以，如：inputRefNormal = ref(12)</p>
    <p>使用中总是怪怪的，一个属性值和一个变量名强行绑定了，vue3.5之前的版本中compositon 的组件可以使用该方法。</p>
    <p>react中和该方法类似：，</p>
    <pre>
const inputChildRef = useRef(null) // 使用useRef创建 Ref
inputChildRef.current.focus() // 执行dom相关方法，注意这里是current，vue中为value
&lt;input type='text' ref={inputChildRef}&gt; // 模板中引入ref
    </pre>
    <input
      ref="inputRefNormal"
      type="text"
    >
    <el-button
      size="small"
      type="primary"
      @click="domRefFunc"
    >
      获取input焦点
    </el-button>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import {
  ref,
  defineExpose,
} from 'vue'

const inputRefNormal = ref()

const domRefFunc = () => {
  console.log('greenM','inputRefNormal')
  inputRefNormal.value.focus()
}
defineExpose({
  focus: domRefFunc,
})
</script>
