<template>
  <div class="holiday-page">
    <h2 class="page-title">假期去向告知</h2>

    <el-card shadow="never" class="form-card">
      <el-form :model="form" label-width="110px" class="holiday-form">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="学生" required>
              <el-select v-model="form.stuId" filterable placeholder="搜索学号/姓名" style="width: 100%">
                <el-option
                  v-for="s in students"
                  :key="s.stuId"
                  :label="`${s.stuName}（${s.stuId}）`"
                  :value="s.stuId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="假期名称" required>
              <el-select v-model="form.holidayName" style="width: 100%">
                <el-option label="2026年寒假" value="2026年寒假" />
                <el-option label="2026年暑假" value="2026年暑假" />
                <el-option label="国庆假期" value="国庆假期" />
                <el-option label="五一假期" value="五一假期" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="去向说明">
              <el-input v-model="form.destination" placeholder="如：回家（成都）" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="开始日期" required>
              <el-date-picker v-model="form.startDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束日期" required>
              <el-date-picker v-model="form.endDate" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label=" ">
              <el-button type="primary" @click="submit">提交申报</el-button>
              <el-button @click="showUnreported">查看未申报名单</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <div class="list-header">
      <span>申报记录</span>
      <span class="tip">共 {{ list.length }} 条 · 已通过 {{ approvedCount }} 条</span>
    </div>

    <el-table :data="list" border stripe v-loading="loading" style="width: 100%">
      <el-table-column prop="stuId" label="学号" width="130" />
      <el-table-column prop="stuName" label="姓名" width="100" />
      <el-table-column prop="className" label="班级" width="150" />
      <el-table-column prop="holidayName" label="假期名称" width="120" />
      <el-table-column prop="startDate" label="开始日期" width="120" />
      <el-table-column prop="endDate" label="结束日期" width="120" />
      <el-table-column prop="destination" label="去向说明" min-width="150" />
      <el-table-column label="审核状态" width="110">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.status !== 'approved'" size="small" type="success" @click="audit(row, 'approved')">通过</el-button>
          <el-button v-if="row.status !== 'rejected'" size="small" type="warning" @click="audit(row, 'rejected')">驳回</el-button>
          <el-button size="small" type="danger" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="unreportedVisible" title="2026年寒假未申报名单" width="620px">
      <el-table :data="unreported" border size="small" max-height="420">
        <el-table-column prop="stuId" label="学号" width="140" />
        <el-table-column prop="stuName" label="姓名" width="110" />
        <el-table-column prop="className" label="班级" />
        <el-table-column prop="phone" label="联系电话" width="140" />
      </el-table>
      <template #footer>
        <span class="tip">共 {{ unreported.length }} 人未申报</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  getHolidays, addHoliday, updateHolidayStatus, deleteHoliday,
  getUnreported, getStudents
} from '../../api';

const list = ref<any[]>([]);
const students = ref<any[]>([]);
const unreported = ref<any[]>([]);
const unreportedVisible = ref(false);
const loading = ref(false);

const form = reactive({
  stuId: '',
  holidayName: '2026年寒假',
  startDate: '2026-01-15',
  endDate: '2026-02-20',
  destination: ''
});

const approvedCount = computed(() => list.value.filter(r => r.status === 'approved').length);

const statusText = (s: string) =>
    ({ pending: '待审核', approved: '已通过', rejected: '已驳回' }[s] || s);
const statusType = (s: string) =>
    ({ pending: 'warning', approved: 'success', rejected: 'danger' }[s] || 'info');

const load = async () => {
  loading.value = true;
  try {
    const res: any = await getHolidays();
    list.value = res.data;
  } finally {
    loading.value = false;
  }
};

const loadStudents = async () => {
  const res: any = await getStudents({ page: 1, pageSize: 500, status: 'active' });
  students.value = res.data.list;
};

const submit = async () => {
  if (!form.stuId || !form.holidayName || !form.startDate || !form.endDate) {
    ElMessage.warning('请填写学生、假期名称与起止日期');
    return;
  }
  if (new Date(form.endDate) < new Date(form.startDate)) {
    ElMessage.warning('结束日期不能早于开始日期');
    return;
  }
  try {
    await addHoliday({ ...form });
    ElMessage.success('申报成功');
    form.stuId = '';
    form.destination = '';
    load();
  } catch {
    // 拦截器已提示
  }
};

const audit = async (row: any, status: string) => {
  await updateHolidayStatus(row.reportId, status);
  ElMessage.success('审核完成');
  load();
};

const remove = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定删除该条申报记录吗？`, '删除确认', { type: 'warning' });
    await deleteHoliday(row.reportId);
    ElMessage.success('已删除');
    load();
  } catch {
    // 取消
  }
};

const showUnreported = async () => {
  const res: any = await getUnreported('2026年寒假');
  unreported.value = res.data;
  unreportedVisible.value = true;
};

onMounted(async () => {
  await Promise.all([load(), loadStudents()]);
});
</script>

<style scoped>
.page-title {
  margin: 0 0 16px;
  font-size: 18px;
  color: #1f2d3d;
}
.form-card {
  margin-bottom: 16px;
  border-radius: 8px;
}
.holiday-form :deep(.el-form-item) {
  margin-bottom: 12px;
}
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-weight: 600;
  color: #303133;
}
.tip {
  font-size: 12px;
  color: #8a94a6;
  font-weight: 400;
}
</style>
