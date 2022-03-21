import Vue from 'vue'
import App from './App.vue'
import router from './router'

import '@/plugins'
// 设置vue-devtools
Vue.config.devtools = true

// 显示生产模式的消息  Vue 会提供很多警告来帮你对付常见的错误与陷阱
Vue.config.productionTip = false

// 注册一个全局自定义指令,验证资源权限 `v-permission`
Vue.directive('permission', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function(el, binding, vnode) {
    const permission = vnode.context.$route.meta.permission // 获取权限值
    const allPermissions = JSON.parse(sessionStorage.getItem('userInfo')).rid // 当前用户拥有的权限
    if (allPermissions > permission) {
      el.parentElement.removeChild(el) // 不拥有该权限移除dom元素
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
