/**
 * TV 编辑器 mock 数据
 * 等位人数、队列等需要实时数据的组件在编辑器内使用此文件中的数据预览
 */

export const mockWaitCount = {
  total: 12,
  callNum: 'A008',
  tableTypes: [
    { id: 'table_2', name: '2人桌', waitCount: 5, callNum: 'A008' },
    { id: 'table_4', name: '4人桌', waitCount: 4, callNum: 'B003' },
    { id: 'table_6', name: '6人桌', waitCount: 3, callNum: 'C001' },
  ],
}

export const mockWaitQueue = [
  { num: 'A001', tableType: '2人桌', status: 'waiting', waitTime: 15 },
  { num: 'A002', tableType: '2人桌', status: 'waiting', waitTime: 20 },
  { num: 'A003', tableType: '2人桌', status: 'waiting', waitTime: 25 },
  { num: 'B001', tableType: '4人桌', status: 'waiting', waitTime: 10 },
  { num: 'B002', tableType: '4人桌', status: 'waiting', waitTime: 30 },
  { num: 'B003', tableType: '4人桌', status: 'waiting', waitTime: 35 },
  { num: 'C001', tableType: '6人桌', status: 'waiting', waitTime: 18 },
  { num: 'C002', tableType: '6人桌', status: 'waiting', waitTime: 22 },
]

export const mockCallQueue = [
  { num: 'A005', tableType: '2人桌', status: 'called' },
  { num: 'A006', tableType: '2人桌', status: 'called' },
  { num: 'B002', tableType: '4人桌', status: 'called' },
  { num: 'C001', tableType: '6人桌', status: 'called' },
]
