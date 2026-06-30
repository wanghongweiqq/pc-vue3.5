<template>
  <div class="config-panel">
    <!-- 选中了组件 -->
    <template v-if="selected">
      <div class="config-panel__title">
        配置：{{ registryItem && registryItem.label }}
      </div>
      <!-- 位置 / 尺寸 -->
      <div class="config-panel__pos">
        <div class="config-panel__pos-item">
          <span class="config-panel__pos-label">X</span>
          <el-input :model-value="String(selected.x)" size="small" type="number" @input="val => updatePos('x', +val)" />
        </div>
        <div class="config-panel__pos-item">
          <span class="config-panel__pos-label">Y</span>
          <el-input :model-value="String(selected.y)" size="small" type="number" @input="val => updatePos('y', +val)" />
        </div>
        <div class="config-panel__pos-item">
          <span class="config-panel__pos-label">宽</span>
          <el-input :model-value="String(selected.width)" size="small" type="number" @input="val => updatePos('width', +val)" />
        </div>
        <div class="config-panel__pos-item">
          <span class="config-panel__pos-label">高</span>
          <el-input :model-value="String(selected.height)" size="small" type="number" @input="val => updatePos('height', +val)" />
        </div>
      </div>
      <!-- 层级调整 -->
      <div class="config-panel__layer">
        <span class="config-panel__layer-label">层级</span>
        <el-button size="small" @click="bringForward(selected.id)">↑ 上移一层</el-button>
        <el-button size="small" @click="sendBackward(selected.id)">↓ 下移一层</el-button>
      </div>
      <div class="config-panel__divider" />
      <!-- 组件专属配置面板 -->
      <!-- :key 绑定选中组件 id，切换组件时强制重新挂载，避免拾色器/开关等内部状态残留 -->
      <component :is="configComponent" :key="selected && selected.id" :config="selected.props" @update="onPropsUpdate" />
    </template>

    <!-- 未选中：显示画板全局配置 -->
    <canvas-config v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import state, { selectedComponent, updateComponent, updateComponentProps, bringForward, sendBackward } from '../useEditorStore.js'
import { COMPONENT_REGISTRY } from '../components/component-items/index.js'
import CanvasConfig from './CanvasConfig.vue'

const selected = computed(() => selectedComponent.value)
const registryItem = computed(() => (selected.value ? COMPONENT_REGISTRY[selected.value.type] : null))
const configComponent = computed(() => (registryItem.value ? registryItem.value.config : null))

function updatePos(key, val) {
  if (selected.value) updateComponent(selected.value.id, { [key]: val })
}

function onPropsUpdate(patch) {
  if (selected.value) updateComponentProps(selected.value.id, patch)
}
</script>

<style scoped>
.config-panel {
  box-sizing: border-box;
  width: 280px;
  min-width: 280px;
  max-width: 280px;
  height: 100%;
  padding: 16px 12px;
  border-left: 1px solid #e8e8e8;
  overflow-y: auto;
  background: #fff;
}

.config-panel__title {
  margin-bottom: 12px;
  font-weight: 700;
  font-size: 14px;
  color: #333;
}

.config-panel__pos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 12px;
  gap: 6px;
}

.config-panel__pos-item {
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
  gap: 4px;
}

.config-panel__pos-item :deep(.el-input) {
  flex: 1;
  width: 0;
}

.config-panel__pos-label {
  flex-shrink: 0;
  width: 2em;
  font-size: 12px;
  text-align: center;
  color: #999;
}

.config-panel__divider {
  height: 1px;
  margin: 12px 0;
  background: #f0f0f0;
}

.config-panel__layer {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.config-panel__layer-label {
  flex-shrink: 0;
  width: 2em;
  font-size: 12px;
  white-space: nowrap;
  color: #666;
}
</style>
