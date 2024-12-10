<template>
  <div class="stu-data-analysis">
    <el-card>
      <!-- 筛选条件和导出 -->
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
      <div class="chart-type-selector">
        <el-radio-group v-model="chartType" style="margin-bottom: 5px;">
          <el-radio-button value="bar">条形图</el-radio-button>
          <el-radio-button value="pie">饼状图</el-radio-button>
          <el-radio-button value="table">表格</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 数据钻取 -->
      <div class="drilldown" v-if="!drilldownMode">
        <el-select v-model="drilldownBuilding" placeholder="选择公寓楼" @change="fetchDrilldownData">
          <el-option v-for="building in stats" :key="building.buildingId" :label="building.buildingId"
            :value="building.buildingId"></el-option>
        </el-select>
      </div>
      <el-button v-if="drilldownMode && !drilldownMode2" @click="resetDrilldown">返回</el-button>
      <el-button v-if="drilldownMode2" @click="resetDrilldown2">返回</el-button>

      <!-- 数据钻取2 -->
      <div class="drilldown" v-if="drilldownMode">
        <el-select v-model="drilldownDepartment" placeholder="选择系号" @change="fetchDrilldownData2"
          style="margin-top: 5px;">
          <el-option v-for="item in drilldownData" :key="item.department" :label="item.department"
            :value="item.department"></el-option>
        </el-select>
      </div>

      <!-- 条形图 -->
      <div v-if="chartType === 'bar'" ref="barChart" class="chart-container"></div>

      <!-- 饼状图 -->
      <div v-if="chartType === 'pie'" ref="pieChart" class="chart-container"></div>

      <!-- 表格 -->
      <div v-if="chartType === 'table'">
        <el-table :data="tableData" border>
          <el-table-column v-if="!drilldownMode" prop="buildingId" label="公寓编号" />
          <el-table-column v-if="!drilldownMode" prop="buildingType" label="公寓类型" />
          <el-table-column v-if="!drilldownMode" prop="studentCount" label="学生数量" />
          <el-table-column v-if="drilldownMode && !drilldownMode2" prop="department" label="系号" />
          <el-table-column v-if="drilldownMode && !drilldownMode2" prop="studentCount" label="学生数量" />
          <el-table-column v-if="drilldownMode2" prop="floor" label="楼层" />
          <el-table-column v-if="drilldownMode2" prop="studentCount" label="学生数量" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted, nextTick, watch } from "vue";
import { getBuildingStats, getBuildingDrilldown, getBuildingFloorDrilldown } from "@/api/stuDataAnalysis";

const buildingFilter = ref("all");
const chartType = ref("bar");
const stats = ref([]);
const tableData = ref([]);
const barChart = ref(null);
const pieChart = ref(null);
const drilldownData = ref([]);
const drilldownData2 = ref([]);

// 数据钻取相关
const drilldownMode = ref(false);
const drilldownBuilding = ref(null);
const drilldownMode2 = ref(false);
const drilldownDepartment = ref(null);

const fetchData = async () => {
  if (drilldownMode.value) return; // 如果在钻取模式，不更新主数据
  const res = await getBuildingStats();
  stats.value =
    buildingFilter.value === "all"
      ? res.data
      : res.data.filter((item) => item.buildingType === buildingFilter.value);

  updateCharts(stats.value, false);
};

const fetchDrilldownData = async () => {
  if (!drilldownBuilding.value) return;
  const res = await getBuildingDrilldown({
    buildingId: drilldownBuilding.value,
    drillBy: "department",
  });
  drilldownMode.value = true;
  drilldownData.value = res.data;
  updateCharts(res.data, true);
};

const fetchDrilldownData2 = async () => {
  if (!drilldownDepartment.value) return;
  const res = await getBuildingFloorDrilldown({
    buildingId: drilldownBuilding.value,
    filterBy: "department",
    value: drilldownDepartment.value,
  });
  drilldownMode2.value = true;
  drilldownData2.value = res.data;
  updateCharts2(res.data);
};

const resetDrilldown = () => {
  drilldownMode.value = false;
  drilldownBuilding.value = null;
  fetchData(); // 返回主数据
};

const resetDrilldown2 = () => {
  drilldownMode2.value = false;
  drilldownDepartment.value = null;
  fetchDrilldownData(); // 返回主数据
};

const updateCharts = async (data, isDrilldown) => {
  await nextTick(); // 确保 DOM 更新完成

  const xAxisData = data.map((item) => (isDrilldown ? item.department : item.buildingId));
  const seriesData = data.map((item) => item.studentCount);

  // 更新条形图
  if (barChart.value) {
    const barInstance = echarts.init(barChart.value);
    barInstance.setOption({
      title: { text: isDrilldown ? "按系统计（条形图）" : "学生统计（条形图）" },
      tooltip: {},
      xAxis: { type: "category", data: xAxisData },
      yAxis: { type: "value" },
      series: [{ data: seriesData, type: "bar" }],
    });
  }

  // 更新饼状图
  if (pieChart.value) {
    const pieInstance = echarts.init(pieChart.value);
    pieInstance.setOption({
      title: { text: isDrilldown ? "按系统计（饼状图）" : "学生统计（饼状图）" },
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          data: data.map((item) => ({
            value: item.studentCount,
            name: isDrilldown ? item.department : item.buildingId,
          })),
        },
      ],
    });
  }

  // 更新表格数据
  tableData.value = data;
};

const updateCharts2 = async (data) => {
  await nextTick(); // 确保 DOM 更新完成

  const xAxisData = data.map((item) => item.floor);
  const seriesData = data.map((item) => item.studentCount);

  // 更新条形图
  if (barChart.value) {
    const barInstance = echarts.init(barChart.value);
    barInstance.setOption({
      title: { text: "按层统计（条形图）" },
      tooltip: {},
      xAxis: { type: "category", data: xAxisData },
      yAxis: { type: "value" },
      series: [{ data: seriesData, type: "bar" }],
    });
  }

  // 更新饼状图
  if (pieChart.value) {
    const pieInstance = echarts.init(pieChart.value);
    pieInstance.setOption({
      title: { text: "按层统计（饼状图）" },
      tooltip: { trigger: "item" },
      series: [
        {
          type: "pie",
          data: data.map((item) => ({
            value: item.studentCount,
            name: item.floor,
          })),
        },
      ],
    });
  }

  // 更新表格数据
  tableData.value = data;
};

const exportChart = () => {
  const chartRef = chartType.value === "bar" ? barChart.value : pieChart.value;
  if (!chartRef) return;
  const chartInstance = echarts.getInstanceByDom(chartRef);
  const dataURL = chartInstance.getDataURL({ type: "png" });
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = chartType.value === "bar" ? "bar_chart.png" : "pie_chart.png";
  link.click();
};

const exportTable = () => {
  const header = Object.keys(tableData.value[0] || {}).join(",");
  const rows = tableData.value.map((row) => Object.values(row).join(",")).join("\n");
  const csvContent = `data:text/csv;charset=utf-8,${header}\n${rows}`;
  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "table_data.csv";
  link.click();
};

onMounted(fetchData);
watch([chartType, drilldownBuilding, drilldownDepartment], () => {
  if (drilldownMode.value && !drilldownMode2.value) {
    // 数据钻取模式下，用钻取数据更新图表
    updateCharts(drilldownData.value, true);
  } else if (drilldownMode2.value) {
    // 数据钻取模式下，用钻取数据更新图表
    updateCharts2(drilldownData2.value);
  } else {
    // 非钻取模式，用全局数据更新图表
    updateCharts(stats.value, false);
  }
});

</script>

<style scoped>
.stu-data-analysis {
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

.drilldown {
  margin-bottom: 16px;
}
</style>