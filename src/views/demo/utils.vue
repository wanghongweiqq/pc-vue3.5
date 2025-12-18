<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2021-09-06 16:51:58
 * @Description: 页面/组件/功能的描述
 * @FilePath: /vue3.0/src/views/demo/utils.vue
-->
<template>
  <div class="pg-utils">
    <div class="ly-box">
      <cp-crumbs />
      <div class="content">
        <!-- <p>{{ Math.random() }}</p> -->
        <!-- <p>{{ Number(123).toFixed(2) }}</p> -->
        <h2>在3.x中，filters过滤器被删除，不再受支持。相反，我们建议用方法调用或计算属性替换它们</h2>
        <!-- <p> formatThousands：12345.5：{{ 12345.5|formatThousands }}</p>
          <p>formatThousands：123456.565：{{ 123456.565|formatThousands }}</p> -->
        <!-- <p>formatTime：1236655500：{{ 1236655500|formatTime }}</p>
          <p>formatTime对无效值的判断-''：{{ ''|formatTime('YYYY-MM-DD') }}</p>
          <p>formatTime对无效值的判断-undefined：{{ undefined|formatTime }}</p>
          <p>formatTime对无效值的判断-null：{{ null|formatTime }}</p>
          <p>formatTime：new Date('2020/01/01 12:00:00')：{{ new Date('2020/01/01 12:00:00')|formatTime('YYYY-MM-DD hh:mm') }}</p> -->
        <p>特殊处理的日期格式：{{ $utils.formatTime('2021-01-25','YYYYMMDD') }}</p>
        <p>获取本周时间：{{ $utils.formatTime($utils.getWeekDate(new Date())[0])+'至'+$utils.formatTime($utils.getWeekDate(new Date())[1]) }}</p>
        <p>获取本周时间（到当前）：{{ $utils.formatTime($utils.getWeekDate(new Date(),true)[0])+'至'+$utils.formatTime($utils.getWeekDate(new Date(),true)[1]) }}</p>
        <p>获取月时间：{{ $utils.formatTime($utils.getMonthDate('2021-01-17')[0])+'至'+$utils.formatTime($utils.getMonthDate('2021-01-17')[1]) }}</p>
        <p>获取月时间（到当前）：{{ $utils.formatTime($utils.getMonthDate(new Date(),true)[0])+'至'+$utils.formatTime($utils.getMonthDate(new Date(),true)[1]) }}</p>
        <p>否点数计算-加法(0.1 , 0.2)：{{ $utils.math().add(0.1 , 0.2) }}</p>
        <p>否点数计算-加法(1 , 0.02)：{{ $utils.math().add(1 , 0.02) }}</p>
        <p>否点数计算-减法(0.3 , 0.2)：{{ $utils.math().subtract(0.3 , 0.2) }}</p>
        <p>否点数计算-乘法(4.39 , 100)：{{ $utils.math().multiply(4.39 , 100) }}</p>
        <p>否点数计算-除法(2.7/9)：{{ 2.7/9 }}</p>
        <p>否点数计算-除法(2.7,9)：{{ $utils.math().divide(2.7,9) }}</p>
        <p>否点数计算-除法(Math.divide(2.7,9))：{{ Math.divide(2.7,9) }}</p>
        <p>数字展示为两位小数-''：{{ $utils.formatFloat('') }}</p>
        <p>数字展示为两位小数-null：{{ $utils.formatFloat(null) }}</p>
        <p>数字展示为两位小数-0：{{ $utils.formatFloat(0) }}</p>
        <p>数字展示为两位小数-'100'：{{ $utils.formatFloat('100') }}</p>
        <p>数字展示为两位小数-1.335：{{ $utils.formatFloat(1.335) }}</p>
        <p>1.335.toFixed(2)：{{ 1.335.toFixed(2) }}</p>
        <p>regExp0To99999Float2：{{ $regExp.regExp0To99999Float2.test('01.35') }}</p>
        <p>强密码(必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-10之间)：{{ $regExp.regExpStrongPassword.test('Abcd1234') }}</p>
        <p>强密码(必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-10之间)：{{ $regExp.regExpStrongPassword.test('1Abcdef1aA') }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/assets/js/utils'
import mixins from '@/assets/js/mixins'
import CpCrumbs from '@/components/crumbs/'

export default {
  components: {
    CpCrumbs,
  },
  mixins: [mixins],
  mounted () {

    // console.log( Math.add(1,2))
    // console.log( Math.multiply(0.3,9))
    // console.log( Number('1.335').toFixed(2))
    // console.log( Number('123').toFixed(2))
  },
  methods: {
    getWeek () {
      return utils.getWeekDate(new Date())
    },
  }
}
</script>

<style lang="scss">
.pg-utils{

}
</style>
