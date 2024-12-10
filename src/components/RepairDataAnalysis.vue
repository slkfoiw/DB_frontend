<template>
  <div class="repair-data-analysis">
    <el-card>
      <div class="content">
        <!-- 左侧：表格 -->
        <div class="left-panel">
          <div class="header">
            <h3>报修状态统计</h3>
            <el-button @click="exportTableData">
              导出表格
            </el-button>
          </div>
          <el-table :data="repairStatusData" border>
            <el-table-column prop="status" label="状态" />
            <el-table-column prop="count" label="数量" />
          </el-table>
        </div>

        <!-- 右侧：折线图和堆叠柱状图 -->
        <div class="right-panel">
          <!-- 折线图 -->
          <div class="chart-container">
            <div class="header">
              <h3>每月报修数量（按类型）</h3>
              <el-button @click="exportLineChart">
                导出折线图
              </el-button>
            </div>
            <div ref="lineChart" class="chart" />
          </div>

          <!-- 堆叠柱状图 -->
          <div class="chart-container">
            <div class="header">
              <h3>按报修类型统计公寓楼报修数量</h3>
              <el-button @click="exportBarChart">
                导出堆叠柱状图
              </el-button>
            </div>
            <div ref="barChart" class="chart" />
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
.repair-data-analysis .content {
  display: flex;
  gap: 20px;
  /* 左右面板的间距 */
}

.left-panel {
  flex: 1;
  /* 左右面板等宽 */
}

.right-panel {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header {
  display: flex;
  /* 启用Flex布局 */
  align-items: center;
  /* 垂直方向居中 */
  justify-content: space-between;
  /* 左右对齐 */
  margin-bottom: 10px;
  /* 标题与内容间距 */
}

.header h3 {
  margin: 0;
  /* 移除默认外边距 */
  font-size: 16px;
  /* 标题大小 */
  font-weight: bold;
  /* 加粗标题 */
}

.chart-container .chart {
  height: 400px;
  /* 图表高度 */
}
</style>