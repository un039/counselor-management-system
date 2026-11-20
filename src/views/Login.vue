<template>
  <div class="login-page">
    <div class="login-box">
      <h2>辅导员工作管理系统</h2>
      <p class="sub-title">高校学生信息与问卷调研平台</p>
      <div class="form-group">
        <label>工号</label>
        <input v-model="staffNo" type="text" placeholder="请输入工号，如 T1002" @keyup.enter="handleLogin" />
      </div>
      <div class="form-group">
        <label>密码</label>
        <input v-model="password" type="password" placeholder="请输入密码" @keyup.enter="handleLogin" />
      </div>
      <button class="login-btn" :disabled="loading" @click="handleLogin">
        {{ loading ? '登录中...' : '登 录' }}
      </button>
      <div class="demo-tip">
        <p>演示账号：</p>
        <p>管理员 T1001 / 123456</p>
        <p>辅导员 T1002 / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserInfoStore } from '../stores/userInfo';
import { login } from '../api';

const router = useRouter();
const userStore = useUserInfoStore();

const staffNo = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = async () => {
  if (!staffNo.value || !password.value) {
    ElMessage.warning('请输入工号和密码');
    return;
  }
  loading.value = true;
  try {
    const res: any = await login({ staffNo: staffNo.value, password: password.value });
    userStore.loginSuccess(res.data.token, res.data.user);
    ElMessage.success(`欢迎回来，${res.data.user.name}`);
    router.push('/pc-counselor');
  } catch {
    // 错误提示已由拦截器统一处理
  } finally {
    loading.value = false;
  }
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
  background-color: rgba(255, 255, 255, 0.95);
  padding: 34px 30px;
  border-radius: 10px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  width: 340px;
}
.login-box h2 {
  margin: 0 0 6px;
  text-align: center;
  color: #2f6fed;
  font-size: 20px;
}
.sub-title {
  text-align: center;
  color: #8a94a6;
  font-size: 12px;
  margin-bottom: 22px;
}
.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #333;
  font-size: 13px;
}
.form-group input {
  width: 100%;
  padding: 9px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  box-sizing: border-box;
  outline: none;
}
.form-group input:focus {
  border-color: #2f6fed;
}
.login-btn {
  width: 100%;
  padding: 10px;
  background-color: #2f6fed;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  margin-top: 6px;
}
.login-btn:disabled {
  background-color: #9db8f5;
  cursor: not-allowed;
}
.login-btn:hover:not(:disabled) {
  background-color: #1f5bd9;
}
.demo-tip {
  margin-top: 18px;
  padding-top: 12px;
  border-top: 1px dashed #e5e8ef;
  font-size: 12px;
  color: #8a94a6;
  line-height: 1.8;
}
.demo-tip p {
  margin: 0;
}
</style>
