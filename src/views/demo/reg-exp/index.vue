<template>
  <div class="pg-reg-exp">
    <cp-crumbs />
    <el-tabs v-model="activeTab">
      <el-tab-pane
        label="正则表达式"
        name="intro"
      >
        <RegexpIntro />
      </el-tab-pane>
      <el-tab-pane
        label="捕获组"
        name="capture"
      >
        <RegexpCapture />
      </el-tab-pane>
      <el-tab-pane
        label="replace"
        name="replace"
      >
        <RegexpReplace />
      </el-tab-pane>
      <el-tab-pane
        label="换行操作"
        name="newline"
      >
        <RegexpNewline />
      </el-tab-pane>
      <el-tab-pane
        label="反斜杠匹配"
        name="slash"
      >
        <RegexpSlash />
      </el-tab-pane>
      <el-tab-pane
        label="Unicode"
        name="unicode"
      >
        <RegexpUnicode />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import CpCrumbs from '@/components/crumbs/'
import RegexpIntro from './regexp-intro'
import RegexpCapture from './regexp-capture'
import RegexpReplace from './regexp-replace'
import RegexpNewline from './regexp-newline'
import RegexpSlash from './regexp-slash'
import RegexpUnicode from './regexp-unicode'

const activeTab = ref('intro')
</script>
<style lang="scss">
.pg-reg-exp {
  .pre-wrap {
    white-space: pre-wrap;
  }

  .no-style {
    padding: 5px 0;
    font-family: "Microsoft YaHei", "微软雅黑", sans-serif;
    background-color: transparent;
  }
}
</style>
