import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'https://shop.fed.lagounews.com/api'
})

// 请求拦截器
request.interceptors.request.use(config => {
  const token = store.state.user
  if (token) {
    config.headers.Authorization = 'Bearer' + token
    console.log(token);
  }
  console.log(config);
  return config
})

export default request
