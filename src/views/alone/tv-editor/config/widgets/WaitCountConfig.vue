<template>
  <div class="config-form">
    <div class="config-form__item">
      <label>桌型</label>
      <el-select v-model="localTableType" size="small">
        <el-option value="" label="全部" />
        <el-option v-for="t in TABLE_TYPE_OPTIONS" :key="t.id" :value="t.id" :label="t.name" />
      </el-select>
    </div>
    <div class="config-form__item">
      <label>最大桌数</label>
      <el-input-number v-model="localMaxDisplay" size="small" :min="0" :controls="false" style="width:100%" />
      <span class="config-form__tip">0=不限</span>
    </div>
    <div class="config-form__item">
      <label>显示叫号</label>
      <el-switch v-model="localShowCallNum" />
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
import { mockWaitCount } from '../../mock/tv-editor.js'

const props = defineProps({ config: { type: Object, default: () => ({}) } })
const emit = defineEmits(['update'])

const TABLE_TYPE_OPTIONS = mockWaitCount.tableTypes

const localTableType = computed({
  get: () => props.config.tableType || '',
  set: val => emit('update', { tableType: val }),
})
const localMaxDisplay = computed({
  get: () => props.config.maxDisplay || 0,
  set: val => emit('update', { maxDisplay: val }),
})
const localShowCallNum = computed({
  get: () => !!props.config.showCallNum,
  set: val => emit('update', { showCallNum: val }),
})
const localFontSize = computed({
  get: () => props.config.fontSize || 40,
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
