/**
 * @description: mock 数据配置
 * 格式：{ [url]: { success, data, message } }
 * 仅在 development 环境生效，生产环境自动跳过
 */
const mockMap = {
  '/api/demo/list': {
    success: true,
    data: {
      total: 10,
      list: [
        { id: 1, name: '北京云配科技有限公司', status: 0, amount: 500000, date: '2025-06-18 10:32:00' },
        { id: 2, name: '上海汽配联盟贸易有限公司', status: 1, amount: 300000, date: '2025-06-17 15:08:22' },
        { id: 3, name: '广州零部件供应链股份公司', status: 0, amount: 200000, date: '2025-06-10 09:15:00' },
        { id: 4, name: '深圳快修配件连锁有限公司', status: 0, amount: 800000, date: '2025-06-19 08:00:11' },
        { id: 5, name: '成都车惠汽配商行', status: 1, amount: 100000, date: '2025-05-30 14:22:45' },
      ],
    },
  },
  '/api/demo/detail': {
    success: true,
    data: {
      id: 1,
      name: '北京云配科技有限公司',
      status: 0,
      amount: 500000,
      date: '2025-06-18 10:32:00',
      remark: '这是一条 mock 详情数据',
    },
  },
  '/api/demo/create': {
    success: true,
    data: { id: 6 },
    message: '创建成功',
  },
  '/api/demo/update': {
    success: true,
    data: null,
    message: '更新成功',
  },
  '/api/demo/delete': {
    success: true,
    data: null,
    message: '删除成功',
  },
  '/api/demo/search': {
    success: true,
    data: [
      { id: 1, companyName: '北京云配科技有限公司' },
      { id: 2, companyName: '上海汽配联盟贸易有限公司' },
      { id: 3, companyName: '广州零部件供应链股份公司' },
    ],
  },
  '/api/demo/error': {
    success: false,
    data: null,
    message: '这是一条业务错误提示',
  },
}

export default mockMap
