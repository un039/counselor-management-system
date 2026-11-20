<template>
  <div class="qnaire-view">
    <div class="page-header">
      <h2>问卷查阅情况</h2>
      <el-button type="primary" plain @click="exportCsv">导出数据</el-button>
    </div>

    <el-card shadow="never" class="filter-card">
      <el-select v-model="qnaireId" placeholder="选择问卷" style="width: 260px" @change="onQnaireChange">
        <el-option v-for="q in qnaires" :key="q.qnaireId" :label="q.title" :value="q.qnaireId" />
      </el-select>
      <el-select v-model="status" placeholder="提交状态" clearable style="width: 150px" @change="loadSubmissions">
        <el-option label="已提交" value="submitted" />
        <el-option label="未提交" value="unsubmitted" />
      </el-select>
      <el-input
        v-model="keyword" placeholder="学生姓名 / 学号" clearable style="width: 200px"
        @keyup.enter="loadSubmissions"
      />
      <el-button type="primary" @click="loadSubmissions">查询</el-button>
      <el-button @click="resetFilter">重置</el-button>
    </el-card>

    <div class="stat-row">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">应提交人数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value success">{{ stats.submitted }}</div>
        <div class="stat-label">已提交</div>
      </div>
      <div class="stat-card">
        <div class="stat-value warning">{{ stats.total - stats.submitted }}</div>
        <div class="stat-label">未提交</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.rate }}%</div>
        <div class="stat-label">完成率</div>
      </div>
    </div>

    <el-card shadow="never" class="chart-card" v-if="stats.questions?.length">
      <template #header>
        <div class="chart-header">
          <span>题目作答分布</span>
          <el-select v-model="questionIndex" style="width: 340px" @change="renderChart">
            <el-option
              v-for="(q, i) in stats.questions"
              :key="q.questionId"
              :label="`第${i + 1}题：${q.content}`"
              :value="i"
            />
          </el-select>
        </div>
      </template>
      <div ref="chartRef" class="chart"></div>
    </el-card>

    <el-table :data="submissions" border stripe v-loading="loading" style="width: 100%">
      <el-table-column prop="stuId" label="学号" width="130" />
      <el-table-column prop="stuName" label="学生姓名" width="110" />
      <el-table-column prop="className" label="班级" width="160" />
      <el-table-column prop="submitTime" label="提交时间" width="180">
        <template #default="{ row }">{{ row.submitTime || '-' }}</template>
      </el-table-column>
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <el-tag :type="row.status === 'submitted' ? 'success' : 'warning'" size="small">
            {{ row.status === 'submitted' ? '已提交' : '未提交' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button size="small" v-if="row.status === 'submitted'" @click="viewDetail(row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="detailVisible" title="问卷作答详情" width="620px">
      <p class="detail-head">{{ currentStu?.stuName }}（{{ currentStu?.stuId }}）· {{ currentStu?.className }}</p>
      <div v-for="(a, i) in answers" :key="i" class="answer-item">
        <p class="q">{{ i + 1 }}. {{ a.content }}</p>
        <p class="a">{{ a.answer || '（未填写）' }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive, ref, nextTick } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TooltipComponent, GridComponent, AxisPointerComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { ElMessage } from 'element-plus';
import { getQnaires, getQnaireStats, getSubmissions, getAnswerDetail } from '../../api';

echarts.use([BarChart, TooltipComponent, GridComponent, AxisPointerComponent, CanvasRenderer]);

const qnaires = ref<any[]>([]);
const qnaireId = ref<number | null>(null);
const status = ref('');
const keyword = ref('');
const loading = ref(false);

const submissions = ref<any[]>([]);
const stats = reactive<any>({ total: 0, submitted: 0, rate: 0, questions: [] });
const questionIndex = ref(0);

const chartRef = ref<HTMLDivElement>();
let chart: ReturnType<typeof echarts.init> | null = null;

const detailVisible = ref(false);
const currentStu = ref<any>(null);
const answers = ref<any[]>([]);

const renderChart = async () => {
  const q = stats.questions[questionIndex.value];
  if (!q) return;
  await nextTick();
  if (!chartRef.value) return;
  if (!chart) chart = echarts.init(chartRef.value);

  chart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 120, right: 60, top: 20, bottom: 20 },
    xAxis: { type: 'value', name: '人数' },
    yAxis: {
      type: 'category',
      data: q.distribution.map((d: any) => d.label),
      axisLabel: { fontSize: 12 }
    },
    series: [{
      type: 'bar',
      data: q.distribution.map((d: any) => d.count),
      barWidth: 18,
      itemStyle: { color: '#2f6fed', borderRadius: [0, 4, 4, 0] },
      label: {
        show: true,
        position: 'right',
        formatter: (p: any) => {
          const item = q.distribution[p.dataIndex];
          return `${item.count} 人 (${item.percent}%)`;
        }
      }
    }]
  }, true);
  chart.resize();
};

const loadStats = async () => {
  if (!qnaireId.value) return;
  const res: any = await getQnaireStats(qnaireId.value);
  Object.assign(stats, res.data);
  questionIndex.value = 0;
  if (stats.questions.length) renderChart();
  else chart?.clear();
};

const loadSubmissions = async () => {
  if (!qnaireId.value) return;
  loading.value = true;
  try {
    const res: any = await getSubmissions(qnaireId.value, {
      status: status.value,
      keyword: keyword.value
    });
    submissions.value = res.data;
  } finally {
    loading.value = false;
  }
};

const onQnaireChange = async () => {
  await Promise.all([loadStats(), loadSubmissions()]);
};

const resetFilter = () => {
  status.value = '';
  keyword.value = '';
  loadSubmissions();
};

const viewDetail = async (row: any) => {
  currentStu.value = row;
  const res: any = await getAnswerDetail(qnaireId.value!, row.stuId);
  answers.value = res.data;
  detailVisible.value = true;
};

const exportCsv = () => {
  if (!submissions.value.length) {
    ElMessage.warning('当前没有可导出的数据');
    return;
  }
  const header = ['学号', '姓名', '班级', '提交时间', '状态'];
  const rows = submissions.value.map(r => [
    r.stuId, r.stuName, r.className, r.submitTime || '',
    r.status === 'submitted' ? '已提交' : '未提交'
  ]);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `问卷提交情况_${qnaireId.value}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  ElMessage.success('导出成功');
};

const resize = () => chart?.resize();

onMounted(async () => {
  const res: any = await getQnaires();
  qnaires.value = res.data.filter((q: any) => q.questionCount > 0);
  if (qnaires.value.length) {
    qnaireId.value = qnaires.value[0].qnaireId;
    await onQnaireChange();
  }
  window.addEventListener('resize', resize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
  chart?.dispose();
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
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 14px;
}
.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #2f6fed;
}
.stat-value.success {
  color: #12b76a;
}
.stat-value.warning {
  color: #f79009;
}
.stat-label {
  color: #8a94a6;
  font-size: 13px;
  margin-top: 4px;
}
.chart-card {
  margin-bottom: 14px;
  border-radius: 8px;
}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chart {
  height: 280px;
}
.detail-head {
  color: #606266;
  font-size: 13px;
  margin: 0 0 14px;
}
.answer-item {
  border-bottom: 1px dashed #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.answer-item .q {
  margin: 0 0 4px;
  color: #303133;
  font-weight: 500;
}
.answer-item .a {
  margin: 0;
  color: #8a94a6;
  padding-left: 16px;
}
</style>
