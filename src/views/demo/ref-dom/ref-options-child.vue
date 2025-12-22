<template>
  <input
    ref="inputRefOptions"
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
<script>

export default {
  expose: ['domRefFunc'],
  data () {
    return {
      message: 'Hello from child!'
    }
  },
  methods: {
    domRefFunc () { // domRefFunc: () => { 不要使用箭头函数，会获取不到正确的this
      this.$refs.inputRefOptions.focus()
    }
  }

}
</script>
