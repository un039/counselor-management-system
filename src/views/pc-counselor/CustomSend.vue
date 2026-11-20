<template>
  <div class="custom-send">
    <div class="page-header">
      <h2>自定义发送</h2>
      <el-button type="primary" @click="openWrite">写 信 件</el-button>
    </div>

    <el-card shadow="never" class="filter-card">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
        style="width: 260px"
      />
      <el-input v-model="keyword" placeholder="请输入信件标题关键词" clearable style="width: 220px" />
      <el-button type="primary" @click="load">查询</el-button>
      <el-button @click="reset">重置</el-button>
    </el-card>

    <el-table :data="list" border stripe v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column prop="title" label="信件标题" min-width="220" />
      <el-table-column prop="letterId" label="信件ID" width="100" />
      <el-table-column label="是否关联问卷" width="130">
        <template #default="{ row }">
          <el-tag :type="row.qnaireId ? 'success' : 'info'" size="small">
            {{ row.qnaireId ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="qnaireTitle" label="关联问卷" min-width="160">
        <template #default="{ row }">{{ row.qnaireTitle || '-' }}</template>
      </el-table-column>
      <el-table-column prop="senderName" label="发送人" width="100" />
      <el-table-column prop="sendTime" label="发送时间" width="170" />
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="viewLetter(row)">查看</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 写信 -->
    <el-dialog v-model="writeVisible" title="写信件" width="580px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="信件标题" required>
          <el-input v-model="form.title" placeholder="请输入信件标题" />
        </el-form-item>
        <el-form-item label="关联问卷">
          <el-switch v-model="form.related" />
        </el-form-item>
        <el-form-item v-if="form.related" label="选择问卷">
          <el-select v-model="form.qnaireId" placeholder="请选择要关联的问卷模板" style="width: 100%">
            <el-option
              v-for="q in qnaires"
              :key="q.qnaireId"
              :label="`${q.title}（${q.status === 'active' ? '启用' : '停用'}）`"
              :value="q.qnaireId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="信件正文">
          <el-input v-model="form.content" type="textarea" :rows="5" placeholder="请输入信件内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="writeVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">发送</el-button>
      </template>
    </el-dialog>

    <!-- 查看 -->
    <el-dialog v-model="detailVisible" title="信件详情" width="600px">
      <h3 class="letter-title">{{ detail.title }}</h3>
      <p class="letter-meta">{{ detail.sendTime }} · 发送人 {{ detail.senderName }}</p>
      <p class="letter-content">{{ detail.content || '（无正文）' }}</p>
      <p v-if="detail.qnaireTitle" class="letter-q">关联问卷：{{ detail.qnaireTitle }}</p>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getLetters, addLetter, deleteLetter, getQnaires } from '../../api';

const list = ref<any[]>([]);
const qnaires = ref<any[]>([]);
const loading = ref(false);
const keyword = ref('');
const dateRange = ref<string[]>([]);

const writeVisible = ref(false);
const detailVisible = ref(false);
const detail = ref<any>({});
const form = reactive({ title: '', content: '', related: false, qnaireId: null as number | null });

const load = async () => {
  loading.value = true;
  try {
    const res: any = await getLetters({
      keyword: keyword.value,
      start: dateRange.value?.[0] || '',
      end: dateRange.value?.[1] || ''
    });
    list.value = res.data;
  } finally {
    loading.value = false;
  }
};

const reset = () => {
  keyword.value = '';
  dateRange.value = [];
  load();
};

const openWrite = async () => {
  Object.assign(form, { title: '', content: '', related: false, qnaireId: null });
  const res: any = await getQnaires();
  qnaires.value = res.data;
  writeVisible.value = true;
};

const submit = async () => {
  if (!form.title) {
    ElMessage.warning('信件标题不能为空');
    return;
  }
  if (form.related && !form.qnaireId) {
    ElMessage.warning('请选择要关联的问卷');
    return;
  }
  await addLetter({
    title: form.title,
    content: form.content,
    qnaireId: form.related ? form.qnaireId : null
  });
  ElMessage.success('信件发送成功');
  writeVisible.value = false;
  load();
};

const viewLetter = (row: any) => {
  detail.value = row;
  detailVisible.value = true;
};

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定删除信件「${row.title}」吗？`, '删除确认', { type: 'warning' });
    await deleteLetter(row.letterId);
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
  flex-wrap: wrap;
}
.letter-title {
  margin: 0 0 6px;
  color: #1f2d3d;
}
.letter-meta {
  color: #8a94a6;
  font-size: 12px;
  margin: 0 0 16px;
}
.letter-content {
  line-height: 1.9;
  color: #303133;
  white-space: pre-wrap;
}
.letter-q {
  margin-top: 16px;
  color: #2f6fed;
  font-size: 13px;
}
</style>
