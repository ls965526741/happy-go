import Vue from 'vue'
import axios from 'axios'
import { Loading } from 'element-ui'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

let loadingInstance = null
// 请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 添加请求头
    if (config.url !== '/users' && config.url !== '/login') {
      config.headers.Authorization = sessionStorage.getItem('token')
    }
    // 数据加载的londing
    loadingInstance = Loading.service({ fullscreen: true, text: '加载中' })
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)
// 接收拦截器
axios.interceptors.response.use(
  function(res) {
    loadingInstance.close()
    return res
  },
  function(error) {
    return Promise.reject(error)
  }
)

Vue.prototype.$http = axios
