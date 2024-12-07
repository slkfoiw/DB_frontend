<template>
  <div class="app-container">
    <el-menu :default-active="this.$route.path" router
      unique-opened class="sidebar">
      <!-- logo -->
      <img alt="logo" class="logo" src="@/assets/emoji.png" width="80" height="80" />
      
      <!-- 侧边菜单列表 -->
      <el-menu-item index="/home">
        <el-icon><house/></el-icon>
        <span>首页</span>
      </el-menu-item>
      <!-- identityLevel 学校管理员：0 宿管：1 学生：2 -->
      <el-sub-menu v-if="identityLevel !== 2" index="2">
        <template #title>
          <el-icon><user/></el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item v-if="identityLevel === 0" index="/dormManagerInfo">宿管信息</el-menu-item>
        <el-menu-item index="/stuInfo">学生信息</el-menu-item>
      </el-sub-menu>
      <el-sub-menu v-if="identityLevel !== 2" index="3">
        <template #title>
          <el-icon><coin/></el-icon>
          <span>宿舍管理</span>
        </template>
        <el-menu-item index="/dormitoryInfo">公寓信息</el-menu-item>
        <el-menu-item index="/roomInfo">房间信息</el-menu-item>
      </el-sub-menu>
      <el-sub-menu v-if="identityLevel !== 2" index="4">
        <template #title>
          <el-icon><message/></el-icon>
          <span>信息管理</span>
        </template>
        <el-menu-item index="/announcementList">公告列表</el-menu-item>
        <el-menu-item index="/repairList">报修记录</el-menu-item>
        <el-menu-item index="/changeRoomList">调宿记录</el-menu-item>
      </el-sub-menu>
      
      <el-menu-item index="/announcementBoard">
      <el-icon><DataLine /></el-icon>
      <span>公告栏</span>
      </el-menu-item>
      
      <!-- 判断STUDENT身份 -- begin-->
      <el-menu-item v-if="identityLevel === 2" index="/myRoomInfo">
      <el-icon><school /></el-icon>
      <span>我的宿舍</span>
      </el-menu-item>
      <el-menu-item v-if="identityLevel === 2" index="/applyChangeRoom">
      <el-icon><takeaway-box /></el-icon>
      <span>申请调宿</span>
      </el-menu-item>
      <el-menu-item v-if="identityLevel === 2" index="/applyRepairInfo">
      <el-icon><set-up /></el-icon>
      <span>报修申请</span>
      </el-menu-item>
      <!-- 判断STUDENT身份 -- end-->

      <el-menu-item :index="`/user/${userId}`">
        <template #title>
          <el-icon><setting/></el-icon>
          <span>个人信息</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';
import { useUserStore } from '@/store/user';
import { ref, computed } from 'vue';

export default {
    name: 'Sidebar',
    data(){
      return {
        // show:true,
      }
    },
    computed:{
      show(){
        if (this.name == null) {
          return true;
        } else {
          return false;
        }
      }
    },
    setup() {
        const userStore = useUserStore();
        const name = computed(() => userStore.userInfo.name);
        const userId = computed(() => userStore.userInfo.userId);
        const identityLevel = computed(() => userStore.userInfo.identityLevel);
        // console.log('userInfo:', userStore.userInfo);
        // console.log('userId:', userId.value);
        return {
            userId,
            name,
            identityLevel
        }
    }
}
</script>
<style scoped>
header {
	margin:0;
	padding:0;
	border:0
}

.sidebar {
  width: 200px; 
  height: 100%; 
  min-height: calc(100vh - 40px);
  position: fixed;
  left: 0;
  /* overflow: auto; */
  /* background-color: #82a6c5; */
  /* padding-left: 2px; */
  z-index: 1;
}

.icon {
  margin-right: 6px;
}

.el-sub-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
  padding: 0 45px;
  min-width: 199px;
}

.logo {
  display: block;
  margin: 20px auto;
}

#user-item {
  position: absolute;
  bottom: 30px;
  left: 0;
  width: 100%;
}

@media (hover: hover) {
  li>div:hover {
    background-color: #32B1EE
  }
}

@media (max-width: 1024px) {
  .sidebar {
    width: 120px;
  }

  main {
  margin-left: 120px;
  /* 设置左边距，使其不被侧边栏遮挡 */
  flex-grow: 1;
  /* 使主内容区域占据剩余空间 */
  }
}
</style>