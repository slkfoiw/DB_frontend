<template>
  <div class="container bg" :class="{ 'slide-out': isRedirecting }">
    <div class="content">
      <h1>问问 AI 吃什么</h1>
      <div class="chat-box" ref="chatBox">
        <div v-for="message in messages" :key="message.id" class="message">
          <div v-if="message.type === 'user'" class="user-message">
            <span>{{ message.text }}</span>
            <img :src="userStore.userInfo.avatar" alt="User Avatar" class="avatar right-avatar">
          </div>
          <div v-else class="ai-message">
            <img src="https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/logo-admin.svg" alt="AI Avatar" class="avatar left-avatar">
            <span>{{ message.text }}</span>
          </div>
        </div>
      </div>
      <div class="input-container">
        <textarea v-model="userInput" placeholder="给AI发消息" @keydown.enter.prevent="askLLM"></textarea>
        <button @click="askLLM" :disabled="loading">询问 AI</button>
      </div>
      <div v-if="isRedirecting" class="loading-overlay">
        <div class="loading-content">
          <img src="https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/logo-admin.svg" class="bird-logo" alt="小鸟">
          <div class="loading-text">诶哎正在生成……</div>
        </div>
      </div>
    </div>
    <div id="particles-js"></div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, onBeforeMount, onMounted } from 'vue';
import { ai_chat } from '@/api/user.js';
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/user.js";

export default {
  name: 'LLMChat',
  setup() {
    const router = useRouter();
    const userInput = ref('');
    const loading = ref(false);
    const messages = ref([]);
    const userStore = useUserStore();
    const chatBox = ref(null);
    const isRedirecting = ref(false); // 新增

    const checkLogin = () => {
      if (!userStore.userInfo.username) {
        ElMessage({
          message: '请先登录',
          type: 'warning',
          duration: 2000,
        });
        router.replace('/login');
      }
    };

    onBeforeMount(() => {
      checkLogin();
    });

    onMounted(() => {
      // 初始AI消息
      messages.value.push({ id: Date.now(), type: 'ai', text: '问问AI吃点神马' });

      // 加载particles.js效果
      const script = document.createElement('script');
      script.src = '/src/utils/particles.js';
      script.onload = () => {
        particlesJS.load('particles-js', '/particles.json', function () {
          console.log('particles.js loaded - callback');
        });
      };
      document.body.appendChild(script);
    });

    const scrollToBottom = () => {
      if (chatBox.value) {
        chatBox.value.scrollTop = chatBox.value.scrollHeight;
      }
    };

    const askLLM = async () => {
      if (!userInput.value.trim()) return;
      messages.value.push({ id: Date.now(), type: 'user', text: userInput.value });
      scrollToBottom(); // 添加用户消息后滚动到底部
      loading.value = true;
      isRedirecting.value = true; // 启动动画
      try {
        const response = await ai_chat({ message: userInput.value });
        messages.value.push({ id: Date.now(), type: 'ai', text: response.data.message});
        scrollToBottom(); // 添加AI消息后滚动到底部
      } catch (error) {
        console.error('Error asking LLM:', error);
        ElMessage({
          message: '询问 AI 失败，请求超时或服务器问题',
          type: 'error',
          duration: 2000,
        });
      } finally {
        setTimeout(() => {
          isRedirecting.value = false; // 结束动画
          loading.value = false;
          userInput.value = '';
        }, 300); // 动画持续1秒
      }
    };

    return {
      userInput,
      askLLM,
      loading,
      messages,
      chatBox,
      userStore,
      isRedirecting // 新增
    };
  },
};
</script>

<style scoped>
.bg {
  background-image: url('https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/bg-login.svg');
  min-height: 100vh;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


#particles-js {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

body, html {
  height: 100%;
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.content {
  background: white; /* 白色背景 */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 600px;
}

h1 {
  margin-top: 0;
}

.chat-box {
  height: 400px; /* 固定高度 */
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
}

.message {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-message, .ai-message {
  display: flex;
  align-items: center;
}

.user-message {
  justify-content: flex-end;
  text-align: right;
  color: blue;
  margin-left: auto;
}

.ai-message {
  justify-content: flex-start;
  text-align: left;
  color: green;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.right-avatar {
  margin-left: 10px;
}

.left-avatar {
  margin-right: 10px;
}

.input-container {
  display: flex;
  align-items: center;
  width: 100%;
}

textarea {
  width: 85%;
  height: 40px;
  border-radius: 20px;
  border: 1px solid #ccc;
  resize: none; /* 禁止拉伸 */
  font-size: 16px;
  padding: 7px 20px;
  box-sizing: border-box;
}

button {
  width: 100px;
  height: 40px;
  margin-left: 10px;
  border: none;
  border-radius: 20px;
  background-color: #007BFF;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background-color: #ccc;
}

button:hover:enabled {
  background-color: #0056b3;
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

.bird-logo {
  width: 100px;
}

.loading-text {
  margin-top: 20px;
  font-size: 24px;
  color: #333;
}
</style>
