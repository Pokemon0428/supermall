import axios from 'axios'

export function request(config){ 
  // 1.创建axios实例
  const instance = axios.create({
    baseURL: 'http://123.207.32.32:8000/api/wh',
    timeout: 5000
  })

  // 2. axios的拦截器
  // 拦截请求
  instance.interceptors.request.use(config => {
    // console.log(config)
    
    return config
  }, err => {
    console.log(err)
  })
  // 拦截响应
  instance.interceptors.response.use(res => {
    // console.log(res)
    return res.data
  }, err => {
    console.log(err)
  })

  return instance(config)
}