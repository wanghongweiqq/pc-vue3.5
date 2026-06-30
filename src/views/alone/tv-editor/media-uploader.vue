<template>
  <div class="media-uploader">
    <p class="media-uploader__tip">图片：支持 JPG/PNG，大小 4MB 以内</p>
    <p class="media-uploader__tip">视频：支持 MP4，大小 700MB 以内</p>
    <div class="media-uploader__list">
      <!-- 已上传媒体列表 -->
      <div v-for="(item, i) in mediaList" :key="i" class="media-uploader__item">
        <img v-if="item.type === 2" :src="item.url" class="media-uploader__preview" />
        <video v-else :src="item.url" class="media-uploader__preview" />
        <span class="media-uploader__delete" @click="onDelete(i)">✕</span>
      </div>

      <!-- 上传按钮 -->
      <el-upload
        v-if="canUpload"
        :show-file-list="false"
        :before-upload="beforeUpload"
        :http-request="handleUpload"
        accept="image/jpeg,image/png,image/gif,video/mp4"
        class="media-uploader__upload"
      >
        <div class="media-uploader__btn">
          <span class="media-uploader__btn-icon">+</span>
          <span>上传图片/视频</span>
        </div>
      </el-upload>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  mediaList: { type: Array, default: () => [] },
  max: { type: Number, default: 9 },
})

const emit = defineEmits(['update'])

const canUpload = computed(() => props.mediaList.length < props.max)

const IMG_EXTS = ['jpg', 'jpeg', 'png', 'gif']
const VIDEO_EXTS = ['mp4']
const IMG_MAX_MB = 4
const VIDEO_MAX_MB = 700

function getExt(name) {
  return (name || '').split('.').pop().toLowerCase()
}

function calcMediaType(url) {
  const ext = getExt(url)
  return IMG_EXTS.includes(ext) ? 2 : 1 // 2=图片 1=视频
}

function beforeUpload(file) {
  const ext = getExt(file.name)
  const sizeMB = file.size / 1024 / 1024
  if (IMG_EXTS.includes(ext) && sizeMB > IMG_MAX_MB) {
    ElMessage.error(`图片大小不能超过 ${IMG_MAX_MB}MB`)
    return false
  }
  if (VIDEO_EXTS.includes(ext) && sizeMB > VIDEO_MAX_MB) {
    ElMessage.error(`视频大小不能超过 ${VIDEO_MAX_MB}MB`)
    return false
  }
  if (![...IMG_EXTS, ...VIDEO_EXTS].includes(ext)) {
    ElMessage.error('仅支持 JPG/PNG/GIF/MP4 格式')
    return false
  }
  return true
}

/**
 * 自定义上传：替换为实际项目的上传接口
 * 当前使用 FileReader 生成本地预览 URL（仅编辑器预览用）
 */
function handleUpload({ file, onSuccess, onError }) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const url = e.target.result
    const newList = [...props.mediaList, { type: calcMediaType(file.name), url }]
    emit('update', newList)
    onSuccess()
  }
  reader.onerror = onError
  reader.readAsDataURL(file)
}

function onDelete(index) {
  const newList = props.mediaList.filter((_, i) => i !== index)
  emit('update', newList)
}
</script>

<style scoped>
.media-uploader {
  width: 100%;
}

.media-uploader__tip {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.media-uploader__list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.media-uploader__item {
  position: relative;
  width: 72px;
  height: 54px;
  border-radius: 4px;
  overflow: visible;
  border: 1px solid #e8e8e8;
}

.media-uploader__preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.media-uploader__delete {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 16px;
  height: 16px;
  background: #f56c6c;
  color: #fff;
  border-radius: 50%;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
}

.media-uploader__upload :deep(.el-upload) {
  display: block;
}

.media-uploader__btn {
  width: 72px;
  height: 54px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 11px;
  color: #999;
  background: #fafafa;
  transition: border-color 0.2s;
}

.media-uploader__btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.media-uploader__btn-icon {
  font-size: 18px;
  line-height: 1;
  margin-bottom: 2px;
}
</style>
