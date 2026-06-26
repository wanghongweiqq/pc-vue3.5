/*
 * @Description: 接口封装
 * @config参数定义
    必选：
      url: 接口请求路径
    可选：
      method:               请求类型(get/post/put/patch/delete)，默认 post
      data:                 请求体参数（POST/PUT/PATCH/DELETE）
      params:               URL 查询参数（任何 method 均可用）
      adapter:              指定 adapter（如 'fetch'/'xhr'/'http'）
      isShowLoading:        是否开启 loading，默认 true
      isKeepLoading:        是否保持 loading（接口嵌套时非最后一个可设为 true），默认 false
      isShowError:          是否开启错误提示，默认 true
      isFilterStringSpace:  过滤参数值首尾空格，默认 false
      isFilterObjectParams: 过滤 null/undefined/''/[]/{}，默认 false
 */
import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import utils from '@/assets/js/utils'
import mockMap from './mock'

const errorMessage = '网络请求出问题了，请稍后再试'
let loadCount = 0 // loading 计数，支持多个并发请求
let loadRef = null // loading 实例引用，保证只创建一个

// ---- 工具函数 ----

// 关闭 loading（isKeepLoading 为 true 时保持 loading 不关闭）
function closeLoading (isShowLoading, isKeepLoading) {
  if (isShowLoading) {
    loadCount = Math.max(0, loadCount - 1)
    if (loadCount <= 0 && !isKeepLoading) {
      loadRef && loadRef.close()
      loadRef = null
    }
  }
}

// 参数过滤
function applyFilter (val, isFilterStringSpace, isFilterObjectParams) {
  if (isFilterStringSpace || isFilterObjectParams) {
    val = utils.copyDeep(val, { isFilterStringSpace, isFilterObjectParams })
  }
  return val
}

// ---- axios 实例 ----

const instance = axios.create({
  baseURL: '/',
  timeout: 30000,
  headers: {
    // Cache-Control 是请求头，浏览器会不会遵守，最终还是看服务端响应，可以查看响应头是否展示（可以找后端统一配置）：Cache-Control: no-cache。可以和时间戳防缓存2选1
    'Cache-Control': 'no-cache', // 现代写法，每次都向服务器确认
    'Pragma': 'no-cache', // HTTP/1.0 兼容
  },
  withCredentials: true,
  // 自定义默认值，单次请求可覆盖，拦截器通过 config 读取
  isShowLoading: true,
  isKeepLoading: false,
  isShowError: true,
  isFilterStringSpace: false,
  isFilterObjectParams: false,
})

// ---- 拦截器 ----

// 请求拦截器
instance.interceptors.request.use(config => {
  if (process.env.NODE_ENV === 'development') console.log('添加一个请求拦截器', config)

  // development 环境命中 mockMap，注入自定义 adapter，不发真实请求
  if (process.env.NODE_ENV === 'development' && mockMap[config.url] !== undefined) {
    config.adapter = () => Promise.resolve({
      data: mockMap[config.url],
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      request: {},
    })
  }

  // 读取自定义字段（已由 instance.defaults 提供默认值，经 axios 合并后直接从 config 取）
  const { isKeepLoading, isFilterStringSpace, isFilterObjectParams } = config

  // isKeepLoading 时强制开启 loading
  if (isKeepLoading) config.isShowLoading = true
  const { isShowLoading } = config

  // 参数过滤
  config.data = applyFilter(config.data, isFilterStringSpace, isFilterObjectParams)
  config.params = applyFilter(config.params, isFilterStringSpace, isFilterObjectParams)

  // 时间戳防缓存（仅对象格式的 params），可以和Cache-Control: no-cache 2选1
  if (config.params) {
    const type = utils.dataType(config.params)
    if (type === 'object') {
      config.params._t = Date.now()
    }
  }

  // 开启 loading
  if (isShowLoading) {
    loadCount++
    if (!loadRef) { // 只创建一个实例，防止多个并发请求时出现多个 loading
      loadRef = ElLoading.service({ lock: true, text: '加载中...' })
    }
  }

  return config
}, error => {
  if (process.env.NODE_ENV === 'development') console.log('添加一个请求拦截器-error', error)
  // 典型来源: 前置拦截器抛错,拦截器链内部出错,极少出现。本项目只注册了一个请求拦截器，没有其他拦截器在它之前抛错，所以这个错误回调几乎不会被触发。
  // 不在此处理，error会透传到响应拦截器那边，统一交给响应拦截器的 error 回调处理，这样可以防止重复处理（错误信息提示两次、loading计算错误等）
  return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(
  response => {
    if (process.env.NODE_ENV === 'development') console.log('添加一个响应拦截器', response)
    const { isShowLoading = true, isKeepLoading = false, isShowError = true } = response.config
    closeLoading(isShowLoading, isKeepLoading)
    // 业务错误提示（接口正常返回但业务失败）
    const res = response.data
    if (isShowError && !res.success && res.message) {
      ElMessage.error(res.message)
    }
    return res
  },
  error => {
    if (process.env.NODE_ENV === 'development') console.log('添加一个响应拦截器-error', error)
    const { isShowLoading = true, isShowError = true } = error.config || {} // config 可能为 undefined（来自请求拦截器的错误）
    closeLoading(isShowLoading, false) // 异常时强制关闭 loading
    if (isShowError) {
      ElMessage.error(errorMessage)
    }
    return Promise.reject(error)
  }
)

export default instance
