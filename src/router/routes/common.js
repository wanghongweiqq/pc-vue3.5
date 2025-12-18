export default {
  path: '/',
  component: () => import('@/layout/index'),
  icon: 'el-icon-folder-opened',
  meta: {
    title: '公共页面'
  },
  children: [
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/common/404'),
      meta: {
        title: '页面不存在',
        key: 'MENU_HAWK_OPEN',
        hidden: true
      },
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/views/common/403'),
      meta: {
        title: '没有权限访问',
        key: 'MENU_HAWK_OPEN',
        hidden: true
      },
    }
  ]
}
