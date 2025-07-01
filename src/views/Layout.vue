<template>
  <div class="layout-container">
    <CommonAside />
    <div class="right-content">
      <CommonHeader />
      <div class="main-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CommonAside from '../components/CommonAside.vue';
import CommonHeader from '../components/CommonHeader.vue';
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  background-color: #fff;
  color: #333;
}
.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f8f9fa;
}
</style>