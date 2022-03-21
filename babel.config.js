const prodPlugins = []
if (process.env.NODE_ENV === 'production' && prodPlugins.length === 0) {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // vant按需加载的配置
    //   ['import', {
    //     libraryName: 'vant',
    //     libraryDirectory: 'es',
    //     style: true
    //   }, 'vant']

    // 路由懒加载
    '@babel/plugin-syntax-dynamic-import',
    // 清除console.log
    ...prodPlugins
  ]
}
