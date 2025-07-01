<template>
  <div class="questionnaire-manage-page">
    <div class="page-header">
      <h2>问卷模板管理</h2>
      <el-button type="primary" @click="showAddDialog">新建问卷模板</el-button>
    </div>

    <el-card class="search-card">
      <el-input v-model="searchKeyword" placeholder="请输入问卷标题搜索" style="width: 300px;" />
      <el-button type="primary" @click="searchTemplates">查询</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </el-card>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="问卷标题" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">{{ scope.row.status === 'active' ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="showEditDialog(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteTemplate(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="formData" :rules="formRules" ref="formRef">
        <el-form-item label="问卷标题" prop="title">
          <el-input v-model="formData.title" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTemplate">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

// 表格数据
const tableData = ref([
  { id: 1, title: '学生满意度调查', createTime: '2023-10-01', status: 'active' },
  { id: 2, title: '家校沟通情况问卷', createTime: '2023-10-15', status: 'active' },
  { id: 3, title: '教师教学质量评估', createTime: '2023-09-20', status: 'inactive' }
]);

// 搜索相关
const searchKeyword = ref('');

// 对话框相关
const dialogVisible = ref(false);
const dialogTitle = ref('新建问卷模板');
const formRef = ref(null);
const formData = reactive({
  id: '',
  title: '',
  status: 'active'
});

// 表单验证规则
const formRules = reactive({
  title: [{ required: true, message: '请输入问卷标题', trigger: 'blur' }]
});

// 搜索模板
const searchTemplates = () => {
  // 实际项目中这里会调用API
  ElMessage.success('搜索功能已触发');
};

// 重置搜索
const resetSearch = () => {
  searchKeyword.value = '';
};

// 显示新建对话框
const showAddDialog = () => {
  dialogTitle.value = '新建问卷模板';
  formData.id = '';
  formData.title = '';
  formData.status = 'active';
  dialogVisible.value = true;
};

// 显示编辑对话框
const showEditDialog = (row) => {
  dialogTitle.value = '编辑问卷模板';
  formData.id = row.id;
  formData.title = row.title;
  formData.status = row.status;
  dialogVisible.value = true;
};

// 保存模板
const saveTemplate = () => {
  // @ts-ignore
  formRef.value.validate((valid) => {
    if (valid) {
      if (formData.id) {
        // 编辑操作
        const index = tableData.value.findIndex(item => item.id === formData.id);
        tableData.value[index] = { ...formData, createTime: tableData.value[index].createTime };
        ElMessage.success('模板编辑成功');
      } else {
        // 新增操作
        const newId = Math.max(...tableData.value.map(item => item.id)) + 1;
        tableData.value.push({
          id: newId,
          title: formData.title,
          status: formData.status,
          createTime: new Date().toLocaleDateString()
        });
        ElMessage.success('模板创建成功');
      }
      dialogVisible.value = false;
    }
  });
};

// 删除模板
const deleteTemplate = (id) => {
  tableData.value = tableData.value.filter(item => item.id !== id);
  ElMessage.success('模板删除成功');
};
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.search-card {
  margin-bottom: 20px;
  padding: 15px;
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>