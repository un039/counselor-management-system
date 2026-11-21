<template>
  <div class="layout-container">
    <CommonAside />
    <div class="right-content">
      <CommonHeader />
      <main class="main-content">
        <router-view />
      </main>
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
  overflow: hidden;
  background-color: var(--app-bg);
  color: var(--app-text);
}

.right-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: var(--app-bg);
}
</style>
