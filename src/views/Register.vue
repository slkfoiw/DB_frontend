<template>
  <div class="bg">
    <div class="login-decorator" :class="{ 'slide-up': isLogin}">
      <div class="login-main">
        <div class="logo">
          <img :src="logo" alt="Logo">
        </div>
        <div class="header">{{ siteHeader }}</div>
        <form @submit.prevent="register">
          <div class="simpleui-input-inline">
            <el-input
              v-model="username"
              name="username"
              placeholder="用户名"
              autofocus
              :prefix-icon="User"
            ></el-input>
          </div>
          <div class="simpleui-input-inline">
            <el-input
              type="password"
              v-model="password"
              name="password"
              @focus="changeLogoToClosedEyes"
              @blur="changeLogoToOpenEyes"
              placeholder="密码"
              show-password
              :prefix-icon="Lock"
            ></el-input>
          </div>
          <div class="simpleui-input-inline">
            <el-input
              type="password"
              v-model="confirmPassword"
              name="confirmPassword"
              @focus="changeLogoToClosedEyes"
              @blur="changeLogoToOpenEyes"
              placeholder="再次输入密码"
              show-password
              :prefix-icon="Lock"
            ></el-input>
          </div>
          <div class="simpleui-input-inline">
            <el-input
              v-model="email"
              name="email"
              placeholder="邮箱"
              :prefix-icon="Message"
            ></el-input>
          </div>
          <div class="simpleui-input-inline button-container">
            <el-button
              @click="handleRegister"
              type="primary"
            >注册</el-button>
            <el-button @click="goToLogin" type="secondary">返回登录</el-button>
          </div>
        </form>
      </div>
    </div>
    <div id="particles-js"></div>
  </div>
</template>

<script>
/* global particlesJS */

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/api';
import { User, Lock, Message } from '@element-plus/icons-vue';
import 'particles.js';
import { ElMessage } from 'element-plus';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Register',
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const email = ref('');
    const logoOpenEyes = 'https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/logo-bg-no.svg';
    const logoClosedEyes = 'https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/logo-close-eyes.jpg';
    const logo = ref(logoOpenEyes);
    const siteHeader = '小蓝书注册界面';
    const isLogin = ref(false);

    const changeLogoToClosedEyes = () => {
      logo.value = logoClosedEyes;
    };

    const changeLogoToOpenEyes = () => {
      logo.value = logoOpenEyes;
    };

    const handleRegister = async () => {

      if (!username.value || !password.value || !confirmPassword.value || !email.value) {
        ElMessage({
          message: '请填写所有字段。',
          type: 'error',
          duration: 1000,
        });
        return;
      }

      const usernameRegex = /^[a-zA-Z0-9_]{5,15}$/;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!usernameRegex.test(username.value)) {
        ElMessage({
          message: '用户名必须是5-15个字符，只能包含字母、数字和下划线。',
          type: 'error',
          duration: 1000,
        });
        return;
      }

      if (!emailRegex.test(email.value)) {
        ElMessage({
          message: '请输入有效的邮箱地址。',
          type: 'error',
          duration: 1000,
        });
        return;
      }

      if (password.value.length < 6) {
        ElMessage({
          message: '密码必须至少包含6个字符。',
          type: 'error',
          duration: 1000,
        });
        return;
      }

      if (password.value !== confirmPassword.value) {
        ElMessage({
          message: '两次输入的密码不一致。',
          type: 'error',
          duration: 1000,
        });
        return;
      }

      try {
        const res = await register({username: username.value, password: password.value, email: email.value});

        if (res.success) {
          ElMessage({
            message: '注册成功，即将跳转到登录页面',
            type: 'success',
            duration: 1000,
          });

          setTimeout(() => {
            router.push('/login');
          }, 1000); // 1秒钟的过渡动画
        }
      } catch (error) {
        ElMessage({
          message: '注册失败，请检查用户名和邮箱是否已经被注册。',
          type: 'error',
          duration: 1000,
        });
      }
    };

    const goToLogin = () => {
      isLogin.value = true;
      setTimeout(() => {
        router.push('/login');
      }, 1000); // 1秒钟的过渡动画
    };

    onMounted(() => {
      particlesJS.load('particles-js', '/particles.json', function () {
        console.log('particles.js loaded - callback');
      });
    });

    return {
      username,
      password,
      confirmPassword,
      email,
      handleRegister,
      logo,
      siteHeader,
      User,
      Lock,
      Message,
      goToLogin,
      isLogin,
      changeLogoToClosedEyes,
      changeLogoToOpenEyes,
    };
  },
};
</script>

<style scoped>
.bg {
  background: #f0f2f5;
  background-image: url('https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/bg-login.svg');
  min-height: 100%;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 100%;
  padding: 20px 0;
  position: relative;
  z-index: 0;
}

.slide-up {
  transform: translateY(-100%);
}

#particles-js {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: -1;
}

.login-decorator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 94vh;
  z-index: 1;
  transition: transform 1s ease-in-out;
}

.login-main {
  padding-bottom: 50px;
  max-width: 350px;
  margin-left: auto;
  margin-right: auto;
}

.logo img {
  width: 30%;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.header {
  font-size: 26px;
  color: #666;
  margin: 0 auto 40px auto;
  text-align: center;
  font-weight: 700;
}

.simpleui-input-inline {
  margin-bottom: 15px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

</style>





