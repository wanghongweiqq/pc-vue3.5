/**
 * 组件注册表
 * 新增组件类型只需在此处注册，画板/配置面板无需改动
 */
import TextWidget from '../../canvas/widgets/TextWidget.vue'
import ImageWidget from '../../canvas/widgets/ImageWidget.vue'
import DateWidget from '../../canvas/widgets/DateWidget.vue'
import WaitCountWidget from '../../canvas/widgets/WaitCountWidget.vue'
import QueueWidget from '../../canvas/widgets/QueueWidget.vue'
import RectWidget from '../../canvas/widgets/RectWidget.vue'
import LineWidget from '../../canvas/widgets/LineWidget.vue'

import TextConfig from '../../config/widgets/TextConfig.vue'
import ImageConfig from '../../config/widgets/ImageConfig.vue'
import DateConfig from '../../config/widgets/DateConfig.vue'
import WaitCountConfig from '../../config/widgets/WaitCountConfig.vue'
import QueueConfig from '../../config/widgets/QueueConfig.vue'
import RectConfig from '../../config/widgets/RectConfig.vue'
import LineConfig from '../../config/widgets/LineConfig.vue'

export const COMPONENT_REGISTRY = {
  text: {
    label: '文本',
    icon: 'T',
    widget: TextWidget,
    config: TextConfig,
    defaultProps: { content: '请输入文本', fontSize: 32, color: '#333333', bold: false, fontFamily: '', letterSpacing: 0 },
    defaultSize: { w: 200, h: 60 },
  },
  image: {
    label: '图片/视频',
    icon: '🖼',
    widget: ImageWidget,
    config: ImageConfig,
    defaultProps: { mediaList: [], autoPlay: false, interval: 3 },
    defaultSize: { w: 300, h: 200 },
  },
  date: {
    label: '日期时间',
    icon: '📅',
    widget: DateWidget,
    config: DateConfig,
    defaultProps: { format: 'YYYY-MM-DD HH:mm:ss', fontSize: 28, color: '#333333', bold: false, fontFamily: '', letterSpacing: 0 },
    defaultSize: { w: 270, h: 60 },
  },
  waitCount: {
    label: '等位人数',
    icon: '👥',
    widget: WaitCountWidget,
    config: WaitCountConfig,
    defaultProps: { maxDisplay: 0, showCallNum: true, tableType: '', fontSize: 40, color: '#333333', bold: false, fontFamily: '', letterSpacing: 0 },
    defaultSize: { w: 240, h: 120 },
  },
  queue: {
    label: '队列',
    icon: '📋',
    widget: QueueWidget,
    config: QueueConfig,
    defaultProps: { dataType: 'wait', rows: 4, cols: 3, fontSize: 28, color: '#333333', bold: false, fontFamily: '', letterSpacing: 0, showTitle: false },
    defaultSize: { w: 400, h: 300 },
  },
  rect: {
    label: '矩形框',
    icon: '⬜',
    widget: RectWidget,
    config: RectConfig,
    defaultProps: { hasFill: false, fillColor: '#ffffff', borderColor: '#333333', borderWidth: 2, borderStyle: 'solid', borderRadius: 0, opacity: 1 },
    defaultSize: { w: 200, h: 150 },
  },
  line: {
    label: '线条',
    icon: '—',
    widget: LineWidget,
    config: LineConfig,
    defaultProps: { direction: 'horizontal', color: '#333333', lineWidth: 2, opacity: 1 },
    defaultSize: { w: 200, h: 20 },
  },
}

// 组件列表（有序，用于左侧面板展示）
export const COMPONENT_LIST = Object.entries(COMPONENT_REGISTRY).map(([type, cfg]) => ({
  type,
  label: cfg.label,
  icon: cfg.icon,
}))
