/*
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2025-06-12 17:24:24
 * @Description: 页面/组件/功能的描述
 * @FilePath: /vue3.0/src/router/routes/alone.js
 */
export default {
  path: '/alone',
  component: () => import('@/layout/alone'),
  icon: 'el-icon-mobile',
  meta: {
    title: 'Alone',
  },
  children: [
    {
      path: 'chess',
      name: 'chess',
      component: () => import('@/views/alone/chess/'),
      meta: {
        title: '五子棋',
        key: 'MENU_HAWK_DEMO'
      },
    },
  ]
}
