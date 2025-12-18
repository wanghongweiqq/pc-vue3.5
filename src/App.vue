<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <component :is="Component" />
    </transition>
  </router-view>
  <!-- <router-view :key="$route.fullpath" /> -->
  <!-- <transition name="fade">
      <router-view :key="$route.fullpath" />
    </transition> -->
</template>
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
