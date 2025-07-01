<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { request } from '../../utils/request'

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    ElMessage.error('两次输入的新密码不一致')
    return
  }

  try {
    const res = await request.post('/api/user/reset-password', {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    })
    if (res.status === 200) {
      ElMessage.success('密码重置成功')
      oldPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    }
  } catch (error) {
    ElMessage.error('密码重置失败，请重试')
  }
}
</script>

<template>
  <el-card>
    <h1>重置密码</h1>
    <el-form label-width="120px">
      <el-form-item label="旧密码">
        <el-input v-model="oldPassword" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="newPassword" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="confirmPassword" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="resetPassword">确认重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped lang="scss">
.el-card {
  max-width: 500px;
  margin: 20px auto;
}
</style>