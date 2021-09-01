import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import http from './http'
import 'normalize.css'

Vue.config.productionTip = false
Vue.prototype.$http = http
Vue.mixin({
  methods: {
    getAuthHeader() {
      return {
        Authorization: `Bearer ${localStorage.token}`
      }
    }
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
