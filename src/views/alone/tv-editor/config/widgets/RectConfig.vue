<template>
  <div class="config-form">
    <div class="config-form__item">
      <label>填充背景</label>
      <el-switch v-model="localHasFill" />
      <el-color-picker v-if="localHasFill" v-model="localFillColor" class="config-form__color-addon" />
    </div>
    <div class="config-form__item">
      <label>边框色</label>
      <el-color-picker v-model="localBorderColor" />
    </div>
    <div class="config-form__item">
      <label>边框宽度</label>
      <el-input-number v-model="localBorderWidth" size="small" :min="0" :max="50" :controls="false" style="width:100%" />
    </div>
    <div class="config-form__item">
      <label>边框类型</label>
      <el-select v-model="localBorderStyle" size="small">
        <el-option v-for="opt in BORDER_STYLE_OPTIONS" :key="opt.value" :value="opt.value" :label="opt.label" />
      </el-select>
    </div>
    <div class="config-form__item">
      <label>圆角</label>
      <el-input-number v-model="localBorderRadius" size="small" :min="0" :max="500" :controls="false" style="width:100%" />
    </div>
    <div class="config-form__item config-form__item--slider">
      <label>不透明度</label>
      <el-slider v-model="localOpacityPct" :min="0" :max="100" />
      <span class="config-form__tip">{{ localOpacityPct }}%</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { BORDER_STYLE_OPTIONS } from '../options.js'

const props = defineProps({ config: { type: Object, default: () => ({}) } })
const emit = defineEmits(['update'])

const localHasFill = computed({
  get: () => !!props.config.hasFill,
  set: val => emit('update', { hasFill: val }),
})
const localFillColor = computed({
  get: () => props.config.fillColor || '#ffffff',
  set: val => emit('update', { fillColor: val || '#ffffff' }),
})
const localBorderColor = computed({
  get: () => props.config.borderColor || '#333333',
  set: val => emit('update', { borderColor: val || '#333333' }),
})
const localBorderWidth = computed({
  get: () => props.config.borderWidth ?? 2,
  set: val => emit('update', { borderWidth: val }),
})
const localBorderStyle = computed({
  get: () => props.config.borderStyle || 'solid',
  set: val => emit('update', { borderStyle: val }),
})
const localBorderRadius = computed({
  get: () => props.config.borderRadius ?? 0,
  set: val => emit('update', { borderRadius: val }),
})
// Slider 用 0~100 整数，存储时换算为 0~1
const localOpacityPct = computed({
  get: () => Math.round((props.config.opacity ?? 1) * 100),
  set: val => emit('update', { opacity: val / 100 }),
})
</script>
