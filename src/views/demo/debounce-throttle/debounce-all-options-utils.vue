<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-07-17 23:25:51
 * @Description: 防抖和节流在options组件中的使用
 * @FilePath: /vue3.0/src/views/demo/debounce-throttle/debounce-all-options-utils.vue
-->

<template>
  <div class="debounce-all-options-utils">
    <h4>options选项式api示例</h4>
    <p>利用data的初始话执行闭包工具类的函数，将timer私有化</p>
    <pre>
// 触发事件
@input="debounce1($event,'c','d')"
@clear="debounce1.clear"

// 用data的初始话执行debounce闭包的初始化，并声明回调函数
// 还有一种形式是：在export default外声明一个变量，然后在mounted钩子中对其进行赋值，来执行debounce闭包的初始化，这种形式有点不雅，不建议使用
data () {
  return{
    name: 'wanghognwei',
    debounce1: this.$utils.debounce(this.doSearch1Callback)
  }
},
// 回调方法，xxx是utils里定义的内容，由于debounce方法使用的是箭头函数，this在这里是拿不到的utils里的内容的
doSearch1Callback (...argument) {
  console.log('输入框参数为：',...argument,this.name,this.xxx)
},
</pre>
    <p>
      <el-input
        v-model="searchValue1"
        clearable
        @input="debounce1($event,'c','d')"
        @clear="debounce1.clear"
      />
    </p>
  </div>
</template>
<script>
export default {
  data () {
    return{
      name: 'wanghognwei',
      searchValue1: '',
      debounce1: this.$utils.debounce(this.doSearch1Callback)
    }
  },
  methods: {
    // 回调方法
    doSearch1Callback (...argument) {
      console.log('输入框参数为：',...argument,this.name,this.xxx)
    },
  }
}
</script>
