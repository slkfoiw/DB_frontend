import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { login, register, refreshAccessToken, logout, getUserInfo } from "@/api/user.js";
import { ElMessage } from 'element-plus';
import Cookies from 'js-cookie';

export const useUserStore = defineStore('user', () => {
    const userInfo = ref({});
    const token = ref('');
    // 下面的个人信息之后应该在 userLogin 里面获取 对接完成之后可以删除
    userInfo.value = {
        nickname: 'Fanziyu',
        userid: 22373474,
        gender: 'female',
        introduction: '这个人很懒，什么都没留下',
        username: '樊孜昱',
        email: '123@qq.com',
        identityLevel: 2,
    }
    // 

    const userRegister = async ({ email, username, password }) => {
        await register({ email, username, password });
    };

    const userLogin = async (nickname, password) => {
        const response = await login({ nickname, password });

        if (response.success) {
            // 1. 返回数据
            const { token, refresh_token, username } = response.data;

            // 2. 设置token
            setToken(token);
            Cookies.set('myRefreshToken', refresh_token);

            // 3. 获取用户个人信息
            await updateUserBaseInfo();

            return { username }; // 返回包含用户名和角色的对象
        } else {
            return null;
        }
    }

    const updateUserBaseInfo = async () => {
        const res = await getUserInfo();
        userInfo.value.nickname = res.data.nickname;
        userInfo.value.userid = res.data.id;
        userInfo.value.gender = res.data.gender;
        userInfo.value.introduction = res.data.introduction;
        userInfo.value.username = res.data.username;
        userInfo.value.email = res.data.email;
        userInfo.value.identityLevel = res.data.identityLevel;
    }

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
        userRegister,
        userLogin,
        updateUserBaseInfo,
        userLogout,
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
