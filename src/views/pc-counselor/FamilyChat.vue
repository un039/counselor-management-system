<script setup lang="ts">
import { ref } from 'vue'
const chatMessages = ref([])
const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value.trim()) {
    chatMessages.value.push(newMessage.value)
    newMessage.value = ''
  }
}
</script>

<template>
  <div class="family-chat">
    <h2>家校聊天</h2>
    <div class="message-list">
      <div v-for="(msg, index) in chatMessages" :key="index">{{ msg }}</div>
    </div>
    <el-input v-model="newMessage" placeholder="输入消息" @keyup.enter="sendMessage" />
    <el-button @click="sendMessage">发送</el-button>
  </div>
</template>

<style scoped>
.family-chat {
  max-width: 600px;
  margin: 0 auto;
  background-image: url('@/assets/family-chat-bg.svg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  padding: 20px;
}
.message-list {
  height: 300px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 10px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.8);
}
</style>