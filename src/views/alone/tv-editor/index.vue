<template>
  <div ref="editorRootRef" class="tv-editor" @keydown="onKeyDown" tabindex="-1">
    <!-- 比例选择弹窗（第一步） -->
    <ratio-dialog v-if="state.showRatioDialog" />

    <!-- 顶部操作栏 -->
    <div class="tv-editor__header">
      <div class="tv-editor__header-left">
        <el-button text @click="onBack">← 返回</el-button>
        <el-input
          v-model="state.templateName"
          placeholder="请输入模版名称"
          :maxlength="20"
          class="tv-editor__template-name"
        />
      </div>
      <div class="tv-editor__header-right">
        <div class="tv-editor__history-btns">
          <el-button :disabled="!canUndo" title="撤销 (Ctrl+Z)" @click="undo">↩</el-button>
          <el-button :disabled="!canRedo" title="重做 (Ctrl+Shift+Z)" @click="redo">↪</el-button>
        </div>
        <span v-if="state.isDirty" class="tv-editor__dirty">● 未保存</span>
        <el-button type="primary" :loading="saving" :disabled="saving" @click="onSave">
          保存
        </el-button>
      </div>
    </div>

    <!-- 主体三栏 -->
    <div class="tv-editor__body">
      <component-panel />
      <editor-canvas />
      <config-panel />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import state, {
  deleteComponent, serialize, markSaved,
  undo, redo, canUndo, canRedo,
  deserialize, duplicateComponent, nudgeComponent,
} from './useEditorStore.js'
import { ajaxSaveCustomTemplate, ajaxQueryCustomTemplate } from '@/service/apis/tv-editor.js'
import RatioDialog from './RatioDialog.vue'
import ComponentPanel from './components/ComponentPanel.vue'
import EditorCanvas from './canvas/EditorCanvas.vue'
import ConfigPanel from './config/ConfigPanel.vue'
import './editor.scss'

const route = useRoute()
const router = useRouter()

const editorRootRef = ref(null)
const saving = ref(false)

// 从路由参数初始化：configName 预填模版名、templateId 触发回填
const routeQuery = route.query || {}
if (routeQuery.configName && !state.templateName) {
  state.templateName = routeQuery.configName
}

onMounted(async () => {
  editorRootRef.value && editorRootRef.value.focus()
  if (routeQuery.templateId) {
    try {
      const res = await ajaxQueryCustomTemplate({ templateId: routeQuery.templateId })
      if (res && res.code === 200 && res.data) {
        deserialize(res.data)
      }
    } catch (e) {
      ElMessage.error('模版加载失败')
    }
  }
})

function onKeyDown(e) {
  const tag = document.activeElement && document.activeElement.tagName
  const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable

  if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
    e.preventDefault(); undo(); return
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
    e.preventDefault(); redo(); return
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault()
    if (state.selectedId) duplicateComponent(state.selectedId)
    return
  }
  if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedId && !isInput) {
    deleteComponent(state.selectedId); return
  }
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && state.selectedId && !isInput) {
    e.preventDefault()
    const step = e.shiftKey ? 10 : 1
    let dx = 0; let dy = 0
    if (e.key === 'ArrowLeft') dx = -step
    else if (e.key === 'ArrowRight') dx = step
    if (e.key === 'ArrowUp') dy = -step
    else if (e.key === 'ArrowDown') dy = step
    nudgeComponent(state.selectedId, dx, dy)
  }
}

async function onSave() {
  if (!state.templateName.trim()) {
    ElMessage.warning('请输入模版名称')
    return
  }
  saving.value = true
  try {
    const shopIds = routeQuery.shopIds
      ? routeQuery.shopIds.split(',').filter(Boolean)
      : []
    const data = {
      ...serialize(),
      shopIds,
      ...(routeQuery.templateId ? { templateId: routeQuery.templateId } : {}),
    }
    const res = await ajaxSaveCustomTemplate(data)
    if (res && res.code === 200) {
      markSaved()
      ElMessage.success('保存成功')
    } else {
      ElMessage.error((res && res.msg) || '保存失败，请重试')
    }
  } catch (err) {
    ElMessage.error('保存失败，请检查网络')
  } finally {
    saving.value = false
  }
}

function onBack() {
  if (state.isDirty) {
    ElMessageBox.confirm('有未保存内容，确认离开？', '提示', {
      confirmButtonText: '确认离开',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      router.back()
    }).catch(() => {})
  } else {
    router.back()
  }
}
</script>

<style>
/* 全局 box-sizing 重置，限制在编辑器根节点下 */
.tv-editor,
.tv-editor *,
.tv-editor *::before,
.tv-editor *::after {
  box-sizing: border-box;
}
</style>

<style scoped>
.tv-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  outline: none;
  overflow: hidden;
  background: #f5f5f5;
}

.tv-editor__header {
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  height: 52px;
  padding: 0 16px;
  border-bottom: 1px solid #e8e8e8;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.tv-editor__header-left,
.tv-editor__header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tv-editor__history-btns {
  display: flex;
  gap: 4px;
}

.tv-editor__dirty {
  font-size: 12px;
  color: #e6a23c;
}

.tv-editor__template-name {
  width: 200px;
}

.tv-editor__body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>
