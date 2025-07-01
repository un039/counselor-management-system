<template>
  <div class="login-page">
    <div class="login-box">
      <h2>登录到平台</h2>
      <p>请使用学生亲属相关的手机号登录</p>
      <div class="form-group">
        <label>手机号码：</label>
        <input v-model="phone" type="text" placeholder="请输入手机号码" />
      </div>
      <div class="form-group">
        <label>验证码：</label>
        <input v-model="code" type="text" placeholder="请输入验证码" />
        <button @click="getCode">获取验证码</button>
      </div>
      <div class="form-group">
        <input type="checkbox" v-model="agree" />
        <label>我同意绑定微信作为学校内部管理使用</label>
      </div>
      <button class="login-btn" @click="handleLogin">注册&登录</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '../stores/userInfo.ts';
import { ref } from 'vue';

const router = useRouter();
const userStore = useUserInfoStore();
const phone = ref('');
const code = ref('');
const agree = ref(false);

const getCode = () => {
  alert('验证码已发送（模拟）');
};

const handleLogin = () => {
  if (!phone.value || !code.value || !agree.value) {
    alert('请填写完整信息并同意协议');
    return;
  }
  userStore.loginSuccess('辅导员姓名');
  router.push('/pc-counselor');
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('../assets/new-login-bg.svg') no-repeat center/cover;
}
.login-box {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 320px;
}
.login-box h2 {
  margin-bottom: 20px;
  text-align: center;
  color: #007bff;
}
.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #333;
}
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.form-group button {
  margin-left: 10px;
  padding: 8px 12px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.login-btn {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
.login-btn:hover {
  background-color: #0056b3;
}
</style>