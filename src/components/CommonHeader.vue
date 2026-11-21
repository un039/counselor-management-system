<template>
  <header class="top-bar">
    <div class="crumb">
      <el-icon class="crumb-icon"><HomeFilled /></el-icon>
      <span>辅导员工作台</span>
      <span class="divider">/</span>
      <span class="current">{{ pageTitle }}</span>
    </div>

    <el-dropdown trigger="click" @command="handleCommand">
      <div class="user-entry">
        <span class="avatar">{{ initial }}</span>
        <span class="user-name">{{ userStore.userName || '未登录' }}</span>
        <el-icon class="arrow"><ArrowDown /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item disabled>{{ userStore.staffNo }} · {{ userStore.roleName }}</el-dropdown-item>
          <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { ArrowDown, HomeFilled } from '@element-plus/icons-vue';
import { useUserInfoStore } from '../stores/userInfo';

const route = useRoute();
const router = useRouter();
const userStore = useUserInfoStore();

const TITLE_MAP: Record<string, string> = {
  '/pc-counselor/dashboard': '数据概览',
  '/pc-counselor/student-manage': '学生信息管理',
  '/pc-counselor/custom-send': '自定义发送',
  '/pc-counselor/questionnaire-manage': '问卷模板管理',
  '/pc-counselor/questionnaire-view': '问卷查阅情况',
  '/pc-counselor/holiday-notice': '假期去向告知',
  '/pc-counselor/family-chat': '亲属对话管理',
  '/user/member-manage': '成员管理'
};

const pageTitle = computed(() => TITLE_MAP[route.path] || '工作台');
const initial = computed(() => userStore.userName?.slice(0, 1) || 'U');

const handleCommand = async (command: string) => {
  if (command !== 'logout') return;
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
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  height: var(--app-header-height);
  padding: 0 24px;
  background: var(--app-surface);
  border-bottom: 1px solid var(--app-border);
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.03);
}

.crumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--app-text-muted);
}

.crumb-icon {
  font-size: 14px;
}

.crumb .current {
  color: var(--app-text-regular);
  font-weight: 500;
}

.divider {
  color: #d0d7e3;
}

.user-entry {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 10px 5px 5px;
  border-radius: 999px;
  cursor: pointer;
  outline: none;
  transition: background 0.18s ease;
}

.user-entry:hover {
  background: #f4f6fb;
}

.avatar {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #4f8bff 0%, #2f6fed 100%);
}

.user-name {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: var(--app-text-regular);
}

.arrow {
  font-size: 12px;
  color: var(--app-text-muted);
}
</style>
