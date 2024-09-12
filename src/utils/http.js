// axios基础配置
import axios from "axios";
import {useUserStore} from "@/store/user";
import router from '@/router'
import { ElMessage } from 'element-plus'

const http = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 10000,
})

// axios请求拦截器
http.interceptors.request.use(config => {
    const userStore = useUserStore();
    if (userStore.token) {
        if (!config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${userStore.token}`
        }
    }
    return config
}, e => Promise.reject(e))


// axios响应式拦截器
http.interceptors.response.use(
    res => res.data,
    async e => {
        const userStore = useUserStore();

        console.log(e.response)
        if (e.response) {
            // 处理401错误
            if (e.response.status === 401) {
                if (e.response.data.data.detailed_error_code === 401_02) {
                    ElMessage({
                        type: 'error',
                        message: '登录过期，请重新登录',
                        duration: 3000
                    });
                    userStore.refreshLocal();
                    await router.replace('/login');
                } else {
                    try {
                        await userStore.refreshAccessTokenHandler();
                    } catch (e) {
                        ElMessage({
                            type: 'error',
                            message: '登录过期，请重新登录'
                        });
                        userStore.refreshLocal();
                        await router.replace('/login');
                    }
                }
            }

            // 处理403错误
            if (e.response.status === 403) {
                ElMessage({
                    type: 'warning',
                    message: e.response.data.error
                })
                router.replace('/login');
            }

            // 处理500错误
            if (e.response.status === 500) {
                ElMessage({
                    type: 'error',
                    message: '服务器错误，请稍后再试'
                });
            }

            // 处理404错误
            if (e.response.status === 404) {
                router.replace('/NotFound');
            }
        }

        return Promise.reject(e);
    }
);

export default http;
