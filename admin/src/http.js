import axios from 'axios'
import vue from 'vue'
import router from './router'
const http = axios.create({
  baseURL: 'http://localhost:3000/admin/api'
})
http.interceptors.request.use(config => {
  if (localStorage.token) {
    config.headers.Authorization = 'Bearer ' + localStorage.token
  }
  return config
}, err => {
  return Promise.reject(err)
})

http.interceptors.response.use(res => {
  return res
}, err => {
  // 通用错误处理
  if (err.response.data.message) {
    vue.prototype.$message({
      message: err.response.data.message,
      type: 'error'
    })
  }
  // 处理登录错误
  if (err.response.status === 401) {
    router.push('/login')
  }
  return Promise.reject(err)
})

export default http
