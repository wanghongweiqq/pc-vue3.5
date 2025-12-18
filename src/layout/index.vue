<template>
  <div class="ly-wraper">
    <ly-aside />
    <div class="ly-contain">
      <ly-header />
      <router-view
        :key="$route.fullpath"
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
  }
}
</script>
<style lang="scss">
html,body{height:100%;}
#app {
  height: 100%;
  .ly-wraper {
    display: flex;
    height: 100%;
    .ly-contain {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width:1000px;
    }
    .ly-main {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      overflow: auto;
      padding-left:15px;
      background: #eef3f6;
    }
  }
}
</style>
