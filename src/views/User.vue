<template>
  <div class="bg">
    <!-- 注销和退出按钮 -->
    <div id="logout">
      <ConfirmModal :exeName="'注销账号'"/>
    </div>
    <div id="logout">
      <ConfirmModal :exeName="'退出登录'"/>
    </div>
    <!-- 用户信息展示 -->
    <div class="userInfo" v-if="userInfo">
      <el-row :gutter="10">
        <el-col :span="12" style="width: 200px;">
          <img src="@/assets/avatar.png" width="200" height="200" alt="用户头像" />
        </el-col>
        <el-col :span="12" style="width: 250px!important;">
          <h2>
            {{ userInfo.name }}
            <span v-if="userInfo.gender === 'female'" class="gender-icon"><i class="fas fa-female"></i></span>
            <span v-if="userInfo.gender === 'male'" class="gender-icon"><i class="fas fa-male"></i></span>
            <span v-if="userInfo.gender === 'null'" class="gender-icon"><i class="fas fa-genderless"></i></span>
          </h2>
          <!-- 用户身份 -->
          <p class="identity">
            <el-tag :type="getIdentityTagType(userInfo.identityLevel)">
              {{ getIdentityName(userInfo.identityLevel) }}
            </el-tag>
          </p>
          <p class="in-one"><strong>用户名：</strong>{{ userInfo.username }}</p>
          <p class="in-one"><strong>邮箱：</strong>{{ userInfo.email }}</p>
          <p class="in-one"><strong>个性签名：</strong>{{ userInfo.introduction }}</p>
        </el-col>
      </el-row>
    </div>

    <!-- 编辑和修改密码按钮 -->
    <div class="editUserInfo">
      <el-button @click="showEditModal = true" type="primary" class="userBtn">编辑用户信息</el-button>
      <EditUserInfoModal
        :userInfo="userInfo"
        :showModal="showEditModal"
        @update:showModal="showEditModal = $event"
        @doUpdate="doUpdate"
      />
      <el-button @click="showChangePasswordModal = true" type="warning" class="userBtn">修改密码</el-button>
      <ChangePasswordModal
        :showModal="showChangePasswordModal"
        @update:showModal="showChangePasswordModal = $event"
      />
    </div>

    <!-- 粒子背景效果 -->
    <div id="particles-js"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import EditUserInfoModal from '@/components/EditUserInfoModal.vue';
import ChangePasswordModal from '@/components/ChangePasswordModal.vue';
import { useUserStore } from "@/store/user";
import 'particles.js';

// 加载用户信息
const userStore = useUserStore();
const userInfo = ref(userStore.userInfo);

const getUserName = async () => {
  document.title = userInfo.value.name + '的航小家';
};

const showEditModal = ref(false);
const showChangePasswordModal = ref(false);

const doUpdate = async () => {
  await useUserStore().updateUserBaseInfo()
};

// 获取身份名称
const getIdentityName = (identityLevel) => {
  switch (identityLevel) {
    case 0: return '学校管理员';
    case 1: return '宿管';
    case 2: return '学生';
    default: return '未知身份';
  }
};

// 获取标签样式类型
const getIdentityTagType = (identityLevel) => {
  switch (identityLevel) {
    case 0: return 'danger'; // 红色标签
    case 1: return 'warning'; // 黄色标签
    case 2: return 'success'; // 绿色标签
    default: return 'info'; // 默认蓝色标签
  }
};

// onMounted 生命周期钩子
onMounted(async () => {
  await getUserName();
});

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
</script>

<style scoped>
.bg {
  min-height: 100%;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 100%;
  position: relative;
}

#particles-js {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1000;
}

#logout {
  margin-top: 10px;
  margin-right: 10px;
  float: right;
}

.editUserInfo {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

h3 {
  margin: 0;
  padding: 10px;
  background-color: #4274b9;
  color: white;
  text-align: center;
}

.userInfo {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 20px;
}

.checkBox {
  margin-top: 30px;
}

.radio-group {
  display: flex;
  justify-content: center;
}

/* 用户身份部分 */
.identity {
  margin: 8px 0; /* 添加间距 */
  font-size: 1em;
}

.gender-icon {
  margin-left: 10px;
  font-size: 0.8em; /* 调整字体大小 */
  color: #888; /* 调整颜色 */
}

.gender-icon i {
  margin-right: 5px;
}

.in-one {
  width: 240px;
}

.fa-female {
  color: pink;
}

.fa-male {
  color: blue;
}

/* 使用Element Plus按钮样式 */
.userBtn {
  margin: 10px;
  padding: 10px 20px;
  font-size: 14px;
}
</style>
