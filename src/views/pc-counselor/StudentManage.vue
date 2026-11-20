<template>
  <div class="student-manage">
    <div class="page-header">
      <h2>学生信息管理</h2>
      <el-button type="primary" @click="openAdd">新增学生</el-button>
    </div>

    <el-card shadow="never" class="filter-card">
      <el-select v-model="query.classId" placeholder="全部班级" clearable style="width: 180px">
        <el-option v-for="c in classes" :key="c.classId" :label="c.className" :value="c.classId" />
      </el-select>
      <el-input v-model="query.keyword" placeholder="姓名 / 学号 / 手机号" clearable style="width: 200px" />
      <el-select v-model="query.status" placeholder="全部状态" clearable style="width: 140px">
        <el-option label="在读" value="active" />
        <el-option label="休学" value="inactive" />
        <el-option label="毕业" value="graduated" />
      </el-select>
      <el-button type="primary" @click="load(1)">查询</el-button>
      <el-button @click="reset">重置</el-button>
      <span class="total-tip">共 {{ total }} 名学生</span>
    </el-card>

    <el-table :data="list" border stripe v-loading="loading" style="width: 100%">
      <el-table-column prop="stuId" label="学号" width="120" />
      <el-table-column prop="stuName" label="姓名" width="90" />
      <el-table-column prop="gender" label="性别" width="70" />
      <el-table-column prop="className" label="班级" width="140" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column label="宿舍" width="140">
        <template #default="{ row }">
          {{ row.dormBuild ? `${row.dormBuild}-${row.dormRoom}-${row.bedNo}床` : '未分配' }}
        </template>
      </el-table-column>
      <el-table-column label="学籍状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" size="small">{{ statusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button size="small" type="success" @click="openParents(row)">家长</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pager"
      background
      layout="total, prev, pager, next, sizes"
      :total="total"
      :current-page="query.page"
      :page-size="query.pageSize"
      :page-sizes="[10, 20, 50]"
      @current-change="(p: number) => { query.page = p; load(); }"
      @size-change="(s: number) => { query.pageSize = s; load(1); }"
    />

    <!-- 新增 / 编辑 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑学生' : '新增学生'" width="560px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="学号" required>
          <el-input v-model="form.stuId" :disabled="isEdit" placeholder="如 2022010101" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="form.stuName" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="班级" required>
          <el-select v-model="form.classId" style="width: 100%">
            <el-option v-for="c in classes" :key="c.classId" :label="c.className" :value="c.classId" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="宿舍">
          <div class="dorm-row">
            <el-input v-model="form.dormBuild" placeholder="楼栋" style="width: 90px" />
            <el-input v-model="form.dormRoom" placeholder="房间号" style="width: 90px" />
            <el-input-number v-model="form.bedNo" :min="1" :max="8" placeholder="床位" />
          </div>
        </el-form-item>
        <el-form-item label="学籍状态">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="在读" value="active" />
            <el-option label="休学" value="inactive" />
            <el-option label="毕业" value="graduated" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>

    <!-- 家长信息（一对多子表） -->
    <el-dialog v-model="parentVisible" title="家长 / 监护人信息" width="560px">
      <p class="parent-stu">学生：{{ currentStu?.stuName }}（{{ currentStu?.stuId }}）</p>
      <el-table :data="parents" border size="small">
        <el-table-column prop="parentName" label="姓名" width="120" />
        <el-table-column prop="phone" label="电话" width="140" />
        <el-table-column prop="relation" label="关系" width="90" />
        <el-table-column label="操作" width="90">
          <template #default="{ row }">
            <el-button size="small" type="danger" @click="removeParent(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="parent-form">
        <el-input v-model="parentForm.parentName" placeholder="姓名" style="width: 120px" />
        <el-input v-model="parentForm.phone" placeholder="电话" style="width: 140px" />
        <el-select v-model="parentForm.relation" style="width: 100px">
          <el-option label="父亲" value="父亲" />
          <el-option label="母亲" value="母亲" />
          <el-option label="其他" value="其他" />
        </el-select>
        <el-button type="primary" @click="addParentRow">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  getClasses, getStudents, addStudent, updateStudent, deleteStudent,
  getStudentDetail, addParent, deleteParent
} from '../../api';

const classes = ref<any[]>([]);
const list = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);

const query = reactive({ classId: '', keyword: '', status: '', page: 1, pageSize: 10 });

const dialogVisible = ref(false);
const isEdit = ref(false);
const emptyForm = () => ({
  stuId: '', stuName: '', gender: '男', classId: null as number | null,
  phone: '', dormBuild: '', dormRoom: '', bedNo: 1, status: 'active'
});
const form = reactive<any>(emptyForm());

const parentVisible = ref(false);
const currentStu = ref<any>(null);
const parents = ref<any[]>([]);
const parentForm = reactive({ parentName: '', phone: '', relation: '父亲' });

const statusText = (s: string) => ({ active: '在读', inactive: '休学', graduated: '毕业' }[s] || s);
const statusType = (s: string) => ({ active: 'success', inactive: 'warning', graduated: 'info' }[s] || 'info');

const load = async (page?: number) => {
  if (page) query.page = page;
  loading.value = true;
  try {
    const res: any = await getStudents({ ...query });
    list.value = res.data.list;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
};

const reset = () => {
  query.classId = '';
  query.keyword = '';
  query.status = '';
  load(1);
};

const openAdd = () => {
  isEdit.value = false;
  Object.assign(form, emptyForm());
  form.classId = classes.value[0]?.classId ?? null;
  dialogVisible.value = true;
};

const openEdit = (row: any) => {
  isEdit.value = true;
  Object.assign(form, {
    stuId: row.stuId, stuName: row.stuName, gender: row.gender, classId: row.classId,
    phone: row.phone, dormBuild: row.dormBuild, dormRoom: row.dormRoom,
    bedNo: row.bedNo, status: row.status
  });
  dialogVisible.value = true;
};

const submit = async () => {
  if (!form.stuId || !form.stuName || !form.classId) {
    ElMessage.warning('学号、姓名、班级为必填项');
    return;
  }
  if (isEdit.value) {
    await updateStudent(form.stuId, form);
    ElMessage.success('修改成功');
  } else {
    await addStudent(form);
    ElMessage.success('新增成功');
  }
  dialogVisible.value = false;
  load();
};

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定删除学生「${row.stuName}」吗？其家长信息与问卷作答记录将一并级联删除。`,
      '删除确认', { type: 'warning' }
    );
    await deleteStudent(row.stuId);
    ElMessage.success('已删除');
    load();
  } catch {
    // 取消
  }
};

const openParents = async (row: any) => {
  currentStu.value = row;
  const res: any = await getStudentDetail(row.stuId);
  parents.value = res.data.parents || [];
  parentVisible.value = true;
};

const addParentRow = async () => {
  if (!parentForm.parentName || !parentForm.phone) {
    ElMessage.warning('请填写家长姓名和电话');
    return;
  }
  await addParent(currentStu.value.stuId, { ...parentForm });
  const res: any = await getStudentDetail(currentStu.value.stuId);
  parents.value = res.data.parents || [];
  parentForm.parentName = '';
  parentForm.phone = '';
  ElMessage.success('已添加');
};

const removeParent = async (row: any) => {
  await deleteParent(row.parentId);
  const res: any = await getStudentDetail(currentStu.value.stuId);
  parents.value = res.data.parents || [];
  ElMessage.success('已删除');
};

onMounted(async () => {
  const res: any = await getClasses();
  classes.value = res.data || [];
  load();
});
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
.total-tip {
  margin-left: auto;
  color: #8a94a6;
  font-size: 13px;
}
.pager {
  margin-top: 14px;
  justify-content: flex-end;
}
.dorm-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.parent-stu {
  margin: 0 0 12px;
  color: #606266;
  font-size: 13px;
}
.parent-form {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}
</style>
