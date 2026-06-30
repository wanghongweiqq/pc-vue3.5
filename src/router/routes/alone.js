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
  icon: 'Cellphone',
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
    {
      path: 'tv-template/custom-edit',
      name: 'tvTemplateCustomEdit',
      component: () => import('@/views/alone/tv-editor/index.vue'),
      meta: {
        title: 'TV 自定义模板编辑',
        key: 'MENU_HAWK_DEMO',
        hidden: false,
      },
    },
    {
      path: 'tv-display',
      name: 'tvDisplay',
      component: () => import('@/views/alone/tv-display/index.vue'),
      meta: {
        title: 'TV 显示屏（Vue版）',
        key: 'MENU_HAWK_DEMO',
      },
    },
    {
      path: '/novue/tv-queue-display/index.html',
      meta: {
        title: 'TV 显示屏',
        key: 'MENU_HAWK_DEMO',
        notvue: true,
      },
    },
  ]
}
