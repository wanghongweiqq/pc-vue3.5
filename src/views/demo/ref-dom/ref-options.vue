<template>
  <div class="content">
    <h2>Vue 2 选项式-Options API</h2>
    <p>模版template中给input定义属性ref：ref="inputRefOptions"</p>
    <p>js中可以直接使用：this.$refs.inputRefOptions.focus()，无需单独声明</p>
    <inputChild ref="parentRefOptions" />
    <el-button
      size="small"
      type="primary"
      @click="domRefFunc"
    >
      父组件触发子组件的ref
    </el-button>
  </div>
</template>
<script>
import inputChild from './ref-options-child'
export default {
  components: {
    inputChild,
  },
  methods: {
    domRefFunc () {
      this.$refs.parentRefOptions.domRefFunc()
      // $refs拿不到子组件的任何数据，哪怕是暴漏到外边的方法
      console.log('redM',this.$refs.parentRefOptions)
      console.log('redM',this.$refs.parentRefOptions.message)
    }
  }

}
</script>
