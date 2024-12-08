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
    meta: { requiresAuth: true },
    component: Admin
  },
  {
    path: "/notifications",
    name: "Notifications",
    meta: { requiresAuth: true },
    component: () => import("@/components/Notifications.vue"),
  },
  {
    path: '/dormManagerInfo',
    name: 'DormManagerInfo',
    meta: { requiresAuth: true },
    component: () => import('@/views/DormManaInfo.vue')
  },
  {
    path: '/stuInfo',
    name: 'StuInfo',
    meta: { requiresAuth: true },
    component: () => import('@/views/StuInfo.vue')
  },
  {
    path: '/dormitoryInfo',
    name: 'DormitoryInfo',
    meta: { requiresAuth: true },
    component: () => import('@/views/DormitoryInfo.vue')
  },
  {
    path: '/roomInfo',
    name: 'RoomInfo',
    meta: { requiresAuth: true },
    component: () => import('@/views/RoomInfo.vue')
  },
  {
    path: '/announcementList',
    name: 'AnnouncementList',
    meta: { requiresAuth: true },
    component: () => import('@/views/AnnouncementList.vue')
  },
  {
    path: '/repairList',
    name: 'RepairList',
    meta: { requiresAuth: true },
    component: () => import('@/views/RepairList.vue')
  },
  {
    path: '/changeRoomList',
    name: 'ChangeRoomList',
    meta: { requiresAuth: true },
    component: () => import('@/views/ChangeRoomList.vue')
  },
  {
    path: '/sendAnnouncement',
    name: 'SendAnnouncement',
    component: SendAnnouncement,
    meta: { requiresAuth: true },
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
      component: MyRoomInfo,
      meta: { requiresAuth: true },
    },
    {
      path: '/applyChangeRoom',
      name: 'ApplyChangeRoom',
      component: ApplyChangeRoom,
      meta: { requiresAuth: true },
    },
    {
      path: '/applyRepairInfo',
      name: 'ApplyRepairInfo',
      component: ApplyRepairInfo,
      meta: { requiresAuth: true },
    },

    {
      path: '/announcementBoard',
      name: 'AnnouncementBoard',
      component: AnnouncementBoard,
      meta: { requiresAuth: true },
    },

    {
      path: '/accessLogList',
      name: 'AccessLogList',
      component: () => import('@/views/AccessLogList.vue'),
      meta: { requiresAuth: true },
    }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    next();
});

export default router;
