import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { login, register, refreshAccessToken, logout, getUserInfo, deleteAccount } from "@/api/user.js";
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';

export const useUserStore = defineStore('user', () => {
    const userInfo = ref({});
    const token = ref('');
    // 下面的个人信息之后应该在 userLogin 里面获取 对接完成之后可以删除
    // userInfo.value = {
    //     username: 'Fanziyu',
    //     userId: 22373474,
    //     gender: 'female',
    //     introduction: '这个人很懒，什么都没留下',
    //     name: '樊孜昱',
    //     email: '123@qq.com',
    //     identityLevel: 2,
    // };

    const userLogin = async (username, password) => {
        const response = await login({ username, password });
        if (response.status === 0) {
            // 1. 返回数据
            const name = response.data;
            const token = response.token;
            const refresh_token = response.refresh_token;
            // 2. 设置token
            setToken(token);
            Cookies.set('myRefreshToken', refresh_token);

            // 3. 获取用户个人信息
            await updateUserBaseInfo();
            console.log('name:', name);
            return { name }; // 返回包含用户名和角色的对象
        } else {
            return null;
        }
    }

    const updateUserBaseInfo = async () => {
        const res = await getUserInfo();
        console.log('updateUserBaseInfo res:', res);
        userInfo.value.username = res.data.username;
        userInfo.value.userId = res.data.userId;
        userInfo.value.gender = res.data.gender;
        userInfo.value.introduction = res.data.introduction;
        userInfo.value.name = res.data.name;
        userInfo.value.email = res.data.email;
        userInfo.value.identityLevel = res.data.identityLevel;
        console.log('updateUserBaseInfo userInfo:', userInfo.value);
    }

    const userLogout = async () => {
            const res = await logout();
            if (res.status !== 0) {
                ElMessage.error(res.msg);
                console.log('登出失败:', res.msg);
                return res.code;
            }
            // 清理用户信息和相关状态
            refreshLocal();
            return 0;
    };

    const userDeleteAccount = async () => {
        const res = await deleteAccount();
        if (res.code !== 0) {
            ElMessage.error(res.msg);
            return res.code;
        }
        refreshLocal();
        return 0;
    }

    const refreshLocal = () => {
        userInfo.value = {};
        token.value = '';

        // 清理本地存储和 cookie
        localStorage.removeItem('token');
        Cookies.remove('myRefreshToken');
    }

    const changeInfo = ({ email, gender, introduction }) => {
        userInfo.value.email = email;
        userInfo.value.gender = gender;
        userInfo.value.introduction = introduction;
    };


    const refreshAccessTokenHandler = async () => {
        try {
            const refreshToken = Cookies.get('myRefreshToken');
            const response = await refreshAccessToken({ refreshToken: refreshToken }); // 传递 refresh_token 到请求体中
            setToken(response.data.token);
            if (userInfo.value.name == null) {
                await updateUserBaseInfo();
            }
            ElMessage({
                type: 'success',
                message: userInfo.value.name + `欢迎回来`,
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
        console.log('login token:', token.value);
        localStorage.setItem('token', newToken);
    };

    return {
        userInfo,
        userLogin,
        updateUserBaseInfo,
        userLogout,
        userDeleteAccount,
        refreshLocal,
        changeInfo,

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
        paths: ['userInfo', 'token'], // 需要持久化的状态
    },
});
