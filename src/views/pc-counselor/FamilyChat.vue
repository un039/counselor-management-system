<template>
  <div class="family-chat">
    <h2 class="page-title">亲属对话管理</h2>

    <div class="chat-layout">
      <div class="contact-panel">
        <div class="panel-title">家长联系人（{{ contacts.length }}）</div>
        <el-input v-model="searchKey" placeholder="搜索家长 / 学生" size="small" clearable class="search" />
        <div class="contact-list">
          <div
            v-for="c in filteredContacts"
            :key="c.parentId"
            class="contact-item"
            :class="{ active: current?.parentId === c.parentId }"
            @click="selectContact(c)"
          >
            <div class="avatar">{{ c.parentName.slice(0, 1) }}</div>
            <div class="info">
              <div class="name">{{ c.parentName }} <span class="relation">{{ c.relation }}</span></div>
              <div class="sub">{{ c.stuName }} · {{ c.className }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-panel">
        <template v-if="current">
          <div class="chat-header">
            {{ current.parentName }}（{{ current.stuName }}家长）
            <span class="phone">{{ current.phone }}</span>
          </div>
          <div class="message-list" ref="listRef">
            <div v-if="!messages.length" class="empty">暂无消息，发送第一条消息开始沟通</div>
            <div
              v-for="(m, i) in messages"
              :key="i"
              class="msg"
              :class="m.self ? 'self' : 'other'"
            >
              <div class="bubble">{{ m.text }}</div>
              <div class="time">{{ m.time }}</div>
            </div>
          </div>
          <div class="input-bar">
            <el-input
              v-model="newMessage"
              placeholder="输入消息，回车发送"
              @keyup.enter="sendMessage"
            />
            <el-button type="primary" @click="sendMessage">发送</el-button>
          </div>
        </template>
        <div v-else class="empty-panel">请选择左侧家长联系人开始对话</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import request from '../../utils/request';

interface Contact {
  parentId: number;
  parentName: string;
  phone: string;
  relation: string;
  stuId: string;
  stuName: string;
  className: string;
}

const contacts = ref<Contact[]>([]);
const current = ref<Contact | null>(null);
const searchKey = ref('');
const newMessage = ref('');
const messages = ref<{ text: string; time: string; self: boolean }[]>([]);
const listRef = ref<HTMLDivElement>();

const filteredContacts = computed(() => {
  if (!searchKey.value) return contacts.value;
  const k = searchKey.value.toLowerCase();
  return contacts.value.filter(
    c => c.parentName.includes(k) || c.stuName.includes(k) || c.className.includes(k)
  );
});

const storageKey = (id: number) => `chat_history_${id}`;

const selectContact = (c: Contact) => {
  current.value = c;
  try {
    messages.value = JSON.parse(localStorage.getItem(storageKey(c.parentId)) || '[]');
  } catch {
    messages.value = [];
  }
  scrollToBottom();
};

const scrollToBottom = async () => {
  await nextTick();
  if (listRef.value) listRef.value.scrollTop = listRef.value.scrollHeight;
};

const sendMessage = () => {
  if (!newMessage.value.trim() || !current.value) return;
  messages.value.push({
    text: newMessage.value.trim(),
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    self: true
  });
  localStorage.setItem(storageKey(current.value.parentId), JSON.stringify(messages.value));
  newMessage.value = '';
  scrollToBottom();
};

onMounted(async () => {
  const res: any = await request.get('/parents');
  contacts.value = res.data;
  if (contacts.value.length) selectContact(contacts.value[0]);
});
</script>

<style scoped>
.page-title {
  margin: 0 0 16px;
  font-size: 18px;
  color: #1f2d3d;
}
.chat-layout {
  display: flex;
  gap: 14px;
  height: calc(100vh - 160px);
}
.contact-panel {
  width: 260px;
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}
.panel-title {
  font-size: 13px;
  color: #8a94a6;
  margin-bottom: 8px;
}
.search {
  margin-bottom: 8px;
}
.contact-list {
  overflow-y: auto;
  flex: 1;
}
.contact-item {
  display: flex;
  gap: 10px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  align-items: center;
}
.contact-item:hover {
  background: #f4f7fd;
}
.contact-item.active {
  background: #e8f0ff;
}
.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #2f6fed;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}
.info .name {
  font-size: 13px;
  color: #303133;
}
.info .relation {
  font-size: 11px;
  color: #8a94a6;
  margin-left: 4px;
}
.info .sub {
  font-size: 11px;
  color: #a8b0c0;
}
.chat-panel {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.chat-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f5;
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}
.chat-header .phone {
  font-weight: 400;
  color: #8a94a6;
  font-size: 12px;
  margin-left: 10px;
}
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f7f9fc;
}
.empty {
  color: #b4bccc;
  font-size: 12px;
  text-align: center;
  margin-top: 30px;
}
.msg {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
.msg.self {
  align-items: flex-end;
}
.msg.other {
  align-items: flex-start;
}
.bubble {
  max-width: 60%;
  padding: 8px 12px;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  color: #303133;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.msg.self .bubble {
  background: #2f6fed;
  color: #fff;
}
.time {
  font-size: 11px;
  color: #b4bccc;
  margin-top: 4px;
}
.input-bar {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #f0f2f5;
}
.empty-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b4bccc;
  font-size: 13px;
}
</style>
