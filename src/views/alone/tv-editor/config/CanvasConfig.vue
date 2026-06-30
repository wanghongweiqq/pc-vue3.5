<template>
  <div class="config-panel__section">
    <div class="config-panel__title">配置：画板</div>
    <div class="config-form">
      <div class="config-form__item">
        <label>比例</label>
        <span class="config-readonly">{{ state.canvas.ratio }}（{{ state.canvas.width }}×{{ state.canvas.height }}）</span>
      </div>
      <div class="config-form__item">
        <label>背景色</label>
        <el-color-picker v-model="localBackground" />
        <span class="config-form__tip">{{ state.canvas.background }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import state, { updateCanvas } from '../useEditorStore.js'

const localBackground = computed({
  get: () => state.canvas.background || '#ffffff',
  set: val => updateCanvas({ background: val || '#ffffff' }),
})
</script>
