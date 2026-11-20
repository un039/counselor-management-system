import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../views/Layout.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/pc-counselor',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'PCCounselor',
        component: () => import('../views/pc-counselor/Index.vue'),
        children: [
          { path: 'dashboard', name: 'Dashboard', component: () => import('../views/pc-counselor/Dashboard.vue') },
          { path: 'student-manage', name: 'StudentManage', component: () => import('../views/pc-counselor/StudentManage.vue') },
          { path: 'custom-send', name: 'CustomSend', component: () => import('../views/pc-counselor/CustomSend.vue') },
          { path: 'questionnaire-manage', name: 'QuestionnaireManage', component: () => import('../views/pc-counselor/QuestionnaireManage.vue') },
          { path: 'questionnaire-view', name: 'QuestionnaireView', component: () => import('../views/pc-counselor/QuestionnaireView.vue') },
          { path: 'holiday-notice', name: 'HolidayNotice', component: () => import('../views/pc-counselor/HolidayNotice.vue') },
          { path: 'family-chat', name: 'FamilyChat', component: () => import('../views/pc-counselor/FamilyChat.vue') },
          { path: '', redirect: { name: 'Dashboard' } }
        ]
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      { path: 'member-manage', name: 'MemberManage', component: () => import('../views/user/MemberManage.vue') }
    ]
  },
  { path: '/', redirect: '/login' },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局前置守卫：基于本地 Token 判断登录态
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth) && !token) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && token) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
