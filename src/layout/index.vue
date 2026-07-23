<!--
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2026-06-29 08:18:00
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/layout/index.vue
-->
<template>
  <div class="ly-wraper">
    <ly-aside />
    <div class="ly-contain">
      <ly-header />
      <router-view
        :key="$route.fullPath"
        class="ly-main"
      />
    </div>
  </div>
</template>
<script>
import LyAside from '@/layout/aside'
import LyHeader from '@/layout/header'
export default {
  name: 'Layout',
  components: {
    LyAside,
    LyHeader
  },
  mounted () {
    this.$nextTick(() => {
      const hash = this.$route.hash
      if(hash) {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    })

  }
}
</script>
<style lang="scss">
html,
body { height: 100%; }

#app {
  height: 100%;

  .ly-wraper {
    display: flex;
    height: 100%;

    .ly-contain {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      min-width: 1000px;
    }

    .ly-main {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      padding: 0 15px 15px;
      overflow: auto;
      background: #eef3f6;
    }
  }
}
</style>
