<template>
  <div class="config-form">
    <div class="config-form__item">
      <label>文本内容</label>
      <el-input v-model="localContent" type="textarea" :rows="3" placeholder="请输入文本内容" />
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { FONT_FAMILY_OPTIONS } from '../options.js'

const props = defineProps({ config: { type: Object, default: () => ({}) } })
const emit = defineEmits(['update'])

const localContent = computed({
  get: () => props.config.content ?? '',
  set: val => emit('update', { content: val }),
})
const localFontSize = computed({
  get: () => props.config.fontSize || 32,
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
</script>
