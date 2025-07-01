<template>
  <div class="custom-send-page">
    <h2>自定义发送</h2>
    <button class="write-letter-btn" @click="showWriteDialog = true">+ 写信件</button>
    <div class="search-bar">
      <el-input v-model="searchParams.timeRange" placeholder="请选择发送时间范围" />
      <el-input v-model="searchParams.titleKeyword" placeholder="请输入信件标题关键词查询" />
      <button class="search-btn" @click="handleSearch">查询</button>
      <button class="reset-btn" @click="handleReset">重置</button>
    </div>
    <table class="letter-table">
      <thead>
      <tr>
        <th>序号</th>
        <th>信件标题</th>
        <th>信件ID</th>
        <th>是否关联问卷</th>
        <th>问卷模板名称</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in tableData" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ item.title }}</td>
        <td>{{ item.id }}</td>
        <td>{{ item.related ? '是' : '否' }}</td>
        <td>{{ item.templateName || '-' }}</td>
        <td>
          <el-button type="danger" size="small" @click="handleDelete(item.id)">删除</el-button>
        </td>
      </tr>
      </tbody>
    </table>

    <el-dialog v-model="showWriteDialog" title="写信件">
      <el-form :model="newLetterForm" :rules="letterRules" ref="letterFormRef">
        <el-form-item label="信件标题" prop="title">
          <el-input v-model="newLetterForm.title" />
        </el-form-item>
        <el-form-item label="是否关联问卷" prop="related">
          <el-switch v-model="newLetterForm.related" />
        </el-form-item>
        <el-form-item v-if="newLetterForm.related" label="问卷模板名称" prop="templateName">
          <el-input v-model="newLetterForm.templateName" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showWriteDialog = false">取消</el-button>
          <el-button type="primary" @click="submitNewLetter">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';

const tableData = ref([
  { title: '您对学校的教学质量满意吗', id: '202405291431', related: true, templateName: '您对学校的教学质量满意吗' },
  { title: '您觉得学校的师资力量是否足够强大？', id: '202405291431', related: false },
  { title: '您觉得学校的课外活动和实践教育是否充足？', id: '202405291431', related: true, templateName: '您觉得学校的课外活动和实践教育是否充足？' },
  { title: '您对辅导员工作满意吗？', id: '202405291431', related: false }
]);

const searchParams = reactive({
  timeRange: '',
  titleKeyword: ''
});

const showWriteDialog = ref(false);
const newLetterForm = reactive({
  title: '',
  related: false,
  templateName: ''
});

const letterFormRef = ref(null);
const letterRules = {
  title: [
    { required: true, message: '请输入信件标题', trigger: 'blur' }
  ],
  templateName: [
    { required: true, message: '请输入问卷模板名称', trigger: 'blur' }
  ]
};

const handleSearch = () => {
  // 此处可添加实际搜索逻辑
  ElMessage.success('搜索功能待完善，当前参数：' + JSON.stringify(searchParams));
};

const handleReset = () => {
  searchParams.timeRange = '';
  searchParams.titleKeyword = '';
  ElMessage.success('搜索条件已重置');
};

const submitNewLetter = async () => {
  if (!letterFormRef.value) return;
  await letterFormRef.value.validate((valid) => {
    if (valid) {
      const newId = Date.now().toString();
      tableData.value.push({
        ...newLetterForm,
        id: newId
      });
      showWriteDialog.value = false;
      newLetterForm.title = '';
      newLetterForm.related = false;
      newLetterForm.templateName = '';
      ElMessage.success('信件创建成功');
    } else {
      ElMessage.error('请正确填写表单');
      return false;
    }
  });
};

const handleDelete = (id) => {
  tableData.value = tableData.value.filter(item => item.id !== id);
  ElMessage.success('删除成功');
};
</script>

<style scoped>
.custom-send-page {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
h2 {
  margin-bottom: 20px;
  color: #333;
}
.write-letter-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.search-bar input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.search-btn, .reset-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.search-btn {
  background-color: #007bff;
  color: #fff;
}
.reset-btn {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}
.letter-table {
  width: 100%;
  border-collapse: collapse;
}
.letter-table th, .letter-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}
</style>