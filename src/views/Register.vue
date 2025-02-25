<template>
  <div class="bg">
    <div class="login-decorator" :class="{ 'slide-up': isLogin }">
      <div class="login-main">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo" width="130" height="100" >
        </div>
        <div class="header">{{ siteHeader }}</div>
        <form @submit.prevent="register">
          <div class="simpleui-input-inline">
            <el-input v-model="username" name="username" placeholder="用户名" autofocus :prefix-icon="User"></el-input>
          </div>
          <div class="simpleui-input-inline">
            <el-input v-model="userId" name="userId" placeholder="学工号" autofocus :prefix-icon="User"></el-input>
          </div>
          <div class="simpleui-input-inline">
            <el-input v-model="name" name="name" placeholder="姓名" :prefix-icon="User"></el-input>
          </div>
          <div class="simpleui-input-inline">
            <el-input type="password" v-model="password" name="password" @focus="changeLogoToClosedEyes"
              @blur="changeLogoToOpenEyes" placeholder="密码" show-password :prefix-icon="Lock"></el-input>
          </div>
          <div class="simpleui-input-inline">
            <el-input type="password" v-model="confirmPassword" name="confirmPassword" @focus="changeLogoToClosedEyes"
              @blur="changeLogoToOpenEyes" placeholder="再次输入密码" show-password :prefix-icon="Lock"></el-input>
          </div>
          <div class="simpleui-input-inline">
            <el-input v-model="email" name="email" placeholder="邮箱" :prefix-icon="Message"></el-input>
          </div>
          <div class="simpleui-input-inline button-container">
            <el-button @click="handleRegister" type="primary">注册</el-button>
            <el-button @click="goToLogin">返回登录</el-button>
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
import { register, checkuserIdandName } from '@/api/user';
import { User, Lock, Message } from '@element-plus/icons-vue';
import 'particles.js';
import { ElMessage, namespaceContextKey } from 'element-plus';
import { useUserStore } from '@/store/user';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Register',
  setup() {
    const router = useRouter();
    const username = ref('');
    const userId = ref('');
    const name = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const email = ref('');
    const logoOpenEyes = '@/assets/logo.png';
    const logoClosedEyes = '@/assets/logo.png';
    const logo = ref(logoOpenEyes);
    const siteHeader = '航小家注册界面';
    const isLogin = ref(false);

    const changeLogoToClosedEyes = () => {
      logo.value = logoClosedEyes;
    };

    const changeLogoToOpenEyes = () => {
      logo.value = logoOpenEyes;
    };

    const handleRegister = async () => {
      if (!username.value || !userId.value || !name.value || !password.value || !confirmPassword.value || !email.value) {
        ElMessage({
          message: '请填写所有字段。',
          type: 'error',
          duration: 1000,
        });
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email.value)) {
        ElMessage({
          message: '请输入有效的邮箱地址。',
          type: 'error',
          duration: 1000,
        });
        return;
      }

      const usernameRegex = /^[a-zA-Z0-9]+$/; // 正则表达式：仅允许英文字母和数字
      if (!usernameRegex.test(username.value)) {
        ElMessage({
          message: '用户名只能包含英文字母和数字。',
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
        // 检查学工号是否已经被注册
        const checkRes = await checkuserIdandName({userId:userId.value, name:name.value});
        if (checkRes.code !== 0) {
          ElMessage.error(checkRes.msg);
          return;
        }
        const res = await register({
          username: username.value,
          userId: userId.value,
          name: name.value,
          password: password.value,
          email: email.value
        });
        if (res.code === 0) {
          ElMessage({
            message: res.msg,
            type: 'success',
            duration: 1000,
          });

          setTimeout(() => {
            router.push('/login');
          }, 1000); // 1秒钟的过渡动画
        } else {
          ElMessage.error(res.msg);
        }
      } catch (error) {
        ElMessage({
          message: res.msg,
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
      userId,
      name,
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
  /* background: #f0f2f5; */
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
  max-width: 550px;
  min-width: 300px;
  margin-left: auto;
  margin-right: auto;
}

.logo img {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
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
