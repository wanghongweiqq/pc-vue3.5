<template>
  <div class="content">
    <h2>子组件直接修改父组件的属性</h2>
    <p>
      <el-button
        size="small"
        type="primary"
        @click="showImage"
      >
        展示查看大图弹窗
      </el-button>
    </p>
    <CpSeeimages
      v-model:image-show="isShowImage"
      :image-data="imageData"
    />
    <h3>Vue 3.0+ 使用v-model的形式修改</h3>
    <p>父组件传到子组件的props默认为：modelValue</p>
    <p>子组件触发父组件更新的事件默认为：update:modelValue</p>
    <p>不建议使用默认值，更建议使用具体名称的属性，如：v-model:xxxYyy的形式修改</p>
    <p>v-model:xxxYy 建议使用驼峰，在父组件中可以使用驼峰也可使用短横线, 在子组件中建议直接定义属性xxxYy，短横线的格式部分场景会有问题，定义属性（eslint报错）、watch中监听属性（监听不到）、模版中使用属性（无法识别）。其实html不区分大小写，js区分大小写）</p>
    <p>其实这是一个语法糖，父组件绑定一个事件：@update:modelValue，具名时为：@update:xxxYyy，子组件触发：this.$emit('update:modelValue', false)，具名时为：this.$emit('update:xxxYyy', false)</p>
    <h3>Vue 2.0+ 使用xxx-yyy.sync的形式修改</h3>
    <p>父组件传到子组件的props为：xxxYyy</p>
    <p>子组件触发父组件更新的事件默认为：update:xxxYyy</p>
    <p>其实这也是一个语法糖，父组件绑定一个事件：@update:xxxYyy</p>
    <p>另外在该版本中v-model，传递给子组件的属性为：value,事件名称为：input。</p>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import CpSeeimages from '@/components/seeimages/'

const isShowImage = ref(false)
const imageData = [
  require('@/assets/images/ziyi-2.jpeg'),
  require('@/assets/images/jiayi-4.jpeg'),
]

const showImage = () => {
  isShowImage.value = true
}
</script>
