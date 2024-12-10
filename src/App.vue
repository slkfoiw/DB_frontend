<script setup>
import { useRoute } from 'vue-router'; // 获取当前路由信息
import Sidebar_new from './components/Sidebar_new.vue';

const route = useRoute(); // 当前路由
const noSidebarRoutes = ['/login', '/register',  '/']; // 不需要 Sidebar 的路由
</script>

<template>
  <div>
    <!-- 如果当前路由不在 noSidebarRoutes 中，显示 Sidebar 和主布局 -->
    <div v-if="!noSidebarRoutes.includes(route.path)" class="container">
      <Sidebar_new />
      <main>
        <router-view />
      </main>
    </div>

    <!-- 否则，直接显示路由内容（如登录注册页面） -->
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  min-height: 100vh; /* 确保容器高度至少为视口高度 */
}

main {
  flex-grow: 1;
  margin-left: 65px;
  background-color: #f1f1f1;
  flex-direction: column;
  justify-content: center; /* 垂直居中对齐 */
  align-items: center; /* 水平居中对齐 */
  box-sizing: border-box; /* 确保padding不会导致高度超标 */
  position: relative;
  z-index: 0;
}

</style>
