import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

//导入富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import axios from 'axios'
// axios.defaults.baseURL = `http://www.ysqorz.top:8888/api/private/v1/`
axios.defaults.baseURL = `https://www.liulongbin.top:8888/api/private/v1/`
//为每次请求（除登录请求）都在headers中挂载了token权限
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

//注册TreeTable组件
Vue.component('tree-table', TreeTable)

//将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

//定义一个全局过滤器
//  'dateFormat'  自定义名称
//  originVal参数   要处理的数据
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 +'').padStart(2, '0')
  const d = (dt.getDate() + 1 +'').padStart(2, '0')
  const hh = (dt.getHours() + 1 +'').padStart(2, '0')
  const mm = (dt.getMinutes() + 1 +'').padStart(2, '0')
  const ss = (dt.getSeconds() + 1 +'').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
