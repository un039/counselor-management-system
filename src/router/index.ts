import {createRouter, createWebHistory} from 'vue-router';
import Layout from '../views/Layout.vue';
import Login from '../views/Login.vue';
import PCCounselorIndex from '../views/pc-counselor/Index.vue';
import CustomSend from '../views/pc-counselor/CustomSend.vue';
import QuestionnaireManage from '../views/pc-counselor/QuestionnaireManage.vue';
import QuestionnaireView from '../views/pc-counselor/QuestionnaireView.vue';
import FamilyChat from '../views/pc-counselor/FamilyChat.vue';
import HolidayNotice from '../views/pc-counselor/HolidayNotice.vue';
import MemberManage from '../views/user/MemberManage.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/pc-counselor',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'PCCounselor',
        component: PCCounselorIndex,
        children: [
          { path: 'custom-send', name: 'CustomSend', component: CustomSend },
          { path: 'questionnaire-manage', name: 'QuestionnaireManage', component: QuestionnaireManage },
          { path: 'questionnaire-view', name: 'QuestionnaireView', component: QuestionnaireView },
          { path: 'holiday-notice', name: 'HolidayNotice', component: HolidayNotice },
          { path: 'family-chat', name: 'FamilyChat', component: FamilyChat },
          { path: '', redirect: { name: 'CustomSend' } }
        ]
      }
    ]
  },
  { path: '/', redirect: '/login' }, // 根路径直接重定向到登录页
  { path: '/user', component: Layout, meta: { requiresAuth: true }, children: [
    { path: 'member-manage', name: 'MemberManage', component: MemberManage }
  ] },
  { path: '/:pathMatch(.*)*', redirect: '/login' } // 404路由重定向到登录页
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

import { useUserInfoStore } from '../stores/userInfo';
router.beforeEach((to, from, next) => {
  try {
    const userStore = useUserInfoStore();
    const isLoggedIn = userStore.isLoggedIn;
    // 检查目标路由是否需要登录
    if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } catch (error) {
    // 处理Pinia未初始化导致的错误，重定向到登录页
    next({ name: 'Login' });
  }
});

export default router;