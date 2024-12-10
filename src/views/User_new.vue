<template>
  <div class="user-page">
    <!-- 顶部区域：欢迎语与日期 -->
    <div class="header">
      <h2>欢迎回来，{{ userInfo.name }}！</h2>
      <p>{{ currentDate }}</p>
    </div>

    <div class="content">
      <!-- 左侧：用户信息 -->
      <el-card class="user-info-card">
        <img src="@/assets/avatar.png" alt="用户头像" class="avatar" />
        <h3>
          {{ userInfo.name }}
          <span v-if="userInfo.gender === 'female'" class="gender-icon"><i class="fas fa-female"></i></span>
          <span v-if="userInfo.gender === 'male'" class="gender-icon"><i class="fas fa-male"></i></span>
        </h3>
        <el-tag :type="getIdentityTagType(userInfo.identityLevel)" class="identity-tag">
          {{ getIdentityName(userInfo.identityLevel) }}
        </el-tag>
        <p><strong>邮箱：</strong>{{ userInfo.email }}</p>
        <p><strong>个性签名：</strong>{{ userInfo.introduction || "暂无签名" }}</p>
      </el-card>

      <!-- 右侧：操作区域 -->
      <div class="actions">
        <el-button type="primary" @click="showEditModal = true">编辑信息</el-button>
        <EditUserInfoModal
          :userInfo="userInfo"
          :showModal="showEditModal"
          @update:showModal="showEditModal = $event"
          @doUpdate="doUpdate"
        />
        <el-button type="success" @click="showChangePasswordModal = true">修改密码</el-button>
        <ChangePasswordModal
          :showModal="showChangePasswordModal"
          @update:showModal="showChangePasswordModal = $event"
        />
        <el-button type="danger" @click="handleLogout">退出登录</el-button>
        <el-button type="warning" @click="handleAccountDeletion">注销账号</el-button>
      </div>
    </div>

    <!-- 粒子背景 -->
    <div id="particles-js"></div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import EditUserInfoModal from "@/components/EditUserInfoModal.vue";
import ChangePasswordModal from "@/components/ChangePasswordModal.vue";
import { useUserStore } from "@/store/user";
import 'particles.js';

// 用户信息
const userStore = useUserStore();
const userInfo = ref(userStore.userInfo);

// 当前日期
const currentDate = new Date().toLocaleDateString("zh-CN", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

// 弹窗状态
const showEditModal = ref(false);
const showChangePasswordModal = ref(false);

// 更新用户信息
const doUpdate = async () => {
  await userStore.updateUserBaseInfo();
};

// 退出登录
const handleLogout = () => {
  alert("您已退出登录！");
};

// 注销账号
const handleAccountDeletion = () => {
  alert("账号已注销！");
};

// 获取身份名称与样式
const getIdentityName = (identityLevel) => {
  switch (identityLevel) {
    case 0: return "学校管理员";
    case 1: return "宿管";
    case 2: return "学生";
    default: return "未知身份";
  }
};

const getIdentityTagType = (identityLevel) => {
  switch (identityLevel) {
    case 0: return "danger";
    case 1: return "warning";
    case 2: return "success";
    default: return "info";
  }
};

// 粒子背景加载
onMounted(() => {
  particlesJS.load("particles-js", "/particles.json", () => {
    console.log("particles.js loaded.");
  });
});
</script>


<style scoped>
.user-page {
  background: linear-gradient(to bottom, #f5f7fa, #e2ecf3);
  min-height: 100vh;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h2 {
  font-size: 24px;
  color: #4274b9;
}

.header p {
  font-size: 16px;
  color: #666;
}

.content {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.user-info-card {
  flex: 1;
  padding: 20px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 10px;
}

.identity-tag {
  margin: 10px 0;
}

.actions {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.actions .el-button {
  width: 100%;
}

#particles-js {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}
</style>

