import ajax from '@/service/axios'
export default {
  // 获取活动列表
  getList: (params) => ajax({
    url: '/api/demo/list',
    method: 'get',
    params,
    // isKeepLoading: true
  }),
  // 搜索客户
  searchList: (data) => ajax({
    url: '/api/demo/search',
    data,
  })
}
