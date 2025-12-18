<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-07-17 23:25:51
 * @Description: 防抖在options中的使用
 * @FilePath: /vue3.0/src/views/demo/debounce-throttle/debounce-all-options-use.vue
-->

<template>
  <div class="debounce-all-options">
    <h4>options选项式api示例</h4>
    <p>options选项式api中的使用：useDebounce('options')需要告诉debounce该组件类型为options，以去除onUnmounted，因为在选项式组件中没有这个声明周期，否则会有警告：[Vue warn]: onUnmounted is called when there is no active component instance to be associated with. Lifecycle</p>
    <p>定时器的清除要在unmounted钩子中手动去除，否则执行的内容会带到后面的页面中，造成内存泄漏、性能问题、交互问题（比如有弹窗）</p>
    <p>useDebounce('options')解构后得到的方法和响应式数据，在template中不能直接使用，使用的方法需要在当前组件的methods中定义，数据需要在data中定义。如果使用会不生效，而且有警告：[Vue warn]: Property "clearDebounce" was accessed during render but is not defined on instance. 在生命周期钩子中可直接使用。</p>
    <pre>
const [setDebounce, clearDebounce ,debounceIsPending] = useDebounce({ type: 'debounce' , mode: 'options' })

// inputs事件调用
@input="doSearch1"
@clear="clearSearch1"

data () {
  return{
    debounceIsPending1: debounceIsPending,
  }
},

unmounted () {
  clearDebounce()
},

doSearch1 (...args) {
  console.log('防抖已触发，等待执行中')
  setDebounce(() => {
    console.log('options-输入框1参数为：',...args)
  },this.delay)
},
clearSearch1 () {
  console.log('防抖已取消，不会再执行')
  clearDebounce()
},
</pre>
    <p>
      <el-input
        v-model="searchValue1"
        clearable
        @input="doSearch1"
        @clear="clearSearch1"
      >
        <template #prepend>
          {{ debounceIsPending1?`等待执行，共需等待${delay}毫秒`:'未开始或已执行完' }}
        </template>
      </el-input>
    </p>
  </div>
</template>
<script>
// import useDebounce from './debounce-core'
// const [setDebounce, clearDebounce ,debounceIsPending] = useDebounce('options')
import useDebounce from './debounce-throttle-core'
const [setDebounce, clearDebounce ,debounceIsPending] = useDebounce({ type: 'debounce' , mode: 'options' })

export default {
  data () {
    return{
      delay: 5000,
      searchValue1: '',
      debounceIsPending1: debounceIsPending,
    }
  },
  unmounted () {
    clearDebounce()
  },
  methods: {
    doSearch1 (...args) {
      console.log('防抖已触发，等待执行中')
      setDebounce(() => {
        console.log('options-输入框1参数为：',...args)
      },this.delay)
    },
    clearSearch1 () {
      console.log('防抖已取消，不会再执行')
      clearDebounce()
    },
  }
}
</script>
