<template>
  <div class="questionnaire-view-page">
    <div class="page-header">
      <h2>问卷查询情况</h2>
      <el-button type="primary" @click="exportData">导出数据</el-button>
    </div>

    <el-card class="search-card">
      <el-select v-model="searchParams.questionnaireId" placeholder="选择问卷" style="width: 200px; margin-right: 10px;">
        <el-option v-for="item in questionnaireList" :key="item.id" :label="item.title" :value="item.id" />
      </el-select>
      <el-date-picker
        v-model="searchParams.dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 300px; margin-right: 10px;"
      />
      <el-select v-model="searchParams.status" placeholder="提交状态" style="width: 150px; margin-right: 10px;">
        <el-option label="全部" value="" />
        <el-option label="已提交" value="submitted" />
        <el-option label="未提交" value="unsubmitted" />
      </el-select>
      <el-button type="primary" @click="searchResults">查询</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </el-card>

    <div class="statistics-card">
      <el-card class="stat-item">
        <div class="stat-value">{{ totalCount }}</div>
        <div class="stat-label">总提交数</div>
      </el-card>
      <el-card class="stat-item">
        <div class="stat-value">{{ submittedCount }}</div>
        <div class="stat-label">已提交</div>
      </el-card>
      <el-card class="stat-item">
        <div class="stat-value">{{ unsubmittedCount }}</div>
        <div class="stat-label">未提交</div>
      </el-card>
      <el-card class="stat-item">
        <div class="stat-value">{{ completionRate }}%</div>
        <div class="stat-label">完成率</div>
      </el-card>
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="questionnaireTitle" label="问卷名称" />
      <el-table-column prop="studentName" label="学生姓名" />
      <el-table-column prop="className" label="班级" />
      <el-table-column prop="submitTime" label="提交时间" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'submitted' ? 'success' : 'warning'">{{ scope.row.status === 'submitted' ? '已提交' : '未提交' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button size="small" v-if="scope.row.status === 'submitted'" @click="viewDetails(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="detailVisible" title="问卷详情" width="60%">
      <div v-if="currentDetail" class="detail-content">
        <h3>{{ currentDetail.questionnaireTitle }}</h3>
        <p><strong>提交人：</strong>{{ currentDetail.studentName }} ({{ currentDetail.className }})</p>
        <p><strong>提交时间：</strong>{{ currentDetail.submitTime }}</p>
        <div class="questions">
          <div v-for="(q, index) in currentDetail.questions" :key="index" class="question-item">
            <p><strong>{{ index + 1 }}. {{ q.title }}</strong></p>
            <p class="answer">{{ q.answer }}</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';

// 问卷列表（模拟数据）
const questionnaireList = ref([
  { id: 1, title: '学生满意度调查' },
  { id: 2, title: '家校沟通情况问卷' },
  { id: 3, title: '教师教学质量评估' }
]);

// 搜索参数
const searchParams = reactive({
  questionnaireId: '',
  dateRange: [],
  status: ''
});

// 表格数据（模拟）
const tableData = ref([
  { id: 1, questionnaireTitle: '学生满意度调查', studentName: '张三', className: '一年级一班', submitTime: '2023-10-01 14:30', status: 'submitted' },
  { id: 2, questionnaireTitle: '学生满意度调查', studentName: '李四', className: '一年级一班', submitTime: '', status: 'unsubmitted' },
  { id: 3, questionnaireTitle: '家校沟通情况问卷', studentName: '王五', className: '二年级二班', submitTime: '2023-10-15 09:15', status: 'submitted' },
  { id: 4, questionnaireTitle: '学生满意度调查', studentName: '赵六', className: '一年级二班', submitTime: '2023-10-02 16:45', status: 'submitted' },
  { id: 5, questionnaireTitle: '教师教学质量评估', studentName: '钱七', className: '三年级一班', submitTime: '', status: 'unsubmitted' }
]);

// 统计数据
const totalCount = computed(() => tableData.value.length);
const submittedCount = computed(() => tableData.value.filter(item => item.status === 'submitted').length);
const unsubmittedCount = computed(() => tableData.value.filter(item => item.status === 'unsubmitted').length);
const completionRate = computed(() => totalCount.value ? Math.round((submittedCount.value / totalCount.value) * 100) : 0);

// 详情对话框
const detailVisible = ref(false);
const currentDetail = ref(null);

// 搜索结果
const searchResults = () => {
  // 实际项目中这里会调用API
  ElMessage.success('查询功能已触发');
};

// 重置搜索
const resetSearch = () => {
  searchParams.questionnaireId = '';
  searchParams.dateRange = [];
  searchParams.status = '';
};

// 查看详情
const viewDetails = (row) => {
  // 模拟详情数据
  currentDetail.value = {
    ...row,
    questions: [
      { title: '您对学校的教学质量满意吗？', answer: '非常满意' },
      { title: '您认为学校的家校沟通是否及时？', answer: '及时' },
      { title: '您对教师的教学态度评价如何？', answer: '很好' },
      { title: '其他建议：', answer: '希望增加课外活动' }
    ]
  };
  detailVisible.value = true;
};

// 导出数据
const exportData = () => {
  ElMessage.success('数据导出成功');
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
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}
.statistics-card {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}
.stat-item {
  flex: 1;
  text-align: center;
  padding: 15px 0;
}
.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #007bff;
}
.stat-label {
  color: #666;
}
.detail-content {
  max-height: 500px;
  overflow-y: auto;
}
.questions {
  margin-top: 20px;
}
.question-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}
.answer {
  margin-top: 5px;
  padding-left: 20px;
  color: #666;
}
</style>