export default {
  path: '/demo',
  component: () => import('@/layout/index'),
  icon: 'Document',
  meta: {
    title: 'Demo',
  },
  children: [
    {
      path: 'array',
      name: 'array',
      component: () => import('@/views/demo/array/'),
      meta: {
        title: 'array',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'array', href: 'array' },
        ]
      }
    },
    {
      path: 'async-await',
      name: 'async-await',
      component: () => import('@/views/demo/async-await/index.vue'),
      meta: {
        title: 'async-await',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'async-await' },
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
      path: 'console',
      name: 'console',
      component: () => import('@/views/demo/console/'),
      meta: {
        title: 'console',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'console', href: 'console' },
        ]
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
          { name: 'Demo' },
          { name: 'copy' },
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
          { name: 'Demo' },
          { name: 'css' },
        ]
      }
    },
    {
      path: 'debounce-throttle',
      name: 'debounce-throttle',
      component: () => import('@/views/demo/debounce-throttle/'),
      meta: {
        title: 'debounce-throttle',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'debounce-throttle' },
        ]
      }
    },
    {
      path: 'diff',
      name: 'diff',
      component: () => import('@/views/demo/diff/'),
      meta: {
        title: 'diff',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'diff' },
        ]
      }
    },
    {
      path: 'duyi',
      name: 'duyi',
      component: () => import('@/views/demo/duyi.vue'),
      meta: {
        title: 'duyi',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'duyi' },
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
          { name: 'Demo' },
          { name: 'event-loop' },
        ]
      }
    },
    {
      path: 'feature',
      name: 'feature',
      component: () => import('@/views/demo/feature/'),
      meta: {
        title: 'feature',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'feature' },
        ]
      }
    },
    {
      path: 'function',
      name: 'function',
      component: () => import('@/views/demo/function/'),
      meta: {
        title: 'function',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'function' },
        ]
      }
    },
    {
      path: 'http',
      name: 'http',
      component: () => import('@/views/demo/http/'),
      meta: {
        title: 'http',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'http' },
        ]
      }
    },
    {
      path: 'index',
      name: 'demoIndex',
      component: () => import('@/views/demo/index.vue'),
      meta: {
        keepAlive: true,
        title: 'index',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'index' },
        ]
      },
    },
    {
      path: 'keys',
      name: 'keys',
      component: () => import('@/views/demo/keys/'),
      meta: {
        title: 'keys',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'keys' },
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
          { name: 'Demo' },
          { name: 'promise' },
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
          { name: 'Demo' },
          { name: 'ref-dom' },
        ]
      }
    },
    {
      path: 'ref-reactive',
      name: 'ref-reactive',
      component: () => import('@/views/demo/ref-reactive'),
      meta: {
        title: 'ref-reactive',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'ref-reactive' },
        ]
      }
    },
    {
      path: 'reg-exp',
      name: 'reg-exp',
      component: () => import('@/views/demo/reg-exp/'),
      meta: {
        title: 'reg-exp',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'reg-exp' },
        ]
      }
    },
    {
      path: 'render',
      name: 'render',
      component: () => import('@/views/demo/render/'),
      meta: {
        title: 'render',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'render' },
        ]
      }
    },
    {
      path: 'setup',
      name: 'setup',
      component: () => import('@/views/demo/setup/'),
      meta: {
        title: 'setup',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'setup' },
        ]
      }
    },
    {
      path: 'sort',
      name: 'sort',
      component: () => import('@/views/demo/sort/'),
      meta: {
        title: 'sort',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'sort' },
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
          { name: 'Demo' },
          { name: 'task', href: 'task' },
        ]
      }
    },
    {
      path: 'utils',
      name: 'utils',
      component: () => import('@/views/demo/utils.vue'),
      meta: {
        title: 'utils',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'utils', href: 'utils' },
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
          { name: 'Demo' },
          { name: 'vuex' },
        ]
      }
    },
    {
      path: 'width',
      name: 'width',
      component: () => import('@/views/demo/width/'),
      meta: {
        title: 'width',
        key: 'MENU_HAWK_DEMO',
        crumb: [
          { name: 'Demo' },
          { name: 'width' },
        ]
      }
    },
    {
      path: 'https://jd.com',
      meta: {
        title: 'jd',
        key: 'MENU_HAWK_DEMO',
        notvue: true
      }
    }
  ]
}
