<template>
  <div class="side-nav">
    <div class="nav-header">
      <h2>辅导员工作管理系统</h2>
      <div class="user-info" v-if="userStore.userName">
        <span class="name">{{ userStore.userName }}</span>
        <span class="role">{{ userStore.roleName }}</span>
        <span class="no">工号 {{ userStore.staffNo }}</span>
      </div>
    </div>
    <ul class="nav-menu">
      <li :class="{ active: isActive('pc-counselor/dashboard') }">
        <router-link to="/pc-counselor/dashboard">数据概览</router-link>
      </li>
      <li :class="{ active: isActive('pc-counselor/student-manage') }">
        <router-link to="/pc-counselor/student-manage">学生信息管理</router-link>
      </li>
      <li :class="{ active: isActive('pc-counselor/custom-send') }">
        <router-link to="/pc-counselor/custom-send">自定义发送</router-link>
      </li>
      <li :class="{ active: isActive('pc-counselor/questionnaire-manage') }">
        <router-link to="/pc-counselor/questionnaire-manage">问卷模板管理</router-link>
      </li>
      <li :class="{ active: isActive('pc-counselor/questionnaire-view') }">
        <router-link to="/pc-counselor/questionnaire-view">问卷查阅情况</router-link>
      </li>
      <li :class="{ active: isActive('pc-counselor/holiday-notice') }">
        <router-link to="/pc-counselor/holiday-notice">假期去向告知</router-link>
      </li>
      <li :class="{ active: isActive('pc-counselor/family-chat') }">
        <router-link to="/pc-counselor/family-chat">亲属对话管理</router-link>
      </li>
      <li :class="{ active: isActive('user/member-manage') }">
        <router-link to="/user/member-manage">成员管理</router-link>
      </li>
    </ul>
    <div class="logout" @click="handleLogout">退出登录</div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { useUserInfoStore } from '../stores/userInfo';

const route = useRoute();
const router = useRouter();
const userStore = useUserInfoStore();

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
  width: 220px;
  background: linear-gradient(180deg, #1b3a6b 0%, #2f6fed 100%);
  color: #fff;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.nav-header {
  text-align: center;
  margin-bottom: 22px;
}
.nav-header h2 {
  margin: 0 0 12px;
  font-size: 15px;
  letter-spacing: 1px;
}
.user-info {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  padding: 8px 6px;
  font-size: 12px;
  line-height: 1.7;
}
.user-info .name {
  font-weight: 600;
  font-size: 13px;
}
.user-info .role {
  margin-left: 6px;
  background: rgba(255, 255, 255, 0.25);
  padding: 1px 6px;
  border-radius: 8px;
  font-size: 11px;
}
.user-info .no {
  display: block;
  opacity: 0.75;
}
.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}
.nav-menu li {
  margin: 6px 0;
}
.nav-menu li a {
  color: #e8efff;
  text-decoration: none;
  display: block;
  padding: 9px 12px;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
}
.nav-menu li a:hover {
  background: rgba(255, 255, 255, 0.14);
}
.nav-menu li.active a {
  background: #fff;
  color: #2f6fed;
  font-weight: 600;
}
.logout {
  text-align: center;
  font-size: 13px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.12);
}
.logout:hover {
  background: rgba(255, 255, 255, 0.22);
}
</style>
