import axios from "axios";
import { ElMessage } from "element-plus";

const instance = axios.create({
    baseURL: '/api',
    timeout: 15000
});

// 请求拦截：自动携带 Token
instance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// 响应拦截：统一解包 { code, data, message }
instance.interceptors.response.use(
    result => {
        if (result.data.code === 0) {
            return result.data;
        }
        ElMessage.error(result.data.message || '服务异常');
        return Promise.reject(result.data);
    },
    error => {
        if (error.response && error.response.status === 401) {
            ElMessage.error('登录已失效，请重新登录');
            localStorage.removeItem('token');
            localStorage.removeItem('user_info');
            window.location.href = '/login';
        } else {
            ElMessage.error(error.response?.data?.message || '网络异常，请稍后重试');
        }
        return Promise.reject(error);
    }
);

export default instance;
