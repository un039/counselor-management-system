<script setup lang="ts">
import { useUserInfoStore } from './stores/userInfo'
import { onMounted } from 'vue'

const userInfoStore = useUserInfoStore()

// 删除不存在的getUserInfo调用
// onMounted(() => {
//   userInfoStore.getUserInfo()
// })
</script>

<template>
  <!-- 移除未定义的loading状态判断 -->
  <router-view />
  <!-- <div v-else class="loading">加载中...</div> -->
</template>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
