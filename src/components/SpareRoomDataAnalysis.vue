<template>
  <div style="display: flex; justify-content: space-between">
    <!-- 左侧 -->
    <div style="flex: 1; margin-right: 10px;">
      <div class="controls">
        <el-switch
          v-model="showRepairHistory"
          active-text="显示报修历史"
          inactive-text="显示漏斗图"
          style="margin-left: 20px"
        ></el-switch>

        <el-select
          v-if="showRepairHistory"
          v-model="selectedBuilding"
          placeholder="选择楼栋"
          @change="fetchRepairHistory"
          style="width: 200px; margin-bottom: 20px"
        >
          <el-option
            v-for="building in uniqueBuildings"
            :key="building.buildingId"
            :label="`Building ${building.buildingId}`"
            :value="building.buildingId"
          ></el-option>
        </el-select>

        <!-- 导出按钮 -->
        <el-button
          v-if="showRepairHistory"
          type="primary"
          size="small"
          @click="exportTable"
          style="margin-left: 10px"
        >
          导出表格
        </el-button>
      </div>

      <!-- 报修历史表格 -->
      <div v-if="showRepairHistory" class="repair-history-table">
        <el-table
          :data="repairHistory"
          border
          style="width: 60%; margin-top: 20px;"
          v-loading="loading"
        >
          <el-table-column
            prop="roomId"
            label="房间号"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="type"
            label="报修类型"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="count"
            label="报修次数"
            width="100"
          ></el-table-column>
        </el-table>

        <el-pagination
          v-if="totalPages > 1"
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalItems"
          layout="prev, pager, next"
          style="margin-top: 20px; text-align: center"
        ></el-pagination>
      </div>

      <!-- 漏斗图 -->
      <div v-else class="funnel-chart" ref="occupancyRateFunnel"></div>
    </div>

    <!-- 右侧 3D 图表 -->
    <div style="flex: 1; margin-left: 20px;">
      <div ref="spareBedsChart" style="width: 100%; height: 600px"></div>

      <!-- 导出按钮 -->
      <el-button
        type="primary"
        size="small"
        @click="exportChart"
        style="margin-top: 10px;"
      >
        导出图表
      </el-button>
    </div>
  </div>
</template>
  
  <script>
import * as echarts from "echarts";
import "echarts-gl"; // 引入 3D 模块
import {
  getSpareRoomData,
  getEmptyRoomRepairHistory,
} from "@/api/spareRoomDataAnalysis";

export default {
  name: "SpareRoomDataAnalysis",
  data() {
    return {
      spareBedsChartInstance: null,
      occupancyFunnelChartInstance: null,
      selectedBuilding: null,
      buildings: [], // 原始楼栋列表
      repairHistory: [], // 报修历史数据
      totalItems: 0, // 总条目数
      totalPages: 0, // 总页数
      currentPage: 1, // 当前页
      pageSize: 5, // 每页条目数
      showRepairHistory: false, // 是否显示报修历史
      loading: false, // 加载状态
    };
  },
  computed: {
    uniqueBuildings() {
      // 去重处理
      const seen = new Set();
      return this.buildings.filter((item) => {
        if (seen.has(item.buildingId)) {
          return false;
        } else {
          seen.add(item.buildingId);
          return true;
        }
      });
    },
  },
  methods: {
    async fetchBuildings() {
      const response = await getSpareRoomData();
      const data = response.data;
      this.buildings = data.map((item) => ({ buildingId: item.buildingId }));
    },

    async fetchRepairHistory(buildingId) {
      if (!this.showRepairHistory) return;

      this.loading = true;
      try {
        const response = await getEmptyRoomRepairHistory(
          buildingId || this.selectedBuilding
        );
        const data = response.data;

        this.totalItems = data.length;
        this.totalPages = Math.ceil(data.length / this.pageSize);
        this.repairHistory = data.slice(0, this.pageSize);
      } catch (error) {
        console.error("Error fetching repair history:", error);
      } finally {
        this.loading = false;
      }
    },

    handlePageChange(page) {
      this.currentPage = page;
      const start = (page - 1) * this.pageSize;
      const end = page * this.pageSize;
      this.repairHistory = this.repairHistory.slice(start, end);
    },

    exportTable() {
      const csvContent = [
        ["房间号", "报修类型", "报修次数"],
        ...this.repairHistory.map((row) => [row.roomId, row.type, row.count]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Repair_History_Building_${this.selectedBuilding}.csv`;
      link.click();
    },

    exportChart() {
      if (this.spareBedsChartInstance) {
        const url = this.spareBedsChartInstance.getDataURL({
          type: "png",
          backgroundColor: "#fff",
        });
        const link = document.createElement("a");
        link.href = url;
        link.download = "Spare_Beds_Chart.png";
        link.click();
      }
    },

    async fetchSpareRoomData() {
      const response = await getSpareRoomData();
      const data = response.data;

      this.renderSpareBedsChart(data);
      this.renderOccupancyRateFunnel(data);
    },

    renderSpareBedsChart(data) {
      this.$nextTick(() => {
        const chart = echarts.init(this.$refs.spareBedsChart);

        // 获取楼栋和楼层数据
        const buildings = [
          ...new Set(data.map((item) => `Building ${item.buildingId}`)),
        ];
        const floors = [...new Set(data.map((item) => `Floor ${item.floor}`))];

        // 格式化为 3D 图表数据
        const chartData = data.map((item) => [
          buildings.indexOf(`Building ${item.buildingId}`),
          floors.indexOf(`Floor ${item.floor}`),
          item.spareBeds,
        ]);

        chart.setOption({
          tooltip: {
            trigger: "item",
            formatter: (params) => {
              const building = buildings[params.value[0]];
              const floor = floors[params.value[1]];
              const spareBeds = params.value[2];
              return `${building} - ${floor}<br/>Spare Beds: ${spareBeds}`;
            },
          },
          visualMap: {
            right: 10, // 位置调整到右上角
            top: 10,
            min: 0,
            max: Math.max(...data.map((item) => item.spareBeds)),
            dimension: 2,
            inRange: {
              color: ["#99ccff", "#0066ff", "#0033cc"], // 更鲜艳的蓝色渐变
            },
            text: ["More Beds", "Fewer Beds"], // 标签说明
            textStyle: {
              color: "#000", // 黑色文字
            },
          },
          grid3D: {
            viewControl: {
              // 控制视角
              alpha: 40,
              beta: 30,
              distance: 200,
            },
            boxWidth: 100,
            boxDepth: 60,
          },
          xAxis3D: {
            type: "category",
            data: buildings,
            name: "", // 隐藏 X 轴标题
            axisLabel: {
              margin: 8, // 增加标签与轴的距离
              textStyle: {
                color: "#333",
                fontSize: 12,
              },
            },
          },
          yAxis3D: {
            type: "category",
            data: floors,
            name: "", // 隐藏 Y 轴标题
            axisLabel: {
              margin: 8, // 增加标签与轴的距离
              textStyle: {
                color: "#333",
                fontSize: 12,
              },
            },
          },
          zAxis3D: {
            type: "value",
            name: "Spare Beds",
          },
          series: [
            {
              name: "Spare Beds",
              type: "bar3D",
              data: chartData,
              shading: "color",
              itemStyle: {
                opacity: 0.9,
              },
              label: {
                show: false,
                formatter: (params) => {
                  const building = buildings[params.value[0]];
                  const floor = floors[params.value[1]];
                  return `${building}\n${floor}`;
                },
                position: "top", // 标签显示在柱子顶部
                textStyle: {
                  color: "#000",
                  fontSize: 10,
                },
              },
            },
          ],
        });

        this.spareBedsChartInstance = chart;
      });
    },
    // 渲染漏斗图
    renderOccupancyRateFunnel(data) {
      const chart = echarts.init(this.$refs.occupancyRateFunnel);

      // 计算每层入住率并合并相同值
      const rateMap = new Map();
      data.forEach((item) => {
        const occupancyRate = (
          ((item.floorCapacity - item.spareBeds) / item.floorCapacity) *
          100
        ).toFixed(2);

        if (rateMap.has(occupancyRate)) {
          // 如果存在相同入住率，合并楼层信息
          rateMap.set(
            occupancyRate,
            `${rateMap.get(occupancyRate)}, Building ${
              item.buildingId
            } - Floor ${item.floor}`
          );
        } else {
          rateMap.set(
            occupancyRate,
            `Building ${item.buildingId} - Floor ${item.floor}`
          );
        }
      });

      // 将 Map 转换为数组并根据入住率降序排序
      const occupancyRates = Array.from(rateMap.entries())
        .map(([rate, name]) => ({ name, value: parseFloat(rate) }))
        .sort((a, b) => b.value - a.value);

      chart.setOption({
        title: {
          text: "Occupancy Rate by Floor",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}%",
        },
        series: [
          {
            name: "Occupancy Rate",
            type: "funnel",
            left: "10%",
            right: "10%",
            top: "10%",
            bottom: "10%",
            width: "80%",
            min: 0,
            max: 100,
            minSize: "0%",
            maxSize: "100%",
            sort: "descending",
            gap: 2,
            label: {
              show: true,
              position: "inside",
              formatter: "{b}\n{c}%",
            },
            labelLine: {
              length: 10,
              lineStyle: {
                width: 1,
                type: "solid",
              },
            },
            itemStyle: {
              borderColor: "#fff",
              borderWidth: 2,
              color: (params) => {
                const colors = ["#99ccff", "#0066ff", "#0033cc"];
                return colors[params.dataIndex % colors.length];
              },
            },
            data: occupancyRates,
          },
        ],
      });

      this.occupancyFunnelChartInstance = chart;
    },
  },
  mounted() {
    this.fetchBuildings();
    this.fetchSpareRoomData();
  },
  watch: {
    showRepairHistory(newVal) {
      if (!newVal && this.occupancyFunnelChartInstance) {
        this.fetchSpareRoomData(); // 重新渲染漏斗图
      }
    },
  },
};
</script>
  
<style scoped>
/* 样式 */
.controls {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.repair-history-table {
  max-width: 600px;
}

.funnel-chart {
  height: 500px;
}

button {
  margin-left: 10px;
}

/* 设置容器之间的间距 */
div {
  padding: 10px;
}
</style>
  