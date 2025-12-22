export default {
  path: '/demo',
  component: () => import('@/layout/index'),
  icon: 'el-icon-document',
  meta: {
    title: 'Demo',
  },
  children: [
    {
      path: 'index',
      name: 'demoIndex',
      component: () => import('@/views/demo/index.vue'),
      meta: {
        keepAlive: true,
        title: '测试页',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: '测试页',
          },
        ]
      },
    },
    {
      path: 'test01/detail',
      name: 'test01Detail',
      component: () => import('@/views/demo/about.vue'),
      meta: {
        title: '测试详情页',
        key: 'MENU_HAWK_DEMO',
        hidden: true,
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: '测试页',
            href: 'ui'
          },
          {
            name: '测试详情页'
          },
        ]
      }
    },
    {
      path: 'task',
      name: 'task',
      component: () => import('@/views/demo/task/'),
      meta: {
        title: 'task',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'task',
            href: 'task'
          },
        ]
      }
    },
    {
      path: 'console',
      name: 'console',
      component: () => import('@/views/demo/console'),
      meta: {
        title: 'console',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'console',
            href: 'console'
          },
        ]
      }
    },
    {
      path: 'array',
      name: 'array',
      component: () => import('@/views/demo/array'),
      meta: {
        title: 'array',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'array',
            href: 'array'
          },
        ]
      }
    },
    {
      path: 'utils',
      name: 'utils',
      component: () => import('@/views/demo/utils.vue'),
      meta: {
        title: 'utils&mixins',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'Utils&Mixins&RegExp',
            href: 'utils'
          },
        ]
      }
    },
    {
      path: 'feature',
      name: 'feature',
      component: () => import('@/views/demo/feature.vue'),
      meta: {
        title: 'feature',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'feature',
          },
        ]
      }
    },
    {
      path: 'ref-dom',
      name: 'ref-dom',
      component: () => import('@/views/demo/ref-dom'),
      meta: {
        title: 'ref-dom',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'ref-dom',
          },
        ]
      }
    },
    {
      path: 'vuex',
      name: 'vuex',
      component: () => import('@/views/demo/vuex.vue'),
      meta: {
        title: 'vuex',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'vuex',
          },
        ]
      }
    },
    {
      path: 'css',
      name: 'css',
      component: () => import('@/views/demo/css/index.vue'),
      meta: {
        title: 'css',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'css',
          },
        ]
      }
    },
    {
      path: 'function',
      name: 'function',
      component: () => import('@/views/demo/function.vue'),
      meta: {
        title: 'function',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'function和原型',
          },
        ]
      }
    },
    {
      path: 'promise',
      name: 'promise',
      component: () => import('@/views/demo/promise.vue'),
      meta: {
        title: 'promise',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'promise',
          },
        ]
      }
    },
    {
      path: 'event-loop',
      name: 'event-loop',
      component: () => import('@/views/demo/event-loop.vue'),
      meta: {
        title: 'event-loop',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'event-loop',
          },
        ]
      }
    },
    {
      path: 'async-await',
      name: 'async-await',
      component: () => import('@/views/demo/async-await.vue'),
      meta: {
        title: 'async-await',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'async-await',
          },
        ]
      }
    },
    {
      path: '/novue/call.html',
      meta: {
        title: 'call',
        key: 'MENU_HAWK_DEMO',
        notvue: true
      }
    },
    {
      path: '/novue/render.html',
      meta: {
        title: 'render',
        key: 'MENU_HAWK_DEMO',
        notvue: true
      }
    },
    {
      path: 'copy',
      name: 'copy',
      component: () => import('@/views/demo/copy.vue'),
      meta: {
        title: 'copy',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: '深拷贝',
          },
        ]
      }
    },
    {
      path: 'reg-exp',
      name: 'reg-exp',
      component: () => import('@/views/demo/reg-exp.vue'),
      meta: {
        title: 'RegExp',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'RegExp',
          },
        ]
      }
    },
    {
      path: 'setup',
      name: 'setup',
      component: () => import('@/views/demo/setup.vue'),
      meta: {
        title: 'setup',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'setup',
          },
        ]
      }
    },
    {
      path: 'duyi',
      name: 'duyi',
      component: () => import('@/views/demo/duyi.vue'),
      meta: {
        title: '渡一学习',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'duyi',
          },
        ]
      }
    },
    {
      path: 'sort',
      name: 'sort',
      component: () => import('@/views/demo/sort.vue'),
      meta: {
        title: '排序算法',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'sort',
          },
        ]
      }
    },
    {
      path: 'debounce-throttle',
      name: 'debounce-throttle',
      component: () => import('@/views/demo/debounce-throttle/'),
      meta: {
        title: '防抖和节流',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          {
            name: 'Demo',
          },
          {
            name: 'debounce-throttle',
          },
        ]
      }
    },
    {
      path: 'https://jd.com',
      meta: {
        title: '老页面',
        key: 'MENU_HAWK_DEMO',
        notvue: true
      }
    }
  ]
}
