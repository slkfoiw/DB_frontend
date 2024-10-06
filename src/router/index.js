import { createRouter, createWebHistory } from 'vue-router';
// import Home from '@/views/Home.vue';
import Register from '@/views/Register.vue';
import Login from '@/views/Login.vue';
// import User from '@/views/User.vue';
import store from '@/store';
import Admin from '@/views/Admin.vue';
import User from '@/views/User.vue';
import SendNotice from '@/views/SendNotice.vue';

const routes = [
  {
    path: '/',
    name: 'ORIGIN',
    component: Admin
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/sendnotice',
    name: 'SendNotice',
    component: SendNotice
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
    // meta: { requiresAuth: true }
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = store.state.isAuthenticated;

  // if (requiresAuth && !isAuthenticated) {
  //   next('/login');
  // } else {
  //   next();
  // }
  next();
});

export default router;
