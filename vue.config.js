// const target = 'https://www.epei360.cn' // 开发环境
// const target = 'https://tqmall.360cec.com' // 测试环境
// const target = 'http://www.yunpei.com' // 正式环境
const target = '/'
module.exports = {
  // webpack 5 原生支持 ES Module，无需 transpileDependencies
  publicPath: process.env.NODE_ENV === 'development' ? '/' : '//js.yunpei.com/pc-activity/dist/',
  outputDir: 'dist',
  assetsDir: 'assets', // 默认存放打包后的根目录
  productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度但无法查错
  lintOnSave: false,
  devServer: {
    port: 8000,
    https: false,
    open: true,
    proxy: (() => {
      return {
        '/': {
          target: target,
          changeOrigin: true,
          ws: false, // 不代理 WebSocket，避免 HMR 热更新连接报 TypeError
          bypass: (req) => {
            console.log('reqreqreq',req)
            // target='/' 表示无真实后端，所有请求均走本地，避免 http-proxy 解析无效 URL 报错
            if (target === '/') return req.url
            if ((req.headers.accept || '').indexOf('html') !== -1) return '/index'
          },
        }
      }
    })()
  },
  css: {
    sourceMap: false, // 开启 CSS source maps?
    loaderOptions: { // css预设器配置项
      sass: {
        sassOptions: {
          // 静默 Dart Sass 废弃警告：
          // - import：@import 语法将在 Dart Sass 3.0 移除，届时统一迁移至 @use/@forward
          // - global-builtin：map-keys/map-get 等全局内置函数废弃，需改用 sass:map 命名空间
          silenceDeprecations: ['import', 'global-builtin'],
        },
        // 改为函数形式：只对项目自身的 SCSS 文件注入全局变量，
        // 跳过 node_modules（如 element-plus）里的文件。
        // 原因：Element Plus 2.x 的组件 SCSS 以 @use 开头，
        // Dart Sass 要求 @use 必须是文件首行，
        // 若将 @import 插到前面会导致编译报错。
        additionalData: (content, { resourcePath }) => {
          if (resourcePath.includes('node_modules')) return content
          return `@import "@/assets/css/_variables.scss";\n${ content }`
        }
      }
    }
  },
  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  }
}
