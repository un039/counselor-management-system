<template>
  <div class="dashboard">
    <h2 class="page-title">数据概览</h2>

    <div class="stat-row">
      <div class="stat-card">
        <div class="label">管理班级</div>
        <div class="value">{{ summary.classCount }}</div>
        <div class="unit">个</div>
      </div>
      <div class="stat-card">
        <div class="label">在校学生</div>
        <div class="value">{{ summary.stuCount }}</div>
        <div class="unit">人</div>
      </div>
      <div class="stat-card">
        <div class="label">发出信件</div>
        <div class="value">{{ summary.letterCount }}</div>
        <div class="unit">封</div>
      </div>
      <div class="stat-card">
        <div class="label">寒假申报率</div>
        <div class="value">{{ summary.holidayRate }}</div>
        <div class="unit">%</div>
      </div>
    </div>

    <div class="chart-row">
      <el-card class="chart-card" shadow="never">
        <template #header><span>各问卷提交人数</span></template>
        <div ref="barRef" class="chart"></div>
      </el-card>
      <el-card class="chart-card" shadow="never">
        <template #header><span>班级学生人数分布</span></template>
        <div ref="pieRef" class="chart"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, reactive } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart, PieChart } from 'echarts/charts';
import { TooltipComponent, GridComponent, LegendComponent, AxisPointerComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { getSummary, getQnaires, getClasses } from '../../api';

echarts.use([BarChart, PieChart, TooltipComponent, GridComponent, LegendComponent, AxisPointerComponent, CanvasRenderer]);

const summary = reactive({
  classCount: 0,
  stuCount: 0,
  letterCount: 0,
  qnaireCount: 0,
  holidayRate: 0
});

const barRef = ref<HTMLDivElement>();
const pieRef = ref<HTMLDivElement>();
let barChart: ReturnType<typeof echarts.init> | null = null;
let pieChart: ReturnType<typeof echarts.init> | null = null;

const renderBar = (titles: string[], counts: number[]) => {
  if (!barRef.value) return;
  barChart = echarts.init(barRef.value);
  barChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: 50, right: 20, top: 30, bottom: 60 },
    xAxis: {
      type: 'category',
      data: titles,
      axisLabel: { interval: 0, rotate: 20, fontSize: 11 }
    },
    yAxis: { type: 'value', name: '人数' },
    series: [{
      type: 'bar',
      data: counts,
      barWidth: 32,
      itemStyle: { color: '#2f6fed', borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top' }
    }]
  });
};

const renderPie = (data: { name: string; value: number }[]) => {
  if (!pieRef.value) return;
  pieChart = echarts.init(pieRef.value);
  pieChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} 人 ({d}%)' },
    legend: { bottom: 0, textStyle: { fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['50%', '45%'],
      data,
      label: { formatter: '{b}\n{c}人' }
    }]
  });
};

const resize = () => {
  barChart?.resize();
  pieChart?.resize();
};

onMounted(async () => {
  const [s, q, c] = await Promise.all([getSummary(), getQnaires(), getClasses()]);
  Object.assign(summary, s.data);

  const qnaires = q.data || [];
  renderBar(qnaires.map((i: any) => i.title), qnaires.map((i: any) => i.submittedCount));

  const classes = c.data || [];
  renderPie(classes.map((i: any) => ({ name: i.className, value: i.stuCount })));

  window.addEventListener('resize', resize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize);
  barChart?.dispose();
  pieChart?.dispose();
});
</script>

<style scoped>
.page-title {
  margin: 0 0 18px;
  font-size: 18px;
  color: #1f2d3d;
}
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 18px;
}
.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  position: relative;
}
.stat-card .label {
  color: #8a94a6;
  font-size: 13px;
}
.stat-card .value {
  font-size: 30px;
  font-weight: 700;
  color: #2f6fed;
  margin-top: 6px;
  line-height: 1.1;
}
.stat-card .unit {
  position: absolute;
  right: 20px;
  bottom: 20px;
  color: #b4bccc;
  font-size: 13px;
}
.chart-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.chart-card {
  border-radius: 8px;
}
.chart {
  height: 300px;
}
</style>
