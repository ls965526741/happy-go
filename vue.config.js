const { version, author } = require('./package.json')
const { devPort } = require('./src/config/settings.js')
process.env.VUE_APP_VERSION = version
process.env.VUE_APP_AUTHOR = author || 'ls'
process.env.VUE_APP_UPDATE_TIME = new Date() || '21.11.02'

module.exports = {
  // 基本路径
  // lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/',

  // 代理地址
  devServer: {
    port: devPort,
    open: true
  },
  configureWebpack: {
    // 设置默认路径
    resolve: {
      alias: {
        assets: '@/assets',
        common: '@/common',
        components: '@/components',
        network: '@/network',
        views: '@/views'
      }
    },

    // 一种将压缩文件中的代码映射回源文件中的原始位置的方法 eval
    devtool: 'eval-source-map'
  },

  chainWebpack(config) {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      // 更改默认打包入口 entry找到默认的打包入口 clear则是删除默认的打包入口 add添加新的打包入口
      // config.entry('app').clear().add('./src/main-prod.js')

      // 向html中添加参数isProd
      config.plugin('html').tap(args => {
        // 添加参数isProd
        args[0].isProd = true
        return args
      })

      // 使用externals设置排除项
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      // config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        // 添加参数isProd
        args[0].isProd = false
        return args
      })
    })
  }
}
