<template>
  <div class="ratio-dialog__mask">
    <div class="ratio-dialog">
      <div class="ratio-dialog__title">
        选择 TV 宽高比
      </div>
      <div class="ratio-dialog__desc">
        请根据您的 TV 屏幕方向选择合适的比例，确认后即可开始设计
      </div>

      <!-- 预设选项 -->
      <div class="ratio-dialog__options">
        <div
          v-for="opt in ratioOptions"
          :key="opt.value"
          :class="['ratio-dialog__option', { 'ratio-dialog__option--selected': selected === opt.value }]"
          @click="onSelectPreset(opt.value)"
        >
          <div
            class="ratio-dialog__preview"
            :style="previewStyle(opt)"
          />
          <div class="ratio-dialog__preview-value">
            {{ opt.value }}
          </div>
        </div>

        <!-- 自定义选项卡 -->
        <div
          :class="['ratio-dialog__option', 'ratio-dialog__option--custom',
                   { 'ratio-dialog__option--selected': selected === 'custom' }]"
          @click="onSelectCustom"
        >
          <div
            class="ratio-dialog__preview"
            :style="customPreviewStyle"
          />
          <div class="ratio-dialog__preview-value">
            自定义
          </div>
        </div>
      </div>

      <!-- 自定义比例输入区 -->
      <transition name="ratio-fade">
        <div
          v-if="selected === 'custom'"
          class="ratio-dialog__custom"
        >
          <div class="ratio-dialog__custom-label">
            输入宽高比（如 16:9 的 TV 请输入 16 和 9）
          </div>
          <div class="ratio-dialog__custom-inputs">
            <input
              ref="inputWRef"
              class="ratio-dialog__custom-input"
              type="number"
              min="1"
              max="99"
              :value="customW"
              placeholder="宽"
              @input="onCustomWInput"
            >
            <span class="ratio-dialog__custom-colon">:</span>
            <input
              class="ratio-dialog__custom-input"
              type="number"
              min="1"
              max="99"
              :value="customH"
              placeholder="高"
              @input="onCustomHInput"
            >
          </div>
          <div
            v-if="customError"
            class="ratio-dialog__custom-error"
          >
            {{ customError }}
          </div>
        </div>
      </transition>

      <!-- 底部按钮 -->
      <div class="ratio-dialog__footer">
        <el-button
          type="primary"
          size="large"
          :disabled="!canConfirm"
          @click="onConfirm"
        >
          开始编辑
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { RATIO_OPTIONS, calcCanvasHeight, initCanvas } from './useEditorStore.js'

const CANVAS_W = 750

const selected = ref('16:9')
const customW = ref('')
const customH = ref('')
const customError = ref('')
const inputWRef = ref(null)

const customHeight = computed(() => {
  const w = parseInt(customW.value, 10)
  const h = parseInt(customH.value, 10)
  if (!w || !h || w <= 0 || h <= 0) return 0
  return Math.round(CANVAS_W / (w / h))
})

const customPreviewStyle = computed(() => {
  const maxW = 54
  const w = parseInt(customW.value, 10) || 16
  const h = parseInt(customH.value, 10) || 9
  const ratio = w / h
  const pw = ratio >= 1 ? maxW : Math.round(maxW * ratio)
  const ph = ratio >= 1 ? Math.round(maxW / ratio) : maxW
  return {
    width: `${ pw }px`,
    height: `${ ph }px`,
    border: '2px solid currentColor',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    margin: '0 auto 8px',
  }
})

const canConfirm = computed(() => {
  if (selected.value === 'custom') return customHeight.value > 0 && !customError.value
  return !!selected.value
})

function previewStyle (opt) {
  const maxW = 54
  const ratio = opt.w / opt.h
  const w = ratio >= 1 ? maxW : Math.round(maxW * ratio)
  const h = ratio >= 1 ? Math.round(maxW / ratio) : maxW
  return {
    width: `${ w }px`,
    height: `${ h }px`,
    border: '2px solid currentColor',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    margin: '0 auto',
  }
}

function onSelectPreset (value) {
  selected.value = value
  customError.value = ''
}

function onSelectCustom () {
  selected.value = 'custom'
  nextTick(() => {
    inputWRef.value && inputWRef.value.focus()
  })
}

function validateCustom () {
  const w = parseInt(customW.value, 10)
  const h = parseInt(customH.value, 10)
  if (!w || !h) { customError.value = '请输入完整的宽高比数值'; return false }
  if (w <= 0 || h <= 0) { customError.value = '宽高比数值必须大于 0'; return false }
  if (w > 99 || h > 99) { customError.value = '宽高比数值不能超过 99'; return false }
  customError.value = ''
  return true
}

function onCustomWInput (e) {
  customW.value = e.target.value
  if (customW.value && customH.value) validateCustom()
}

function onCustomHInput (e) {
  customH.value = e.target.value
  if (customW.value && customH.value) validateCustom()
}

function onConfirm () {
  if (selected.value === 'custom') {
    if (!validateCustom()) return
    const w = parseInt(customW.value, 10)
    const h = parseInt(customH.value, 10)
    initCanvas(`${ w }:${ h }`, w, h)
  } else {
    initCanvas(selected.value)
  }
}

const ratioOptions = RATIO_OPTIONS
</script>

<style scoped>
.ratio-dialog__mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 60%);
}

.ratio-dialog {
  width: 580px;
  max-width: calc(100vw - 32px);
  padding: 32px 36px 28px;
  background: #fff;
  border-radius: 12px;
}

.ratio-dialog__title {
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 700;
  color: #191919;
  text-align: center;
}

.ratio-dialog__desc {
  margin-bottom: 28px;
  font-size: 13px;
  line-height: 1.6;
  color: #999;
  text-align: center;
}

.ratio-dialog__options {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 0;
}

.ratio-dialog__option {
  flex-shrink: 0;
  width: 88px;
  padding: 12px 6px 10px;
  color: #999;
  text-align: center;
  cursor: pointer;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
}

.ratio-dialog__option:hover {
  color: #409eff;
  background: #ecf5ff;
  border-color: #409eff;
}

.ratio-dialog__option--selected {
  color: #409eff;
  background: #ecf5ff;
  border-color: #409eff;
}

.ratio-dialog__option--custom {
  border-style: dashed;
}

.ratio-dialog__preview-value {
  margin-top: 8px;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 700;
  color: inherit;
}

.ratio-dialog__custom {
  padding: 16px 20px;
  margin-top: 20px;
  background: #ecf5ff;
  border: 1px solid #b3d8ff;
  border-radius: 8px;
}

.ratio-dialog__custom-label {
  margin-bottom: 12px;
  font-size: 13px;
  color: #555;
  text-align: center;
}

.ratio-dialog__custom-inputs {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.ratio-dialog__custom-input {
  width: 72px;
  height: 36px;
  padding: 0 10px;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  text-align: center;
  outline: none;
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.ratio-dialog__custom-input:focus {
  border-color: #409eff;
}

.ratio-dialog__custom-input::-webkit-inner-spin-button,
.ratio-dialog__custom-input::-webkit-outer-spin-button {
  margin: 0;
  appearance: none;
}

.ratio-dialog__custom-colon {
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
  color: #333;
}

.ratio-dialog__custom-error {
  margin-top: 8px;
  font-size: 12px;
  color: #f5222d;
  text-align: center;
}

.ratio-dialog__footer {
  margin-top: 28px;
  text-align: center;
}

/* Vue 3 过渡类名：enter → enter-from */
.ratio-fade-enter-active,
.ratio-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.ratio-fade-enter-from,
.ratio-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
