<template>
  <div>
    <h2>数据统计</h2>
    <div id="chart1" style="width: 600px; height: 400px;"></div>
    <div id="chart2" style="width: 600px; height: 400px; margin-top: 30px;"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted } from 'vue'

onMounted(() => {
  // 柱状图：每日发帖数
  const chart1 = echarts.init(document.getElementById('chart1'))
  chart1.setOption({
    title: { text: '每日发帖数' },
    xAxis: { type: 'category', data: ['周一','周二','周三','周四','周五','周六','周日'] },
    yAxis: { type: 'value' },
    series: [{ data: [12, 23, 18, 30, 22, 10, 15], type: 'bar' }]
  })

  // 饼图：帖子类型占比
  const chart2 = echarts.init(document.getElementById('chart2'))
  chart2.setOption({
    title: { text: '帖子类型分布', left: 'center' },
    series: [{
      type: 'pie',
      radius: '50%',
      data: [
        { value: 45, name: '图片类' },
        { value: 25, name: '视频类' },
        { value: 30, name: '文字类' }
      ]
    }]
  })
})
</script>
