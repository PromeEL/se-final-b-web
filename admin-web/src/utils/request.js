import axios from 'axios'

const request = axios.create({
    baseURL: 'http://111.230.39.246:8080',  // 您的后端服务器地址（替换为实际地址）
    timeout: 10000,  // 超时时间
})

// 请求拦截器：自动添加 Token（文档中用 Sa-Token，Header Key 为 'satoken' 或 'Authorization'）
request.interceptors.request.use(config => {
    const token = localStorage.getItem('satoken')  // 假设 Token 存储在 localStorage
    if (token) {
        config.headers['satoken'] = token  // 或 config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
})

// 响应拦截器：统一处理返回格式（文档中所有接口返回 { code, msg, data }）
request.interceptors.response.use(
    response => {
        const res = response.data
        if (res.code !== 200) {
            // 处理错误，例如弹窗提示
            console.error(res.msg || '请求失败')
            return Promise.reject(new Error(res.msg || 'Error'))
        }
        return res
    },
    error => {
        console.error('网络错误:', error)
        return Promise.reject(error)
    }
)

export default request
