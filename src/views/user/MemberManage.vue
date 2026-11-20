<template>
  <div class="member-manage">
    <div class="page-header">
      <h2>成员管理</h2>
      <el-button type="primary" :disabled="!isAdmin" @click="openAdd">
        新增成员
      </el-button>
    </div>

    <el-alert
      v-if="!isAdmin"
      type="warning"
      :closable="false"
      show-icon
      title="当前账号为辅导员角色，仅可查看成员列表，新增与编辑需管理员权限"
      class="role-tip"
    />

    <el-card shadow="never" class="filter-card">
      <el-select v-model="query.status" placeholder="人员状态" clearable style="width: 150px">
        <el-option label="在职" value="active" />
        <el-option label="离职" value="inactive" />
      </el-select>
      <el-input v-model="query.keyword" placeholder="姓名 / 工号" clearable style="width: 200px" />
      <el-select v-model="query.role" placeholder="系统角色" clearable style="width: 160px">
        <el-option label="系统管理员" value="admin" />
        <el-option label="辅导员" value="counselor" />
      </el-select>
      <el-button type="primary" @click="load">查询</el-button>
      <el-button @click="reset">重置</el-button>
    </el-card>

    <el-table :data="list" border stripe v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column prop="staffNo" label="工号" width="120" />
      <el-table-column prop="staffName" label="姓名" width="110" />
      <el-table-column prop="phone" label="手机号" width="140" />
      <el-table-column prop="roleName" label="系统角色" width="120">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'" size="small">{{ row.roleName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="classCount" label="带班数" width="90" align="center" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
            {{ row.status === 'active' ? '在职' : '离职' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="170" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" :disabled="!isAdmin" @click="openEdit(row)">编辑</el-button>
          <el-button size="small" type="warning" :disabled="!isAdmin" @click="resetPwd(row)">重置密码</el-button>
          <el-button size="small" type="danger" :disabled="!isAdmin || row.staffId === userStore.staffId" @click="remove(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑成员' : '新增成员'" width="480px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="工号" required>
          <el-input v-model="form.staffNo" :disabled="isEdit" placeholder="如 T1005" />
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="form.staffName" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="辅导员" value="counselor" />
            <el-option label="系统管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="!isEdit" label="初始密码" required>
          <el-input v-model="form.password" placeholder="不少于 6 位" />
        </el-form-item>
        <el-form-item v-if="isEdit" label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="active">在职</el-radio>
            <el-radio label="inactive">离职</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getMembers, addMember, updateMember, deleteMember, resetMemberPassword } from '../../api';
import { useUserInfoStore } from '../../stores/userInfo';

const userStore = useUserInfoStore();
const isAdmin = computed(() => userStore.isAdmin);

const list = ref<any[]>([]);
const loading = ref(false);
const query = reactive({ status: '', keyword: '', role: '' });

const dialogVisible = ref(false);
const isEdit = ref(false);
const currentId = ref<number | null>(null);
const form = reactive<any>({
  staffNo: '', staffName: '', phone: '', role: 'counselor', password: '', status: 'active'
});

const load = async () => {
  loading.value = true;
  try {
    const res: any = await getMembers({ ...query });
    list.value = res.data;
  } finally {
    loading.value = false;
  }
};

const reset = () => {
  query.status = '';
  query.keyword = '';
  query.role = '';
  load();
};

const openAdd = () => {
  isEdit.value = false;
  Object.assign(form, { staffNo: '', staffName: '', phone: '', role: 'counselor', password: '', status: 'active' });
  dialogVisible.value = true;
};

const openEdit = (row: any) => {
  isEdit.value = true;
  currentId.value = row.staffId;
  Object.assign(form, {
    staffNo: row.staffNo, staffName: row.staffName, phone: row.phone,
    role: row.role, status: row.status
  });
  dialogVisible.value = true;
};

const submit = async () => {
  if (!form.staffNo || !form.staffName) {
    ElMessage.warning('工号与姓名为必填项');
    return;
  }
  if (!isEdit.value && (!form.password || form.password.length < 6)) {
    ElMessage.warning('初始密码不能少于 6 位');
    return;
  }
  if (isEdit.value && currentId.value) {
    await updateMember(currentId.value, form);
    ElMessage.success('修改成功');
  } else {
    await addMember(form);
    ElMessage.success('新增成功');
  }
  dialogVisible.value = false;
  load();
};

const resetPwd = async (row: any) => {
  try {
    const { value } = await ElMessageBox.prompt(
      `为「${row.staffName}」设置新密码（不少于 6 位）`, '重置密码',
      { inputPattern: /^.{6,}$/, inputErrorMessage: '密码长度不能少于 6 位' }
    );
    await resetMemberPassword(row.staffId, value);
    ElMessage.success('密码已重置');
  } catch {
    // 取消或接口错误
  }
};

const remove = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定删除成员「${row.staffName}」吗？`, '删除确认', { type: 'warning' });
    await deleteMember(row.staffId);
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
  margin-bottom: 14px;
}
.page-header h2 {
  margin: 0;
  font-size: 18px;
  color: #1f2d3d;
}
.role-tip {
  margin-bottom: 14px;
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
</style>
