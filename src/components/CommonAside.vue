<template>
  <aside class="side-nav">
    <div class="brand">
      <div class="brand-logo">辅</div>
      <div class="brand-text">
        <h1>辅导员工作台</h1>
        <p>WUT 家校沟通管理系统</p>
      </div>
    </div>

    <div class="user-card" v-if="userStore.userName">
      <div class="avatar">{{ userStore.userName.slice(0, 1) }}</div>
      <div class="user-meta">
        <div class="user-name">
          <span class="name">{{ userStore.userName }}</span>
          <span class="role">{{ userStore.roleName }}</span>
        </div>
        <div class="user-no">工号 {{ userStore.staffNo }}</div>
      </div>
    </div>

    <nav class="nav-menu">
      <p class="nav-group">功能导航</p>
      <router-link
        v-for="item in menus"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
      >
        <el-icon class="nav-icon"><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <button class="logout-btn" type="button" @click="handleLogout">
      <el-icon><SwitchButton /></el-icon>
      <span>退出登录</span>
    </button>
  </aside>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import {
  DataAnalysis, User, Promotion, Document,
  View, Calendar, ChatDotRound, Setting, SwitchButton
} from '@element-plus/icons-vue';
import { useUserInfoStore } from '../stores/userInfo';

const route = useRoute();
const router = useRouter();
const userStore = useUserInfoStore();

const menus = [
  { path: '/pc-counselor/dashboard', label: '数据概览', icon: DataAnalysis },
  { path: '/pc-counselor/student-manage', label: '学生信息管理', icon: User },
  { path: '/pc-counselor/custom-send', label: '自定义发送', icon: Promotion },
  { path: '/pc-counselor/questionnaire-manage', label: '问卷模板管理', icon: Document },
  { path: '/pc-counselor/questionnaire-view', label: '问卷查阅情况', icon: View },
  { path: '/pc-counselor/holiday-notice', label: '假期去向告知', icon: Calendar },
  { path: '/pc-counselor/family-chat', label: '亲属对话管理', icon: ChatDotRound },
  { path: '/user/member-manage', label: '成员管理', icon: Setting }
];

const isActive = (path: string) => route.fullPath.includes(path);

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', { type: 'warning' });
    userStore.logout();
    router.push('/login');
  } catch {
    // 取消
  }
};
</script>

<style scoped>
.side-nav {
  width: var(--app-sidebar-width);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 22px 14px 16px;
  color: #fff;
  background:
    radial-gradient(420px 260px at 100% 0%, rgba(47, 111, 237, 0.35) 0%, transparent 70%),
    linear-gradient(180deg, #0e1b34 0%, #142647 58%, #17305e 100%);
  box-sizing: border-box;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 6px;
  margin-bottom: 18px;
}

.brand-logo {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #4f8bff 0%, #2f6fed 100%);
  box-shadow: 0 6px 16px rgba(47, 111, 237, 0.4);
}

.brand-text h1 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #fff;
}

.brand-text p {
  margin: 2px 0 0;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 18px;
  border-radius: var(--app-radius-md);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.avatar {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: rgba(255, 255, 255, 0.16);
}

.user-meta {
  min-width: 0;
  line-height: 1.5;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-name .name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-name .role {
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: 999px;
  font-size: 10px;
  color: #cfe0ff;
  background: rgba(79, 139, 255, 0.3);
}

.user-no {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.nav-menu {
  flex: 1;
  overflow-y: auto;
  padding-right: 2px;
}

.nav-menu::-webkit-scrollbar {
  width: 4px;
}

.nav-group {
  margin: 0 0 8px;
  padding-left: 10px;
  font-size: 11px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.38);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 4px;
  border-radius: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.68);
  text-decoration: none;
  transition: background 0.18s ease, color 0.18s ease;
}

.nav-icon {
  font-size: 16px;
  opacity: 0.85;
}

.nav-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.nav-item.active {
  color: #fff;
  font-weight: 500;
  background: linear-gradient(90deg, rgba(47, 111, 237, 0.95) 0%, rgba(47, 111, 237, 0.55) 100%);
  box-shadow: 0 6px 16px rgba(47, 111, 237, 0.32);
}

.nav-item.active .nav-icon {
  opacity: 1;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  margin-top: 12px;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.68);
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  transition: all 0.18s ease;
}

.logout-btn:hover {
  color: #ffb4ad;
  background: rgba(240, 68, 56, 0.14);
  border-color: rgba(240, 68, 56, 0.35);
}
</style>
