import ajax from '@/service/axios'
export default {
  // 获取活动列表
  getList: (params) => ajax({
    url: '/api/demo/list',
    method: 'get',
    params,
    // isFilterObjectParams: true,
    // isKeepLoading: true
  }),
  // 搜索客户
  searchList: (data) => ajax({
    url: '/api/demo/search',
    data,
  }),
  // 详情（adapter: fetch 示例）
  getDetail: (params) => ajax({
    url: '/api/demo/detail',
    method: 'get',
    params,
    adapter: ['fetch', 'xhr'],
    isShowLoading: false,
  }),
}
