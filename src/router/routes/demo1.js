export default {
  path: '/demo1',
  component: () => import('@/layout/index'),
  icon: 'el-icon-mobile',
  meta: {
    title: 'Demo1',
  },
  children: [
    {
      path: 'index',
      name: 'demo1Index',
      component: () => import('@/views/demo/index.vue'),
      meta: {
        title: '首页',
        key: 'MENU_HAWK_DEMO'
      },
    },
    {
      path: 'detail',
      name: 'demo1Detail',
      component: () => import('@/views/demo/about.vue'),
      meta: {
        title: '首页详情',
      }
    },
    {
      path: 'about',
      name: 'demo1about',
      component: () => import('@/views/demo/about.vue'),
      meta: {
        title: '关于我们',
        key: 'MENU_HAWK_DEMO'
      }
    }
  ]
}
