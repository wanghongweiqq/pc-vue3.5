import { ElLoading,ElMessage } from 'element-plus'
import axios from 'axios'
let loadCount = 0
const instance = axios.create({
  baseURL: '/',
  timeout: 30000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-jd-ajax': '1.0',
    'X-jd-ts': new Date().getTime(),
  },
  withCredentials: true
})
// 添加一个请求拦截器
instance.interceptors.request.use((config) => {
  if (config.method === 'get') {
    if (config.params === undefined) {
      config.params = {
        '_t': new Date().getTime()
      }
    } else {
      config.params['_t'] = new Date().getTime()
    }
  }
  return config
}, (error) => {
  return Promise.reject(error)
})
// 添加一个响应拦截器
instance.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  return Promise.reject(error)
})
function ajax (options) {
  return new Promise(function (resolve, reject) {
    /*
    option参数定义
    必选：
      url:接口请求路径
    可选：
      method:请求类型(get/post/delete/put)默认get
      showLoading:是否开启loading，默认关闭
      errorTips:是否开启错误提示，默认开启
    */
    let config = {
      method: (options.method || 'get').toLowerCase(),
      showLoading: options.showLoading || false,
      errorTips: options.errorTips === false ? false : true,
      url: options.url,
      isFormData: options.isFormData || false,
    }
    if (config.isFormData) {
      config.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      config.transformRequest = [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }]
    }

    if (config.method === 'post' || config.method === 'delete') {
      config.data = options.data
    } else {
      config.params = options.data
    }
    if (config.showLoading) {
      ElLoading.service()
      loadCount++
    }
    instance(config).then((res) => {
      if (config.showLoading) {
        loadCount--
        if (loadCount <= 0) {
          ElLoading.service().close()
        }
      }
      if (!res.success && config.errorTips && (res.message || res.errorMsg)) { // success为false时，自动提示错误信息，可通过errorTips：false关闭
        ElMessage.error(res.message || res.errorMsg)
      }
      resolve(res)
    }).catch((err) => {
      if (config.showLoading) {
        loadCount--
        if (loadCount <= 0) {
          ElLoading.service().close()
        }
      }
      ElMessage.error('网络请求出问题了，请稍后再试')
      reject(err)
    })
  })
}
export default ajax
