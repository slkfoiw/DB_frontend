<template>
  <div class="app-container">
    <aside class = "sidebar">
      <img alt="buaa emoji" class="logo" src="https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/logo-bg-no.svg" width="80" height="80" />
      <ul>
        <li><div><router-link to="/home"><i class="fas fa-home"></i><span>首页</span></router-link></div></li>
        <li><div><router-link to="/all"><i class="fas fa-list"></i><span>所有</span></router-link></div></li>
        <li class="menu-break"><hr></li>
        <li><div><router-link to="/upload"><i class="fas fa-pencil-alt"></i><span>发布</span></router-link></div></li>
        <li><div><router-link to="/ai"><i class="fas fa-robot"></i><span>诶哎</span></router-link></div></li>
        <li id="user-about-us"><div><router-link :to="`/team`"><i class="fas fa-address-card"></i><span>我们</span></router-link></div></li>
        <li id="user-item" v-if="!show"><div><router-link :to="`/user/${userName}`"><i class="fas fa-user"></i><span>我的</span></router-link></div></li>
        <li id="user-item" v-if="show"><div><router-link :to="`/login`"><i class="fas fa-sign-in-alt"></i><span>登陆</span></router-link></div></li>
      </ul>
    </aside>
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
        if (this.userName == null) {
          return true;
        } else {
          return false;
        }
      }
    },
    setup() {
        const userStore = useUserStore();
        const userName = computed(() => userStore.userInfo.username);
        // console.log('userInfo:', userStore.userInfo);
        // console.log('userId:', userId.value);
        return {
            userName
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

.app-container {
  position: relative;
}

.sidebar {
    position: fixed;
    left: 0;
    width: 175px;
    min-height: 100vh;
    /* overflow: auto; */
    background-color: #125188;
    /* padding-left: 2px; */
    z-index: 1;
}

ul {
  margin: 0;
  padding: 0;
}

li>div {
  padding-left:1rem;
}

.menu-break {
  padding: 0 3rem 0 1.5rem;
}

main {
  margin-left: 200px;
  /* 设置左边距，使其不被侧边栏遮挡 */
  flex-grow: 1;
  /* 使主内容区域占据剩余空间 */
  /* padding: 20px; */
  /* 添加内边距，使内容不紧贴边缘 */
}

a {
  display: block;
  /* width: 100%; */
  color: white;
  font-size: 18px;
}

.fas {
  margin-left: 20px;
  margin-right: 10px;
  font-size: 20px;
  width: 24px; /* 固定图标宽度 */
}

span {
  margin-left: 5px;
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

#user-about-us {
  position: absolute;
  bottom: 80px;
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