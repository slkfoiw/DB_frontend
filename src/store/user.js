import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {login, register, refreshAccessToken, logout, getUserInfo, getUserActionInfo} from "@/api/user.js";
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';

export const useUserStore = defineStore('user', () => {
    const userInfo = ref({});
    const userCollectDishes = ref([]);
    const userCollectCounters = ref([]);
    const userCollectCafeterias = ref([]);
    const userAte = ref([]);
    const userUpload = ref([]);
    const token = ref('');

    const userRegister = async ({ email, username, password }) => {
        await register({ email, username, password });
    };

    const userLogin = async (email, password) => {
        const response = await login({ email, password });

        if (response.success) {
            // 1. 返回数据
            const { token, refresh_token, username } = response.data;

            // 2. 设置token
            setToken(token);
            Cookies.set('myRefreshToken', refresh_token);

            // 3. 获取用户个人信息
            await updateUserBaseInfo();

            // 4. 获取用户行为数据
            const resp = await getUserActionInfo();
            userAte.value = resp.data.ateId;
            userCollectDishes.value = resp.data.collectDishesId;
            userCollectCounters.value = resp.data.collectCountersId;
            userCollectCafeterias.value = resp.data.collectCafeteriasId;
            userUpload.value = resp.data.uploadPostId;
            return username;
        } else {
            return null;
        }
    }
    userInfo.value.userId = 123;
    userInfo.value.username = 123;
    userInfo.value.email = '123@qq.com';
    const updateUserBaseInfo = async () => {
        const res = await getUserInfo();

        userInfo.value.userId = res.data.id;
        userInfo.value.gender = res.data.gender;
        userInfo.value.introduction = res.data.introduction;
        userInfo.value.avatar = res.data.avatar;
        userInfo.value.username = res.data.username;
        userInfo.value.email = res.data.email;
    }

    const extendUserInfo = (type, id) => {
        if (type === 'ate') {
            userAte.value = [...userAte.value, id];
        } else if (type === 'dish') {
            userCollectDishes.value = [...userCollectDishes.value, id];
        } else if (type === 'counter') {
            userCollectCounters.value = [...userCollectCounters.value, id];
        } else if (type === 'cafeteria') {
            userCollectCafeterias.value = [...userCollectCafeterias.value, id];
        } else if (type === 'upload') {
            userUpload.value = [...userUpload.value, id];
        }
        else {
            console.log("extendUserInfo失败: 没有这个类型")
        }
    };

    const removeUserInfo = (type, id) => {
        if (type === 'ate') {
            const index = userAte.value.indexOf(id);
            if (index !== -1) {
                userAte.value.splice(index, 1);
            }
        } else if (type === 'dish') {
            const index = userCollectDishes.value.indexOf(id);
            if (index !== -1) {
                userCollectDishes.value.splice(index, 1);
            }
        } else if (type === 'counter') {
            const index = userCollectCounters.value.indexOf(id);
            if (index !== -1) {
                userCollectCounters.value.splice(index, 1);
            }
        } else if (type === 'cafeteria') {
            const index = userCollectCafeterias.value.indexOf(id);
            if (index !== -1) {
                userCollectCafeterias.value.splice(index, 1);
            }
        } else if (type === 'upload') {
            const index = userUpload.value.indexOf(id);
            if (index !== -1) {
                userUpload.value.splice(index, 1);
            }
        } else {
            console.log("removeUserInfo失败: 没有这个类型")
        }
    };

    const userLogout = async () => {
        try {
            // 调用 logout API
            await logout();

            // 清理用户信息和相关状态
            refreshLocal();

            // 返回登出成功信息
            return { info: "成功退出登录" };
        } catch (error) {
            // 捕获错误并打印
            console.error('退出登录失败:', error);

            // 通知用户登出失败
            ElMessage({
                type: 'error',
                message: '退出登录失败，请稍后再试',
            });
        }
    };

    const refreshLocal = () => {
        userInfo.value = {};
        userCollectDishes.value = [];
        userCollectCounters.value = [];
        userCollectCafeterias.value = [];
        userAte.value = [];
        userUpload.value = [];
        token.value = '';

        // 清理本地存储和 cookie
        localStorage.removeItem('token');
        Cookies.remove('myRefreshToken');
    }

    const changeInfo = ({username, email, gender, introduction, avatar}) => {
        userInfo.value.username = username;
        userInfo.value.email = email;
        userInfo.value.gender = gender;
        userInfo.value.introduction = introduction;
        userInfo.value.avatar = avatar;
    };


    const refreshAccessTokenHandler = async () => {
        try {
            const refreshToken = Cookies.get('myRefreshToken');
            const response = await refreshAccessToken({ refreshToken: refreshToken }); // 传递 refresh_token 到请求体中
            setToken(response.data.token);
            if (userInfo.value.username == null) {
                await updateUserBaseInfo();
            }
            ElMessage({
                type: 'success',
                message: userInfo.value.username + `欢迎回来`,
            });
        } catch (error) {
            console.error('刷新token失败:', error);
        }
    };

    const headers = computed(() => {
      return {
        Authorization: `Bearer ${token.value}`,
      };
    });

    const setToken = (newToken) => {
        token.value = newToken;
        localStorage.setItem('token', newToken);
    };
    
    return {
        userInfo,
        userLogin,
        userLogout,
        refreshLocal,
        userRegister,
        updateUserBaseInfo,
        extendUserInfo,
        removeUserInfo,
        changeInfo,
        userCollectDishes,
        userCollectCounters,
        userCollectCafeterias,
        userAte,
        userUpload,

        // 以下是登陆认证等功能函数
        token,
        refreshAccessTokenHandler,
        setToken,
        headers,
    };

}, {
    persist: {
        key: 'user-store', // 自定义存储键名
        storage: window.localStorage, // 你可以指定localStorage或sessionStorage
        paths: ['userInfo', 'userCollectDishes', 'userCollectCounters', 'userCollectCafeterias', 'userAte', 'userUpload', 'token'], // 需要持久化的状态
    },
});
