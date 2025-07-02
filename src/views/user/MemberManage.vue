<template>
  <div class="member-manage-container">
    <div class="filter-bar">
      <el-select v-model="status" placeholder="请选择人员状态" class="filter-item">
        <el-option label="全部" value=""></el-option>
        <el-option label="在职" value="active"></el-option>
        <el-option label="离职" value="inactive"></el-option>
      </el-select>

      <el-input
        v-model="keyword"
        placeholder="请输入姓名/学号/工号关键词查询"
        class="filter-item"
        clearable
      ></el-input>

      <el-select v-model="role" placeholder="请选择系统角色" class="filter-item">
        <el-option label="全部" value=""></el-option>
        <el-option label="系统管理员" value="admin"></el-option>
        <el-option label="辅导员" value="counselor"></el-option>
      </el-select>

      <el-button type="primary" @click="handleSearch" class="filter-item">查询</el-button>
    </div>

    <el-table :data="filteredData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="80"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="id" label="工号/学号"></el-table-column>
      <el-table-column prop="role" label="系统角色">
        <template #default="scope">
          <span>{{ scope.row.role === 'admin' ? '系统管理员' : '辅导员' }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { userList } from '@/api/user';

// 筛选条件
const status = ref('');
const keyword = ref('');
const role = ref('');
const memberList = ref([]);

// 获取成员列表数据
const fetchMemberList = async () => {
  try {
    const response = await userList({});
    memberList.value = response.data;
  } catch (error) {
    console.error('获取成员列表失败:', error);
  }
};

// 初始加载数据
fetchMemberList();

// 筛选数据
const filteredData = computed(() => {
  return memberList.value.filter(item => {
    // 状态筛选
    if (status.value && item.status !== status.value) return false;
    // 关键词筛选
    if (keyword.value) {
      const lowerKeyword = keyword.value.toLowerCase();
      if (!item.name.toLowerCase().includes(lowerKeyword) && !item.id.includes(lowerKeyword)) {
        return false;
      }
    }
    // 角色筛选
    if (role.value && item.role !== role.value) return false;
    return true;
  });
});

// 搜索按钮点击事件
const handleSearch = () => {
  // 触发筛选计算
};
</script>

<style scoped>
.member-manage-container {
  padding: 20px;
}

.filter-bar {
  display: flex;
  margin-bottom: 20px;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-item {
  min-width: 200px;
}
</style>