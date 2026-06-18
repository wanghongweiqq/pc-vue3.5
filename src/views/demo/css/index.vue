<template>
  <div class="pg-css">
    <div class="ly-box">
      <CpCrumbs />
      <el-tabs v-model="activeTab">
        <el-tab-pane
          label="时间翻转"
          name="time"
        >
          <Time />
        </el-tab-pane>
        <el-tab-pane
          label="Flex 布局"
          name="flex"
        >
          <Flex />
        </el-tab-pane>
        <el-tab-pane
          label="Baseline"
          name="baseline"
        >
          <Baseline />
        </el-tab-pane>
        <el-tab-pane
          label="Grid 布局"
          name="grid"
        >
          <Grid />
        </el-tab-pane>
        <el-tab-pane
          label="CSS 属性"
          name="property"
        >
          <Property />
        </el-tab-pane>
        <el-tab-pane
          label="图片与背景图"
          name="image-bg"
        >
          <ImageBg />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import CpCrumbs from '@/components/crumbs/'
import Flex from './flex'
import Property from './property'
import Baseline from './baseline'
import Grid from './grid'
import Time from './time'
import ImageBg from './image-bg'

export default {
  components: {
    CpCrumbs,
    Flex,
    Baseline,
    Grid,
    Property,
    Time,
    ImageBg,
  },
  data () {
    return {
      activeTab: 'time',
    }
  },
}
</script>
