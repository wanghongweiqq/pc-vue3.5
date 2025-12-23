<template>
  <div class="content">
    <h2>Vue 2 选项式-Options API</h2>
    <h3>自身组件使用</h3>
    <p>1、模版template中给input定义属性ref：ref="inputRefOptions"</p>
    <p>2、js中可以直接使用：this.$refs.inputRefOptions.focus()，无需单独声明</p>
    <RefOptionsChild
      ref="parentRefOptions"
      :is-focus="isFocus"
    />

    <h3>父子组件使用</h3>
    <p>1、子组件使用expose暴露方法：expose: ['domRefFunc'],</p>
    <p>2、父组件使用$refs调用子组件暴露的方法：this.$refs.parentRefOptions.domRefFunc()</p>
    <p>备注：虽然父组件可以通过$refs直接使用子组件暴露给父组件的方法，但console时父组件的$refs拿不到传给子组件的任何数据，也拿不到子组件自身定义的任何数据，哪怕是暴露到外边的方法，相当于子组件完全是一个黑盒</p>
    <p>
      <el-button
        size="small"
        type="primary"
        @click="domRefFunc"
      >
        父组件触发子组件的ref
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="domAttrFunc"
      >
        父组件通过属性变化触发子组件的ref
      </el-button>
    </p>
    <h4>其他方法</h4>
    <p>通过子组件监听父组件属性的变化也可让子组件直接操作相关方法，但有个问题不能忽略，就是子组件是watch这个props，这个属性要有改变才能监听到。比如示例的子组件input获取焦点focus，父组件第一次改变其属性isFocus由false->true，可以被子组件watch到，但后续什么时机改变这个值为false，要做特殊的逻辑处理，否则下次点击可能就不会监听到属性isFocus变化，就不会触发子组件的相关dom方法。</p>
  </div>
</template>
<script>
import RefOptionsChild from './ref-options-child'
export default {
  components: {
    RefOptionsChild,
  },
  data () {
    return{
      isFocus: false
    }
  },
  methods: {
    domRefFunc () {
      this.$refs.parentRefOptions.domRefFunc()
      // 虽然父组件可以通过$refs直接使用子组件暴露给父组件的方法，但console时父组件的$refs拿不到传给子组件的任何数据，也拿不到子组件自身定义的任何数据，哪怕是暴露到外边的方法，相当于子组件完全是一个黑盒
      console.log('redM',this.$refs.parentRefOptions)
      console.log('redM',this.$refs.parentRefOptions.message)
    },
    domAttrFunc () {
      this.isFocus = true
    }
  }

}
</script>
