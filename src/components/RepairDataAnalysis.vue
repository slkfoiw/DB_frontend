<template>
    <div class="repair-data-analysis">
      <el-card>
        <div class="content">
          <!-- 左侧：表格 -->
          <div class="left-panel">
            <h3>报修状态统计</h3>
            <el-table :data="repairStatusData" border>
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="count" label="数量" />
            </el-table>
            <el-button type="primary" size="small" @click="exportTableData">
              导出表格
            </el-button>
          </div>
  
          <!-- 右侧：折线图和堆叠柱状图 -->
          <div class="right-panel">
            <!-- 折线图 -->
            <div class="chart-container">
              <h3>每月报修数量（按类型）</h3>
              <div ref="lineChart" class="chart" />
              <el-button type="primary" size="small" @click="exportLineChart">
                导出折线图
              </el-button>
            </div>
            <!-- 堆叠柱状图 -->
            <div class="chart-container">
              <h3>按报修类型统计公寓楼报修数量</h3>
              <div ref="barChart" class="chart" />
              <el-button type="primary" size="small" @click="exportBarChart">
                导出堆叠柱状图
              </el-button>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </template>
  
    
  <script>
  import * as echarts from "echarts";
  import { saveAs } from "file-saver"; // 引入 file-saver 用于保存文件
  import {
    getRepairStatusStats,
    getRepairTypeStatsByBuilding,
    getRepairTrendStats,
  } from "@/api/repairDataAnalysis";
import { ElMessage } from "element-plus";
  
  export default {
    name: "RepairDataAnalysis",
    data() {
      return {
        repairStatusData: [],
        lineChartInstance: null,
        barChartInstance: null,
      };
    },
    methods: {
      async fetchRepairData() {
        const res = await getRepairStatusStats();
        if (res.code !== 0) {
          ElMessage.error(res.msg);
          return;
        }
        const { processedCount, unprocessedCount } = res.data;
        this.repairStatusData = [
          { status: "已处理", count: processedCount },
          { status: "未处理", count: unprocessedCount },
        ];
  
        const lineData = await getRepairTrendStats();
        this.renderLineChart(lineData.data);
  
        const barData = await getRepairTypeStatsByBuilding();
        this.renderBarChart(barData.data);
      },
  
      renderLineChart(data) {
        this.$nextTick(() => {
          const chart = echarts.init(this.$refs.lineChart);
          const months = [...new Set(data.map((item) => item.month))];
          const types = [...new Set(data.map((item) => item.type))];
          const series = types.map((type) => ({
            name: type,
            type: "line",
            data: months.map((month) => {
              const entry = data.find(
                (item) => item.month === month && item.type === type
              );
              return entry ? entry.count : 0;
            }),
          }));
  
          chart.setOption({
            tooltip: { trigger: "axis" },
            legend: { data: types },
            xAxis: { type: "category", data: months },
            yAxis: { type: "value" },
            series,
          });
          chart.resize();
          this.lineChartInstance = chart;
        });
      },
  
      renderBarChart(data) {
        this.$nextTick(() => {
          const chart = echarts.init(this.$refs.barChart);
          const buildings = [...new Set(data.map((item) => item.buildingId))];
          const types = [...new Set(data.map((item) => item.type))];
          const series = types.map((type) => ({
            name: type,
            type: "bar",
            stack: "总量",
            data: buildings.map((building) => {
              const entry = data.find(
                (item) => item.buildingId === building && item.type === type
              );
              return entry ? entry.count : 0;
            }),
          }));
  
          chart.setOption({
            tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
            legend: { data: types },
            xAxis: { type: "category", data: buildings },
            yAxis: { type: "value" },
            series,
          });
          chart.resize();
          this.barChartInstance = chart;
        });
      },
  
      exportTableData() {
        const csvContent =
          "状态,数量\n" +
          this.repairStatusData
            .map((item) => `${item.status},${item.count}`)
            .join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "repair_status_stats.csv");
      },
  
      exportLineChart() {
        const img = this.lineChartInstance.getDataURL();
        this.downloadImage(img, "repair_trend_chart.png");
      },
  
      exportBarChart() {
        const img = this.barChartInstance.getDataURL();
        this.downloadImage(img, "repair_type_chart.png");
      },
  
      downloadImage(imgData, filename) {
        const link = document.createElement("a");
        link.href = imgData;
        link.download = filename;
        link.click();
      },
    },
    mounted() {
      this.fetchRepairData();
    },
  };
  </script>
  
    
  <style scoped>
  .repair-data-analysis {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .content {
    display: flex;
    gap: 16px;
  }
  
  .left-panel {
    flex: 1;
  }
  
  .right-panel {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .chart-container {
    flex: 1;
    position: relative;
  }
  
  .chart {
    width: 100%;
    height: 300px;
  }
  
  h3 {
    margin-bottom: 8px;
  }
  
  .el-button {
    margin-top: 8px;
  }
  </style>
  