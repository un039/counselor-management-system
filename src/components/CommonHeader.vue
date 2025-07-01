<template>
  <div class="top-bar">
    <h3>WUT家校沟通管理系统</h3>
    <button class="logout-btn" @click="handleLogout">退出登录</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '../stores/userInfo.ts';

const router = useRouter();
const userStore = useUserInfoStore();

const handleLogout = () => {
  userStore.logout();
  router.push('/');
};
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 10px 20px;
  border-bottom: 1px solid #eaeaea;
}
.top-bar h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}
.logout-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
}
.logout-btn:hover {
  background-color: #0056b3;
}
</style>