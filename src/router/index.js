import { createRouter, createWebHistory } from 'vue-router';
// import Home from '@/views/Home.vue';
import Register from '@/views/Register.vue';
import Login from '@/views/Login.vue';
// import User from '@/views/User.vue';
import store from '@/store';
import Admin from '@/views/Admin.vue';
import User from '@/views/User.vue';
import SendAnnouncement from '@/views/SendAnnouncement.vue';
// STUDENT
import ApplyChangeRoom from '@/views/STUDENT/ApplyChangeRoom.vue';
import ApplyRepairInfo from '@/views/STUDENT/ApplyRepairInfo.vue';
import MyRoomInfo from '@/views/STUDENT/MyRoomInfo.vue';
import AnnouncementBoard from '@/views/AnnouncementBoard.vue';

const routes = [
  {
    path: '/home',
    name: 'ORIGIN',
    component: Admin
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: () => import("@/components/Notifications.vue"),
  },
  {
    path: '/dormManagerInfo',
    name: 'DormManagerInfo',
    component: () => import('@/views/DormManaInfo.vue')
  },
  {
    path: '/stuInfo',
    name: 'StuInfo',
    component: () => import('@/views/StuInfo.vue')
  },
  {
    path: '/dormitoryInfo',
    name: 'DormitoryInfo',
    component: () => import('@/views/DormitoryInfo.vue')
  },
  {
    path: '/roomInfo',
    name: 'RoomInfo',
    component: () => import('@/views/RoomInfo.vue')
  },
  {
    path: '/announcementList',
    name: 'AnnouncementList',
    component: () => import('@/views/AnnouncementList.vue')
  },
  {
    path: '/repairList',
    name: 'RepairList',
    component: () => import('@/views/RepairList.vue')
  },
  {
    path: '/changeRoomList',
    name: 'ChangeRoomList',
    component: () => import('@/views/ChangeRoomList.vue')
  },
  {
    path: '/sendAnnouncement',
    name: 'SendAnnouncement',
    component: SendAnnouncement
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/user/:userId',
    name: 'User',
    component: User,
    meta: { requiresAuth: true },
    props: true
  },

    // STUDENT
    {
      path: '/myRoomInfo',
      name: 'MyRoomInfo',
      component: MyRoomInfo
    },
    {
      path: '/applyChangeRoom',
      name: 'ApplyChangeRoom',
      component: ApplyChangeRoom
    },
    {
      path: '/applyRepairInfo',
      name: 'ApplyRepairInfo',
      component: ApplyRepairInfo
    },

    {
      path: '/announcementBoard',
      name: 'AnnouncementBoard',
      component: AnnouncementBoard
    }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = store.state.isAuthenticated;
  console.log('router.beforeEach', requiresAuth, isAuthenticated);
  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
