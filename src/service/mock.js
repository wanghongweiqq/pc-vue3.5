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
        { customerName: '北京云配科技有限公司', cloudsGatherStatus: 1, accountPeriodStatus: 0, totalAmount: 500000, usedAmount: 120000, availableAmount: 380000, status: 0, sumUsedAmount: 890000, lastOrderTime: '2025-06-18 10:32:00' },
        { customerName: '上海汽配联盟贸易有限公司', cloudsGatherStatus: 1, accountPeriodStatus: 0, totalAmount: 300000, usedAmount: 310000, availableAmount: -10000, status: 1, sumUsedAmount: 1200000, lastOrderTime: '2025-06-17 15:08:22' },
        { customerName: '广州零部件供应链股份公司', cloudsGatherStatus: 0, accountPeriodStatus: 1, totalAmount: 200000, usedAmount: 0, availableAmount: 200000, status: 0, sumUsedAmount: 340000, lastOrderTime: '2025-06-10 09:15:00' },
        { customerName: '深圳快修配件连锁有限公司', cloudsGatherStatus: 1, accountPeriodStatus: 0, totalAmount: 800000, usedAmount: 450000, availableAmount: 350000, status: 0, sumUsedAmount: 2300000, lastOrderTime: '2025-06-19 08:00:11' },
        { customerName: '成都车惠汽配商行', cloudsGatherStatus: 0, accountPeriodStatus: 1, totalAmount: 100000, usedAmount: 80000, availableAmount: 20000, status: 1, sumUsedAmount: 560000, lastOrderTime: '2025-05-30 14:22:45' },
        { customerName: '杭州奥驰零配件贸易有限公司', cloudsGatherStatus: 1, accountPeriodStatus: 0, totalAmount: 600000, usedAmount: 200000, availableAmount: 400000, status: 0, sumUsedAmount: 1780000, lastOrderTime: '2025-06-16 11:40:33' },
        { customerName: '武汉联华汽车零部件有限公司', cloudsGatherStatus: 1, accountPeriodStatus: 0, totalAmount: 250000, usedAmount: 60000, availableAmount: 190000, status: 0, sumUsedAmount: 430000, lastOrderTime: '2025-06-15 17:55:00' },
        { customerName: '西安鑫达汽配集团有限公司', cloudsGatherStatus: 0, accountPeriodStatus: 1, totalAmount: 150000, usedAmount: 150000, availableAmount: 0, status: 1, sumUsedAmount: 920000, lastOrderTime: '2025-06-01 13:30:18' },
        { customerName: '南京天驰汽车配件有限公司', cloudsGatherStatus: 1, accountPeriodStatus: 0, totalAmount: 420000, usedAmount: 180000, availableAmount: 240000, status: 0, sumUsedAmount: 1050000, lastOrderTime: '2025-06-20 09:10:05' },
        { customerName: '重庆博远机电配件商行', cloudsGatherStatus: 0, accountPeriodStatus: 0, totalAmount: 80000, usedAmount: 35000, availableAmount: 45000, status: 0, sumUsedAmount: 210000, lastOrderTime: '2025-06-13 16:45:30' },
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
