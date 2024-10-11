<template>
    <div id="echarts-dom" style="width: 650px;height: 500px;"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import http from "@/utils/http";

http("echarts/theme/macarons");

const option = ref({
    barWidth: 20,
    tooltip: {},
    xAxis: {
        data: []
    },
    yAxis: {
        type: "value"
    },
    series: [
        {
            name: '人数',
            type: 'bar',
            data: []
        },
    ],
    grid: {
        x: 40,
        y: 40,
        x2: 40,
        y2: 40,
        borderWidth: 10,
        top: '10%',
        bottom: '0%',
        containLabel: true
    }
});

let myEcharts;

const createEcharts = () => {
    const chartDom = document.getElementById("echarts-dom");
    myEcharts = echarts.init(chartDom, null);
    myEcharts.setOption(option.value, true);
};

const getBuildingNum = async () => {
    // const res = await request.get("/dorm/getDormName");
    const res = {
        success: true,
        data: [
            {name: "1号楼", num: 20},
            {name: "2号楼", num: 30},
            {name: "3号楼", num: 40},
            {name: "4号楼", num: 50},
            {name: "5号楼", num: 60},
            {name: "6号楼", num: 70},
            {name: "7号楼", num: 80},
            {name: "8号楼", num: 90},
            {name: "9号楼", num: 100},
            {name: "10号楼", num: 110},
            {name: "11号楼", num: 120},
            {name: "12号楼", num: 130},
            {name: "13号楼", num: 140},
            {name: "14号楼", num: 150},
            {name: "15号楼", num: 160},
            {name: "16号楼", num: 170},
        ]
    }
    if (res.success) {
        const data = res.data;
        const xAxisData = [];
        const seriesData = [];
        data.forEach(item => {
            xAxisData.push(item.name);
            seriesData.push(item.num);
        });
        option.value.xAxis.data = xAxisData;
        option.value.series[0].data = seriesData;
    }
};

// 创建图表
onMounted(() => {
    getBuildingNum();
    createEcharts();
});

// 观察 option 的变化
watch(option, (newVal, oldVal) => {
    if (myEcharts) {
        if (newVal) {
            myEcharts.setOption(newVal);
        } else {
            myEcharts.setOption(oldVal);
        }
    } else {
        createEcharts();
    }
}, { deep: true });
</script>

<style scoped>
/* 这里可以添加样式 */
</style>