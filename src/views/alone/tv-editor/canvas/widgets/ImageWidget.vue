<template>
  <div class="widget-image">
    <template v-if="mediaList.length">
      <div class="widget-image__swiper" :style="swiperStyle">
        <div v-for="(item, i) in mediaList" :key="i" class="widget-image__slide">
          <img v-if="item.type === 2" :src="item.url" class="widget-image__media" />
          <video v-else :src="item.url" class="widget-image__media" muted loop />
        </div>
      </div>
    </template>
    <div v-else class="widget-image__placeholder">
      <span>图片/视频</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'

const componentProps = defineProps({
  props: { type: Object, default: () => ({}) },
})

const currentIndex = ref(0)
let timer = null

const mediaList = computed(() => componentProps.props.mediaList || [])

const swiperStyle = computed(() => ({
  display: 'flex',
  width: '100%',
  height: '100%',
  transform: `translateX(-${currentIndex.value * 100}%)`,
  transition: 'transform 0.5s ease',
}))

function startTimer() {
  const interval = (componentProps.props.interval || 3) * 1000
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % mediaList.value.length
  }, interval)
}

function clearTimer() {
  if (timer) { clearInterval(timer); timer = null }
}

watch(() => componentProps.props.autoPlay, (val) => {
  clearTimer()
  if (val && mediaList.value.length > 1) startTimer()
}, { immediate: true })

watch(() => componentProps.props.interval, () => {
  if (componentProps.props.autoPlay) { clearTimer(); startTimer() }
})

onBeforeUnmount(clearTimer)
</script>

<style scoped>
.widget-image {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.widget-image__slide {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
}

.widget-image__media {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.widget-image__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
}
</style>
