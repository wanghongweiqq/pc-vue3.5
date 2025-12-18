
import ajax from '@/service/axios'
export default {
  // 公共方法
  demo (data) {
    return ajax({
      url: '/brilliant/common/tableList',
      data,
      showLoading: false
    })
  }
}