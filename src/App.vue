<template>
  <el-config-provider :locale="zhCn">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
    <!-- <router-view :key="$route.fullpath" /> -->
    <!-- <transition name="fade">
        <router-view :key="$route.fullpath" />
      </transition> -->
  </el-config-provider>
</template>
<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
</script>
<style lang="scss">
#app {
  >.fade-enter-active,
  >.fade-leave-acitve {
    transition: all 0.4s ease-in-out 0s;
  }

  >.fade-enter-from,
  >.fade-leave-to {
    opacity: 0;
    transform: translate(0, -50%);
  }
}
</style>
