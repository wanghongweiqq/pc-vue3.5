<!--
 * @Description: console的日常使用
-->
<template>
  <div class="pg-console">
    <CpCrumbs />
    <el-tabs v-model="activeTab">
      <el-tab-pane
        label="方法总结"
        name="summary"
      >
        <ConsoleSummary />
      </el-tab-pane>
      <el-tab-pane
        label="实践对比"
        name="practice"
      >
        <ConsolePractice />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted } from 'vue'
import CpCrumbs from '@/components/crumbs/'
import ConsoleSummary from './console-summary'
import ConsolePractice from './console-practice'
import utils from '@/assets/js/utils'

const activeTab = ref('summary')

const obj = { a: 1,b: 3,c: 3,d: 4 }
const arr = [1,2,[3]]
const objDeep = { a: { b: { c: { d: 1 } } } }
const arrDeep = [1, [2, [3, [4, [5, 5.1], 4.1], 3.1], 2.1], 1.1]

const log = () => {
  console.log(obj)
  console.log(arr)
  console.log(objDeep)
  console.log(arrDeep)
}
const stringify = () => {
  console.log(JSON.stringify(obj))
  console.log(JSON.stringify(arr))
  console.log(JSON.stringify(objDeep))
  console.log(JSON.stringify(arrDeep))
}
const dir = () => {
  console.dir(obj)
  console.dir(arr)
  console.dir(objDeep)
  console.dir(arrDeep)
}
const table = () => {
  console.table(obj)
  console.table(arr)
  console.table(objDeep)
  console.table(arrDeep)
}
const trace = () => {
  console.trace()
}
const clear = () => {
  console.clear()
}
const style = () => {
  console.log('%c log/info/error等都支持%c的样式输出，同一节也就是同一个逗号内，只有第一个%c起作用', 'color: red; text-decoration:underline;')
}
const group = () => {
  console.group('%c接口请求：','color: purple',)
  console.log('%c URL:', 'color: red', 'meitian.com')
  console.log('%c Method:', 'color: red', 'post')
  console.log('%c Params:', 'color: red', '{ id : 1 }')
  console.log('%c Response:', 'color: red', '{ success : true }')
  console.groupEnd()
}
const time = async () => {
  console.time('myTimer')
  await utils.delay(1000)

  let sum = 0
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 100000000; j++) {
      sum += j
    }
    console.timeLog('myTimer', `完成第 ${ i + 1 } 次循环后的时间。`,`sum当前值为：${ sum }`)
  }
  console.timeEnd('myTimer')
}

onMounted(() => {
  time()
})
</script>
