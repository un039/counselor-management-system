<template>
  <div class="qnaire-manage">
    <div class="page-header">
      <h2>问卷模板管理</h2>
      <el-button type="primary" @click="openCreate">新建问卷模板</el-button>
    </div>

    <el-card shadow="never" class="filter-card">
      <el-input v-model="keyword" placeholder="请输入问卷标题搜索" clearable style="width: 260px" />
      <el-button type="primary" @click="load">查询</el-button>
      <el-button @click="reset">重置</el-button>
    </el-card>

    <el-table :data="list" border stripe v-loading="loading" style="width: 100%">
      <el-table-column prop="qnaireId" label="ID" width="70" />
      <el-table-column prop="title" label="问卷标题" min-width="200" />
      <el-table-column prop="description" label="问卷说明" min-width="200" show-overflow-tooltip />
      <el-table-column prop="questionCount" label="题目数" width="90" align="center" />
      <el-table-column prop="submittedCount" label="已提交" width="90" align="center" />
      <el-table-column prop="creatorName" label="创建人" width="100" />
      <el-table-column prop="createTime" label="创建时间" width="170" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
            {{ row.status === 'active' ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button size="small" :type="row.status === 'active' ? 'warning' : 'success'" @click="toggleStatus(row)">
            {{ row.status === 'active' ? '停用' : '启用' }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新建 / 编辑 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑问卷' : '新建问卷模板'" width="720px" top="6vh">
      <el-form :model="form" label-width="90px">
        <el-form-item label="问卷标题" required>
          <el-input v-model="form.title" placeholder="如：学生满意度调查" />
        </el-form-item>
        <el-form-item label="问卷说明">
          <el-input v-model="form.description" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div class="question-header">
        <span>题目列表</span>
        <el-button size="small" type="primary" plain @click="addQuestion">+ 添加题目</el-button>
      </div>

      <div v-for="(q, idx) in form.questions" :key="idx" class="question-item">
        <div class="q-title">第 {{ idx + 1 }} 题</div>
        <el-input v-model="q.content" placeholder="请输入题干" style="margin-bottom: 8px" />
        <div class="q-row">
          <el-select v-model="q.qtype" style="width: 130px">
            <el-option label="单选" value="single" />
            <el-option label="多选" value="multi" />
            <el-option label="文本" value="text" />
          </el-select>
          <el-input
            v-model="q.options"
            :disabled="q.qtype === 'text'"
            placeholder="选项，用英文逗号分隔，如：非常满意,满意,一般,不满意"
          />
          <el-button type="danger" size="small" @click="form.questions.splice(idx, 1)">删除</el-button>
        </div>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  getQnaires, getQnaireDetail, addQnaire, updateQnaire,
  saveQuestions, deleteQnaire
} from '../../api';

const list = ref<any[]>([]);
const loading = ref(false);
const keyword = ref('');

const dialogVisible = ref(false);
const isEdit = ref(false);
const currentId = ref<number | null>(null);

const form = reactive<any>({
  title: '',
  description: '',
  status: 'active',
  questions: [] as any[]
});

const load = async () => {
  loading.value = true;
  try {
    const res: any = await getQnaires({ keyword: keyword.value });
    list.value = res.data;
  } finally {
    loading.value = false;
  }
};

const reset = () => {
  keyword.value = '';
  load();
};

const resetForm = () => {
  form.title = '';
  form.description = '';
  form.status = 'active';
  form.questions = [];
  currentId.value = null;
};

const openCreate = () => {
  isEdit.value = false;
  resetForm();
  addQuestion();
  dialogVisible.value = true;
};

const openEdit = async (row: any) => {
  isEdit.value = true;
  currentId.value = row.qnaireId;
  const res: any = await getQnaireDetail(row.qnaireId);
  form.title = res.data.title;
  form.description = res.data.description;
  form.status = res.data.status;
  form.questions = res.data.questions.map((q: any) => ({
    content: q.content,
    qtype: q.qtype,
    options: q.options || ''
  }));
  dialogVisible.value = true;
};

const addQuestion = () => {
  form.questions.push({ content: '', qtype: 'single', options: '' });
};

const submit = async () => {
  if (!form.title) {
    ElMessage.warning('问卷标题不能为空');
    return;
  }
  if (form.questions.some((q: any) => !q.content)) {
    ElMessage.warning('题目题干不能为空');
    return;
  }

  if (isEdit.value && currentId.value) {
    await updateQnaire(currentId.value, {
      title: form.title, description: form.description, status: form.status
    });
    await saveQuestions(currentId.value, form.questions);
    ElMessage.success('问卷已更新');
  } else {
    await addQnaire({
      title: form.title,
      description: form.description,
      status: form.status,
      questions: form.questions
    });
    ElMessage.success('问卷已创建');
  }
  dialogVisible.value = false;
  load();
};

const toggleStatus = async (row: any) => {
  await updateQnaire(row.qnaireId, {
    title: row.title,
    description: row.description,
    status: row.status === 'active' ? 'inactive' : 'active'
  });
  ElMessage.success('状态已更新');
  load();
};

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定删除问卷「${row.title}」吗？其题目与已有的 ${row.submittedCount} 条作答记录将一并删除。`,
      '删除确认', { type: 'warning' }
    );
    await deleteQnaire(row.qnaireId);
    ElMessage.success('已删除');
    load();
  } catch {
    // 取消
  }
};

onMounted(load);
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.page-header h2 {
  margin: 0;
  font-size: 18px;
  color: #1f2d3d;
}
.filter-card {
  margin-bottom: 14px;
  border-radius: 8px;
}
.filter-card :deep(.el-card__body) {
  display: flex;
  gap: 10px;
  align-items: center;
}
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 6px 0 10px;
  font-weight: 600;
  color: #303133;
}
.question-item {
  background: #f7f9fc;
  border: 1px solid #e8eef8;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
}
.q-title {
  font-size: 13px;
  color: #2f6fed;
  margin-bottom: 8px;
}
.q-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
