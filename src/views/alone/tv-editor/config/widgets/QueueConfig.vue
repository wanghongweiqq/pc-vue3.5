<template>
  <div class="config-form">
    <div class="config-form__item">
      <label>数据类型</label>
      <el-select v-model="localDataType" size="small">
        <el-option value="wait" label="等位队列" />
        <el-option value="call" label="叫号队列" />
      </el-select>
    </div>
    <div class="config-form__item">
      <label>行数</label>
      <el-input-number v-model="localRows" size="small" :min="1" :max="20" :controls="false" style="width:100%" />
    </div>
    <div class="config-form__item">
      <label>列数</label>
      <el-input-number v-model="localCols" size="small" :min="1" :max="10" :controls="false" style="width:100%" />
    </div>
    <div class="config-form__item">
      <label>字号</label>
      <el-input-number v-model="localFontSize" size="small" :min="8" :max="200" :controls="false" style="width:100%" />
    </div>
    <div class="config-form__item">
      <label>字色</label>
      <el-color-picker v-model="localColor" />
    </div>
    <div class="config-form__item">
      <label>加粗</label>
      <el-switch v-model="localBold" />
    </div>
    <div class="config-form__item">
      <label>字体</label>
      <el-select v-model="localFontFamily" size="small">
        <el-option v-for="opt in FONT_FAMILY_OPTIONS" :key="opt.value" :value="opt.value" :label="opt.label" />
      </el-select>
    </div>
    <div class="config-form__item">
      <label>间距(px)</label>
      <el-input-number v-model="localLetterSpacing" size="small" :min="0" :max="100" :controls="false" style="width:100%" />
    </div>
    <div class="config-form__item">
      <label>显示标题</label>
      <el-switch v-model="localShowTitle" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FONT_FAMILY_OPTIONS } from '../options.js'

const props = defineProps({ config: { type: Object, default: () => ({}) } })
const emit = defineEmits(['update'])

const localDataType = computed({
  get: () => props.config.dataType || 'wait',
  set: val => emit('update', { dataType: val }),
})
const localRows = computed({
  get: () => props.config.rows || 4,
  set: val => emit('update', { rows: val }),
})
const localCols = computed({
  get: () => props.config.cols || 3,
  set: val => emit('update', { cols: val }),
})
const localFontSize = computed({
  get: () => props.config.fontSize || 28,
  set: val => emit('update', { fontSize: val }),
})
const localColor = computed({
  get: () => props.config.color || '#333333',
  set: val => emit('update', { color: val || '#333333' }),
})
const localBold = computed({
  get: () => !!props.config.bold,
  set: val => emit('update', { bold: val }),
})
const localFontFamily = computed({
  get: () => props.config.fontFamily || '',
  set: val => emit('update', { fontFamily: val }),
})
const localLetterSpacing = computed({
  get: () => props.config.letterSpacing || 0,
  set: val => emit('update', { letterSpacing: val }),
})
const localShowTitle = computed({
  get: () => !!props.config.showTitle,
  set: val => emit('update', { showTitle: val }),
})
</script>
