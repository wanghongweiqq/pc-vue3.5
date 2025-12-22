// const target = 'https://www.epei360.cn' // 开发环境
// const target = 'https://tqmall.360cec.com' // 测试环境
// const target = 'http://www.yunpei.com' // 正式环境
const target = '/'
module.exports = {
  publicPath: process.env.NODE_ENV === 'development' ? '/' : '//js.yunpei.com/pc-activity/dist/',
  outputDir: 'dist',
  assetsDir: 'assets', // 默认存放打包后的根目录
  productionSourceMap: false, // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度但无法查错
  lintOnSave: true,
  devServer: {
    port: 8000,
    https: false,
    open: true,
    proxy: (() => {
      return {
        '/': {
          target: target,
          changeOrigin: true,
          bypass: (req) => {
            if(req.headers.accept.indexOf('html') !== -1 ) {
              return '/index'
            }
          },
        }
      }
    })()
  },
  css: {
    requireModuleExtension: true,// 启用 CSS modules for all css
    sourceMap: false, // 开启 CSS source maps?
    loaderOptions: { // css预设器配置项
      sass: {
        additionalData: '@import "@/assets/css/_variables.scss";'
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
