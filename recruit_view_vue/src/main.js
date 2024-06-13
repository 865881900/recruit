import Vue from 'vue'
import '@/styles/index.scss' // global css
// import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission'
import service from '@/utils/request' // permission control

/**
 *如果你不想使用mock-server
 *你想使用MockJs实现mock api
 *你可以执行:mockXHR()
 *
 *目前MockJs将用于生产环境，
 *请在上线前删除!!！
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, {locale})
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  size: 'mini', // 设置全局组件大小为 mini
})

Vue.config.productionTip = false
Vue.prototype.$http = service

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
