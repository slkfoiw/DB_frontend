<template>
  <div class="bg" :class="{ 'slide-out': isRedirecting }">
    <div class="login-decorator" :class="{ 'slide-down': isRegistering }">
      <div class="login-main">
        <div class="logo">
          <img alt="logo" class="logo" src="@/assets/logo.png" width="130" height="100" />
        </div>
        <div class="header">{{ siteHeader }}</div>
        <form @submit.prevent="login">
          <div class="simpleui-input-inline">
            <el-input v-model="username" name="username" placeholder="用户名" autofocus :prefix-icon="User"></el-input>
          </div>
          <div class="simpleui-input-inline">
            <el-input type="password" v-model="password" name="password" @keyup.enter="login" placeholder="密码" show-password
              :prefix-icon="Lock"></el-input>
          </div>
          <div class="simpleui-input-inline button-container">
            <el-button @click="login" type="primary">登录</el-button>
            <el-button @click="goToRegister" >注册</el-button>
          </div>
          <input type="hidden" name="next" :value="next">
        </form>
      </div>
    </div>
    <div id="particles-js"></div>
  </div>
</template>

<script>
/* global particlesJS */
import {useUserStore} from '@/store/user';
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {User, Message, Lock} from '@element-plus/icons-vue';
import 'particles.js';
import { ElMessage } from 'element-plus';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const logoOpenEyes = '@/assets/logo.png';
    const logoClosedEyes = '@/assets/logo.png';
    const logo = ref(logoOpenEyes);
    const siteHeader = '航小家登陆界面';
    const next = ref('');
    const isRedirecting = ref(false);
    const isRegistering = ref(false);

    const userStore = useUserStore();

    const changeLogoToClosedEyes = () => {
      logo.value = logoClosedEyes;
    };

    const changeLogoToOpenEyes = () => {
      logo.value = logoOpenEyes;
    };

    const login = async () => {
      if (!username.value || !password.value) {
        ElMessage({
          message: '用户名、密码均不能为空',
          type: 'error',
          duration: 1000,
        });
        return;
      }

      try {
        const response = await userStore.userLogin(username.value, password.value);
        if (!response) {
          ElMessage({
            message: '登录失败，请检查用户名和密码',
            type: 'error',
            duration: 1000,
          });
          return;
        }

        // 解析token获取用户角色
        const user = response.name;
        // 显示登录成功消息
        ElMessage({
          message: `欢迎 ${user} 登录成功`,
          type: 'success',
          duration: 1000, // 持续时间为1000毫秒
        });

        // 等待1秒后重定向到首页
        setTimeout(async () => {
          await router.replace('/home'); // 重定向到 /home 页面
        }, 500);

      } catch (error) {
        ElMessage({
          message: '登录失败，请检查用户名和密码是否正确',
          type: 'error',
          duration: 1000,
        });
      }
    };

    const goToRegister = () => {
      isRegistering.value = true;
      setTimeout(() => {
        router.push('/register');
      }, 1000); // 1秒钟的过渡动画
    };

    onMounted(() => {
      const script = document.createElement('script');
      script.src = '/src/utils/particles.js';
      script.onload = () => {
        particlesJS.load('particles-js', '/particles.json', function () {
          console.log('particles.js loaded - callback');
        });
      };
      document.body.appendChild(script);
    });

    return {
      username,
      password,
      login,
      logo,
      siteHeader,
      next,
      store: userStore,
      User,
      Message,
      Lock,
      goToRegister,
      isRedirecting,
      isRegistering,
      changeLogoToClosedEyes,
      changeLogoToOpenEyes,
    };
  },
};
</script>

<style scoped>
.bg {
  min-height: 100%;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 100%;
  padding: 20px 0;
  position: relative;
  z-index: 0;
  transition: transform 1s ease-in-out;
}

.slide-out {
  transform: translateX(-100%);
}

.slide-down {
  transform: translateY(100%);
}

#particles-js {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1000;
  animation: fadeIn 1s forwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-text {
  margin-top: 20px;
  font-size: 24px;
  color: #333;
}
</style>
