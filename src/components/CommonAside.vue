<template>
  <div class="side-nav">
    <div class="nav-header">
      <h2>家校互通管理</h2>
      <div class="user-info" v-if="userStore.userName">
        <span>{{ userStore.userName }}（辅导员）</span>
      </div>
    </div>
    <ul class="nav-menu">
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
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useUserInfoStore } from '../stores/userInfo.ts';

const route = useRoute();
const userStore = useUserInfoStore();

const isActive = (path: string) => {
  return route.fullPath.includes(path);
};
</script>

<style scoped>
.side-nav {
  width: 220px;
  background-color: #007bff;
  color: #fff;
  padding: 20px;
}
.nav-header {
  text-align: center;
  margin-bottom: 20px;
}
.nav-header h2 {
  margin: 0;
  font-size: 18px;
}
.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}
.nav-menu li {
  margin: 10px 0;
}
.nav-menu li a {
  color: #fff;
  text-decoration: none;
  display: block;
  padding: 8px 0;
  transition: all 0.3s ease;
}
.nav-menu li a:hover,
.nav-menu li.active a {
  color: #007bff;
  background-color: #fff;
  border-radius: 4px;
}
</style>