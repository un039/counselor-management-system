<template>
  <div class="holiday-notice-page">
    <h1>假期去向告知页面</h1>
    <el-form :model="holidayForm" :rules="formRules" ref="formRef" label-width="120px">
      <el-form-item label="假期名称" prop="holidayName">
        <el-input v-model="holidayForm.holidayName" placeholder="请输入假期名称" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker v-model="holidayForm.startTime" type="date" placeholder="选择开始时间" />
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker v-model="holidayForm.endTime" type="date" placeholder="选择结束时间" />
      </el-form-item>
      <el-form-item label="去向说明" prop="destination">
        <el-input v-model="holidayForm.destination" type="textarea" placeholder="请输入去向说明" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="holidayList" style="width: 100%">
      <el-table-column prop="holidayName" label="假期名称" />
      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="endTime" label="结束时间" />
      <el-table-column prop="destination" label="去向说明" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="deleteRecord(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref(null)
const holidayForm = reactive({
  id: '',
  holidayName: '',
  startTime: '',
  endTime: '',
  destination: ''
})

const holidayList = ref([])

const formRules = {
  holidayName: [
    { required: true, message: '请输入假期名称', trigger: 'blur' }
  ],
  startTime: [
    { required: true, message: '请选择开始时间', trigger: 'change' }
  ],
  endTime: [
    { required: true, message: '请选择结束时间', trigger: 'change' }
  ],
  destination: [
    { required: true, message: '请输入去向说明', trigger: 'blur' }
  ]
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      if (holidayForm.id) {
        // 更新记录
        const index = holidayList.value.findIndex(item => item.id === holidayForm.id)
        if (index !== -1) {
          holidayList.value[index] = { ...holidayForm }
          ElMessage.success('更新成功')
        }
      } else {
        // 新增记录
        const newRecord = { ...holidayForm, id: Date.now().toString() }
        holidayList.value.push(newRecord)
        ElMessage.success('提交成功')
      }
      resetForm()
    } else {
      ElMessage.error('请正确填写表单')
      return false
    }
  })
}

const resetForm = () => {
  holidayForm.id = ''
  holidayForm.holidayName = ''
  holidayForm.startTime = ''
  holidayForm.endTime = ''
  holidayForm.destination = ''
}

const deleteRecord = (id) => {
  holidayList.value = holidayList.value.filter(item => item.id !== id)
  ElMessage.success('删除成功')
}
</script>

<style scoped>
.holiday-notice-page {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.el-form {
  margin-bottom: 20px;
}
</style>