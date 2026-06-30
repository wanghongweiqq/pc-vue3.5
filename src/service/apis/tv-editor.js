/**
 * TV 自定义模版编辑器相关接口
 */
import ajax from '@/service/axios'

// 保存自定义模版
export const ajaxSaveCustomTemplate = data => ajax({
  url: 'shop/tv/custom/template/save',
  data,
})

// 查询自定义模版详情（编辑时回填）
export const ajaxQueryCustomTemplate = params => ajax({
  url: 'shop/tv/custom/template/detail',
  params,
  method: 'get',
})
