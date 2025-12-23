<template>
  <input
    ref="inputRefOptions"
    type="text"
    :placeholder="message"
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
  props: {
    isFocus: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      message: 'Hello from child!'
    }
  },
  watch: {
    isFocus: {
      handler (value) {
        if(value) {
          this.$refs.inputRefOptions.focus()
        }
      },
      immediate: true
    }
    // isFocus (value) {
    //   console.log('greenM','isFocus',value)
    //   if(value) {
    //     this.$refs.inputRefOptions.focus()
    //   }
    // }
  },
  methods: {
    domRefFunc () { // domRefFunc: () => { 不要使用箭头函数，会获取不到正确的this
      this.$refs.inputRefOptions.focus()
    }
  }

}
</script>
