<template>
  <div class="dorm-mana-data-analysis">
    <el-card>
      <!-- 筛选条件和导出操作 -->
      <div class="header">
        <el-select v-model="buildingFilter" placeholder="选择公寓类型" @change="fetchData">
          <el-option label="全体" value="all"></el-option>
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
          <el-option label="混合" value="混合"></el-option>
        </el-select>
        <div class="actions">
          <el-button style="margin-left: 5px;" @click="exportChart"
            v-if="chartType === 'bar' || chartType === 'pie'">导出图像</el-button>
          <el-button @click="exportTable" v-if="chartType === 'table'">导出表格</el-button>
        </div>
      </div>

      <!-- 图表类型切换 -->
      <div class="chart-type-selector" style="margin-bottom: 5px;">
        <el-radio-group v-model="chartType">
          <el-radio-button value="bar">条形图</el-radio-button>
          <el-radio-button value="pie">饼状图</el-radio-button>
          <el-radio-button value="table">表格</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 条形图 -->
      <div v-if="chartType === 'bar'" ref="barChart" class="chart-container"></div>

      <!-- 饼状图 -->
      <div v-if="chartType === 'pie'" ref="pieChart" class="chart-container"></div>

      <!-- 表格 -->
      <div v-if="chartType === 'table'">
        <el-table :data="tableData" border>
          <el-table-column prop="buildingId" label="公寓编号" />
          <el-table-column prop="buildingType" label="公寓类型" />
          <el-table-column prop="managerCount" label="宿管数量" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import * as XLSX from "xlsx";
import { ref, onMounted, nextTick, watch } from "vue";
import { getDormManagerStats } from "@/api/dormMaDataAnalysis";

const buildingFilter = ref("all");
const chartType = ref("bar");
const stats = ref([]);
const tableData = ref([]);

const barChart = ref(null);
const pieChart = ref(null);

const fetchData = async () => {
  const res = await getDormManagerStats();
  stats.value =
    buildingFilter.value === "all"
      ? res.data
      : res.data.filter((item) => item.buildingType === buildingFilter.value);

  await updateCharts();
};

const updateCharts = async () => {
  await nextTick();
  const xAxisData = stats.value.map((item) => item.buildingId);
  const seriesData = stats.value.map((item) => item.managerCount);

  if (barChart.value) {
    const barInstance = echarts.init(barChart.value);
    barInstance.setOption({
      // title: { text: "宿管统计（条形图）" },
      tooltip: {},
      xAxis: { type: "category", data: xAxisData },
      yAxis: { type: "value" },
      series: [{ data: seriesData, type: "bar" }],
    });
  }

  if (pieChart.value) {
    const pieInstance = echarts.init(pieChart.value);
    pieInstance.setOption({
      // title: { text: "宿管统计（饼状图）" },
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          data: stats.value.map((item) => ({
            value: item.managerCount,
            name: item.buildingId,
          })),
        },
      ],
    });
  }

  tableData.value = stats.value;
};

const exportChart = () => {
  let chartInstance = null;
  if (chartType.value === "bar" && barChart.value) {
    chartInstance = echarts.getInstanceByDom(barChart.value);
  } else if (chartType.value === "pie" && pieChart.value) {
    chartInstance = echarts.getInstanceByDom(pieChart.value);
  }

  if (chartInstance) {
    const url = chartInstance.getDataURL({ type: "png", pixelRatio: 2, backgroundColor: "#fff" });
    const link = document.createElement("a");
    link.href = url;
    link.download = `${chartType.value}-chart.png`;
    link.click();
  }
};

const exportTable = () => {
  const sheetData = stats.value.map((item) => ({
    公寓编号: item.buildingId,
    公寓类型: item.buildingType,
    宿管数量: item.managerCount,
  }));

  const worksheet = XLSX.utils.json_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "宿管统计");
  XLSX.writeFile(workbook, "宿管统计.xlsx");
};

onMounted(fetchData);

watch(chartType, () => {
  updateCharts();
});
</script>

<style scoped>
.dorm-mana-data-analysis {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-container {
  width: 100%;
  height: 400px;
}

.actions {
  display: flex;
  gap: 8px;
}
</style>