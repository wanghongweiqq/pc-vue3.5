<template>
  <div class="component-panel">
    <div class="component-panel__title">组件库</div>
    <div
      v-for="item in componentList"
      :key="item.type"
      class="component-panel__item"
      draggable="true"
      @dragstart="e => onDragStart(e, item.type)"
      @click="onAdd(item.type)"
    >
      <span class="component-panel__icon">{{ item.icon }}</span>
      <span class="component-panel__label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
import { COMPONENT_LIST, COMPONENT_REGISTRY } from './component-items/index.js'
import { addComponent } from '../useEditorStore.js'

function onDragStart(e, type) {
  e.dataTransfer.setData('componentType', type)
  e.dataTransfer.effectAllowed = 'copy'
}

function onAdd(type) {
  const { defaultProps, defaultSize } = COMPONENT_REGISTRY[type]
  addComponent(type, defaultProps, defaultSize)
}

const componentList = COMPONENT_LIST
</script>

<style scoped>
.component-panel {
  width: 140px;
  min-width: 140px;
  height: 100%;
  overflow-y: auto;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  padding: 12px 8px;
  box-sizing: border-box;
}

.component-panel__title {
  font-size: 13px;
  font-weight: 700;
  color: #666;
  margin-bottom: 12px;
  padding-left: 4px;
}

.component-panel__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 4px;
  margin-bottom: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  cursor: grab;
  font-size: 12px;
  color: #333;
  transition: border-color 0.2s, background 0.2s;
  user-select: none;
}

.component-panel__item:hover {
  border-color: #409eff;
  background: #f0f7ff;
}

.component-panel__item:active {
  cursor: grabbing;
}

.component-panel__icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.component-panel__label {
  text-align: center;
  line-height: 1.3;
}
</style>
