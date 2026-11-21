<template>
  <div class="login-page">
    <div class="login-shell">
      <section class="brand-panel">
        <div class="brand-top">
          <div class="brand-logo">辅</div>
          <span>WUT · 家校沟通</span>
        </div>

        <div class="brand-body">
          <h1>辅导员<br />工作管理系统</h1>
          <p class="brand-desc">学生信息、问卷调研、假期申报与家校沟通，在一个工作台完成。</p>
          <ul class="brand-points">
            <li><el-icon><CircleCheck /></el-icon>学生档案与家长信息统一管理</li>
            <li><el-icon><CircleCheck /></el-icon>问卷发布、回收与数据统计</li>
            <li><el-icon><CircleCheck /></el-icon>假期去向与亲属沟通持续跟进</li>
          </ul>
        </div>

        <p class="brand-foot">© 2026 WUT Counselor Workbench</p>
      </section>

      <section class="form-panel">
        <div class="form-inner">
          <div class="mobile-brand">
            <div class="mobile-logo">辅</div>
            <div>
              <p class="mobile-title">辅导员工作管理系统</p>
              <p class="mobile-sub">WUT 家校沟通管理系统</p>
            </div>
          </div>

          <h2>欢迎登录</h2>
          <p class="sub-title">使用工号与密码进入工作台</p>

          <div class="form-group">
            <label>工号</label>
            <el-input
              v-model="staffNo"
              size="large"
              placeholder="请输入工号，如 T1002"
              :prefix-icon="User"
              @keyup.enter="handleLogin"
            />
          </div>

          <div class="form-group">
            <label>密码</label>
            <el-input
              v-model="password"
              size="large"
              type="password"
              show-password
              placeholder="请输入密码"
              :prefix-icon="Lock"
              @keyup.enter="handleLogin"
            />
          </div>

          <button class="login-btn" type="button" :disabled="loading" @click="handleLogin">
            {{ loading ? '登录中...' : '登 录' }}
          </button>

          <div class="demo-tip">
            <p class="demo-title">演示账号</p>
            <div class="demo-row"><span>管理员</span><code>T1001 / 123456</code></div>
            <div class="demo-row"><span>辅导员</span><code>T1002 / 123456</code></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { CircleCheck, Lock, User } from '@element-plus/icons-vue';
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
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  box-sizing: border-box;
  background:
    radial-gradient(900px 500px at 6% 8%, #e2ebff 0%, transparent 62%),
    radial-gradient(720px 460px at 94% 92%, #e7efff 0%, transparent 64%),
    var(--app-bg);
}

.login-shell {
  display: flex;
  width: min(980px, 100%);
  min-height: 560px;
  overflow: hidden;
  border-radius: 24px;
  background: var(--app-surface);
  box-shadow: 0 24px 64px rgba(16, 24, 40, 0.12);
}

/* 左侧品牌区 */
.brand-panel {
  position: relative;
  overflow: hidden;
  width: 46%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #fff;
  background: linear-gradient(150deg, #1d3a75 0%, #2f6fed 62%, #4f8bff 100%);
}

.brand-panel::after {
  content: '';
  position: absolute;
  top: -110px;
  right: -100px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.brand-panel::before {
  content: '';
  position: absolute;
  bottom: -140px;
  left: -80px;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.brand-top {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.82);
}

.brand-logo {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  font-size: 17px;
  font-weight: 700;
  color: #2457c9;
  background: #fff;
}

.brand-body {
  position: relative;
}

.brand-body h1 {
  margin: 0 0 16px;
  font-size: 34px;
  line-height: 1.35;
  font-weight: 600;
  letter-spacing: 1px;
  color: #fff;
}

.brand-desc {
  margin: 0 0 26px;
  max-width: 300px;
  font-size: 13px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.76);
}

.brand-points {
  list-style: none;
  margin: 0;
  padding: 0;
}

.brand-points li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.86);
}

.brand-points .el-icon {
  font-size: 15px;
  color: #bcd4ff;
}

.brand-foot {
  position: relative;
  margin: 0;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
}

/* 右侧表单区 */
.form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.form-inner {
  width: 100%;
  max-width: 340px;
}

.mobile-brand {
  display: none;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.mobile-logo {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #2f6fed 0%, #4f8bff 100%);
}

.mobile-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--app-text);
}

.mobile-sub {
  margin: 2px 0 0;
  font-size: 11px;
  color: var(--app-text-muted);
}

.form-inner h2 {
  margin: 0 0 6px;
  font-size: 22px;
}

.sub-title {
  margin: 0 0 28px;
  font-size: 13px;
  color: var(--app-text-muted);
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--app-text-regular);
}

.form-group :deep(.el-input__wrapper) {
  padding: 2px 12px;
  border-radius: 10px;
  background: #fafbfe;
  box-shadow: 0 0 0 1px var(--app-border) inset;
}

.form-group :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c9d4e6 inset;
}

.form-group :deep(.el-input__wrapper.is-focus) {
  background: #fff;
  box-shadow: 0 0 0 1px var(--brand-500) inset;
}

.login-btn {
  width: 100%;
  height: 44px;
  margin-top: 6px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #2f6fed 0%, #4f8bff 100%);
  box-shadow: 0 8px 20px rgba(47, 111, 237, 0.28);
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(47, 111, 237, 0.34);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.demo-tip {
  margin-top: 24px;
  padding: 14px 16px;
  border: 1px solid var(--app-border-light);
  border-radius: 12px;
  background: #f8fafd;
  font-size: 12px;
  color: var(--app-text-secondary);
}

.demo-title {
  margin: 0 0 8px;
  font-weight: 600;
  color: var(--app-text-regular);
}

.demo-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
}

.demo-row code {
  padding: 2px 8px;
  border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 11px;
  color: var(--brand-600);
  background: var(--brand-50);
}

@media (max-width: 860px) {
  .brand-panel {
    display: none;
  }

  .mobile-brand {
    display: flex;
  }

  .login-shell {
    min-height: auto;
    max-width: 420px;
  }

  .form-panel {
    padding: 36px 28px;
  }
}
</style>
