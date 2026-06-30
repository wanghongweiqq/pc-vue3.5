<template>
  <div class="config-form">
    <div class="config-form__item">
      <label>方向</label>
      <el-select v-model="localDirection" size="small">
        <el-option value="horizontal" label="横线" />
        <el-option value="vertical" label="竖线" />
      </el-select>
    </div>
    <div class="config-form__item">
      <label>线条色</label>
      <el-color-picker v-model="localColor" />
    </div>
    <div class="config-form__item">
      <label>线条宽度</label>
      <el-input-number v-model="localLineWidth" size="small" :min="1" :max="100" :controls="false" style="width:100%" />
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

const props = defineProps({ config: { type: Object, default: () => ({}) } })
const emit = defineEmits(['update'])

const localDirection = computed({
  get: () => props.config.direction || 'horizontal',
  set: val => emit('update', { direction: val }),
})
const localColor = computed({
  get: () => props.config.color || '#333333',
  set: val => emit('update', { color: val || '#333333' }),
})
const localLineWidth = computed({
  get: () => props.config.lineWidth ?? 2,
  set: val => emit('update', { lineWidth: val }),
})
const localOpacityPct = computed({
  get: () => Math.round((props.config.opacity ?? 1) * 100),
  set: val => emit('update', { opacity: val / 100 }),
})
</script>
