import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import All from '@/views/All.vue';
import Cafeteria from '@/views/Cafeteria.vue';
import Counter from '@/views/Counter.vue';
import Register from '@/views/Register.vue';
import Login from '@/views/Login.vue';
import User from '@/views/User.vue';
import Team from '@/views/Team.vue';
import Detail from '@/views/Detail.vue';
import Upload from '@/views/Upload.vue';
import store from '@/store';
import AI from '@/views/AI.vue';

const routes = [
  {
    path: '/',
    name: 'ORIGIN',
    component: Home
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/team',
    name: 'Team',
    component: Team
  },
  {
    path: '/cafeteria',
    name: 'AllCafeteria',
    component: All
  },
  {
    path: '/all',
    name: 'All',
    component: All
  },
  {
    path: '/cafeteria/:cafeteriaId',
    name: 'Cafeteria',
    component: Cafeteria,
    props: true
  },
  {
    path: '/cafeteria/:cafeteriaId/counter/:counterId',
    name: 'CafeteriaCounter',
    component: Counter,
    props: true
  },
  {
    path: '/counter/:counterId',
    name: 'Counter',
    component: Counter,
    props: true
  },
  {
    path: '/dish/:dishId',
    name: 'DishDetail',
    component: Detail,
    props: true
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
  },
  {
    path: '/upload',
    name: 'Upload',
    component: Upload
  },
  {
    path: '/ai',
    name: 'AI',
    component: AI
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = store.state.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
