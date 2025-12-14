<!-- src/views/Dashboard.vue -->
<template>
  <div class="dashboard">
    <h2>数据统计概览</h2>

    <!-- 顶部数字卡片 -->
    <el-row :gutter="20" style="margin-bottom: 30px;">
      <el-col :span="8">
        <el-card shadow="hover">
          <h3>总用户数</h3>
          <div class="num">{{ stats.userCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <h3>总帖子数</h3>
          <div class="num">{{ stats.postCount }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <h3>今日活跃</h3>
          <div class="num">{{ stats.dailyActive }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- ECharts 图表容器 -->
    <div id="main-chart" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import request from '../utils/request'

const stats = ref({
  userCount: 0,
  postCount: 0,
  dailyActive: 0
})

const initChart = () => {
  const chartDom = document.getElementById('main-chart')
  const myChart = echarts.init(chartDom)

  // 这里用假数据或者 stats 数据来画一个简单的柱状图
  const option = {
    title: { text: '平台数据分布' },
    tooltip: {},
    xAxis: {
      data: ['用户数', '帖子数', '日活']
    },
    yAxis: {},
    series: [
      {
        name: '数量',
        type: 'bar',
        data: [stats.value.userCount, stats.value.postCount, stats.value.dailyActive],
        itemStyle: { color: '#409EFF' }
      }
    ]
  }
  myChart.setOption(option)
}

const fetchStats = async () => {
  try {
    const data = await request.get('/admin/stats/overview')
    stats.value = data.data
    // 数据拿到后，再画图
    initChart()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.num {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-top: 10px;
}
.dashboard {
  padding: 20px;
}
</style>