<template>
  <div class="config-form">
    <div class="config-form__item" style="align-items: flex-start;">
      <label style="padding-top: 4px;">媒体文件</label>
      <media-uploader
        :media-list="config.mediaList"
        :max="9"
        @update="list => emit('update', { mediaList: list })"
      />
    </div>
    <div class="config-form__item">
      <label>自动轮播</label>
      <el-switch v-model="localAutoPlay" />
    </div>
    <div v-if="localAutoPlay" class="config-form__item">
      <label>间隔(秒)</label>
      <el-input-number v-model="localInterval" size="small" :min="1" :max="60" :controls="false" style="width:100%" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import MediaUploader from '../../media-uploader.vue'

const props = defineProps({ config: { type: Object, default: () => ({}) } })
const emit = defineEmits(['update'])

const localAutoPlay = computed({
  get: () => !!props.config.autoPlay,
  set: val => emit('update', { autoPlay: val }),
})
const localInterval = computed({
  get: () => props.config.interval || 3,
  set: val => emit('update', { interval: val }),
})
</script>
