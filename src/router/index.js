/*
 * @Author: 王宏伟
 * @Email：wanghongwei@hualala.com
 * @Date: 2021-05-06 10:53:45
 * @Description: 页面/组件/功能的描述
 * @FilePath: /pc-vue3.5/src/router/index.js
 */
import { createRouter, createWebHistory } from 'vue-router'
// import Home from '../views/Home.vue'
import common from './routes/common'
import demo from './routes/demo'
import alone from './routes/alone'

// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: Home
//   },
//   {
//     path: '/about',
//     name: 'About',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
//   }
// ]

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
  routes: [
    common,
    demo,
    alone,
  ]
})
router.beforeEach((to, from) => {
  if (to.meta.title) {
    document.title = `${ to.meta.title }-Vue3.5 项目`
  }
  if (!to.name || to.name && to.matched.length === 0) { // 错误路由。
    return { name: '404' }
  }
  // 需要设置权限。并且权限未开通。
  if (to.meta.key) {
    let listMenu = window.BSGlobal && window.BSGlobal.listMenu ? window.BSGlobal.listMenu : {}
    listMenu.MENU_HAWK_OPEN = true
    if (!listMenu[to.meta.key]) {
      return { name: '403' }
    }
  }
  // return true 或不返回值均表示放行
})
export default router
