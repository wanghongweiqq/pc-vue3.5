/*
 * @Description: 接口封装
 * @config参数定义
    必选：
      url: 接口请求路径
    可选：
      method:           请求类型(get/post/put/patch/delete)，默认 post
      data:             请求体参数（POST/PUT/PATCH/DELETE）
      params:           URL 查询参数（任何 method 均可用）
      showLoading:      是否开启 loading，默认 true
      isKeepLoading:    是否保持 loading（接口嵌套时非最后一个可设为 true），默认 false
      showError:        是否开启错误提示，默认 true
      isFormData:       是否为 FormData 格式，默认 false
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
function closeLoading (showLoading, isKeepLoading) {
  if (showLoading) {
    loadCount--
    if (loadCount <= 0 && !isKeepLoading) {
      loadRef && loadRef.close()
      loadRef = null
    }
  }
}

// ---- axios 实例 ----

const instance = axios.create({
  baseURL: '/',
  timeout: 30000,
  headers: {
    // Cache-Control 是请求头，浏览器会不会遵守，最终还是看服务端响应，响应头：Cache-Control: no-store  ← 这个才是根本
    'Cache-Control': 'no-cache', // 现代写法，每次都向服务器确认
    'Pragma': 'no-cache', // HTTP/1.0 兼容
  },
  withCredentials: true,
  data: {}, // 防止 POST 请求因无 data 报错
})

// 请求拦截器
instance.interceptors.request.use(
  // config => config,
  config => {
    console.log('请求拦截器config',config)
    return config
  },

  // development 环境下命中 mockMap，注入自定义 adapter，不发真实请求
  // config => {
  //   if (process.env.NODE_ENV === 'development' && mockMap[config.url] !== undefined) {
  //     config.adapter = () => Promise.resolve({
  //       data: mockMap[config.url],
  //       status: 200,
  //       statusText: 'OK',
  //       headers: { 'content-type': 'application/json' },
  //       config,
  //       request: {},
  //     })
  //   }
  //   return config
  // },
  error => Promise.reject(error)
)

// 响应拦截器
instance.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

// ---- 请求封装 ----

// 参数过滤（移至外部，避免每次调用 ajax 时重复创建）
function applyFilter (val, isFilterStringSpace, isFilterObjectParams) {
  if (isFilterStringSpace || isFilterObjectParams) {
    val = utils.copyDeep(val, { isFilterStringSpace, isFilterObjectParams })
  }
  return val
}

function ajax (options) {
  const {
    url,
    method = 'post',
    adapter, // 可选，指定 adapter（如 'fetch'/'xhr'/'http'）
    isKeepLoading = false,
    showError = true,
    isFormData = false,
    isFilterStringSpace = false,
    isFilterObjectParams = false,
  } = options
  let { data, params, showLoading = true } = options
  console.log('data',data)
  console.log('params',params)
  // isKeepLoading 时强制开启 loading
  if (isKeepLoading) showLoading = true

  const config = {
    url,
    method,
    ...(adapter && { adapter }), // 指定了 adapter 才透传
  }

  // data: 可以是任意类型（对象 / FormData / 字符串等）
  config.data = applyFilter(data, isFilterStringSpace, isFilterObjectParams)
  // params: 是能被序列化的数据格式，比如：对象、数组(['a','b']序列化后为?0=a&1=b)
  config.params = applyFilter(params, isFilterStringSpace, isFilterObjectParams)
  console.log('configparams',config.params)
  if(config.params) {
    const type = utils.dataType(config.params)
    if(type === 'object') { // 只给对象格式的添加，数组添加的话会被当做一个正常的数据项
      config.params['_t'] = Date.now()
    }
  }

  // FormData 格式
  if (isFormData) {
    config.headers = { 'Content-Type': 'multipart/form-data' }
  }

  // 开启 loading
  if (showLoading) {
    loadCount++
    if (!loadRef) { // 只创建一个实例，防止多个并发请求时出现多个 loading
      loadRef = ElLoading.service({ lock: true, text: '加载中...' })
    }
  }

  return instance(config)
    .then(res => {
      closeLoading(showLoading, isKeepLoading)
      // 业务错误提示（接口正常返回但业务失败）
      if (showError && !res.success && res.message) {
        ElMessage.error(res.message)
      }
      return res
    })
    .catch(err => {
      closeLoading(showLoading, false) // 异常时强制关闭 loading
      if (showError) {
        ElMessage.error(errorMessage)
      }
      return Promise.reject(err)
    })
}

export default ajax
