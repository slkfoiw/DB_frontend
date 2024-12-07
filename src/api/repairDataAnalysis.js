import http from "@/utils/http";

// 模拟数据
const mockData = [
    { buildingId: "1A", type: "电器", createMonth: "2024-06", count: 5, status: "已处理" },
    { buildingId: "1A", type: "家具", createMonth: "2024-08", count: 3, status: "未处理" },
    { buildingId: "2B", type: "管道", createMonth: "2024-10", count: 8, status: "已处理" },
    { buildingId: "2B", type: "电器", createMonth: "2024-11", count: 7, status: "未处理" },
    { buildingId: "3C", type: "电器", createMonth: "2024-11", count: 4, status: "已处理" },
    { buildingId: "3C", type: "家具", createMonth: "2024-12", count: 6, status: "未处理" },
    { buildingId: "3C", type: "管道", createMonth: "2024-12", count: 10, status: "已处理" },
    { buildingId: "1A", type: "管道", createMonth: "2024-09", count: 8, status: "已处理" },
    { buildingId: "2B", type: "家具", createMonth: "2024-06", count: 5, status: "未处理" },
    { buildingId: "2B", type: "电器", createMonth: "2024-08", count: 6, status: "已处理" },
    { buildingId: "3C", type: "电器", createMonth: "2024-09", count: 15, status: "未处理" },
];

// 获取报修处理状态统计
// 返回示例：
// { processedCount: 27, unprocessedCount: 31 }
export const getRepairStatusStats = async () => {
    // 实际后端调用代码
    return http({
        url: '/repair/status-stats',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    // 模拟数据返回
    const processedCount = mockData.filter((item) => item.status === "已处理").reduce((sum, item) => sum + item.count, 0);
    const unprocessedCount = mockData.filter((item) => item.status === "未处理").reduce((sum, item) => sum + item.count, 0);

    return {
        processedCount,
        unprocessedCount,
    };
};

// 获取不同月份报修数量趋势（每个类型一条线）
// 返回示例：
// [
//     { month: "2024-06", type: "电器", count: 5 },
//     { month: "2024-06", type: "家具", count: 5 },
// ] 
// 注意一定要按照时间顺序返回，每个月份都至少有一个类型，count可以为0.前端表格按照返回数据的顺序展示
export const getRepairTrendStats = async () => {
    // 实际后端调用代码
    return http({
        url: '/repair/trend-stats',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    // 模拟数据返回
    const groupedData = mockData.reduce((result, item) => {
        const key = `${item.createMonth}-${item.type}`;
        if (!result[key]) {
            result[key] = { month: item.createMonth, type: item.type, count: 0 };
        }
        result[key].count += item.count;
        return result;
    }, {});

    return {
        data: Object.values(groupedData),
    };
};

// 获取按报修类型统计的公寓楼数据（堆叠柱状图）
// 返回示例：
// [
//     { buildingId: "1A", type: "电器", count: 12 },
//     { buildingId: "1A", type: "家具", count: 8 },
//     { buildingId: "2B", type: "管道", count: 20 },
//     { buildingId: "3C", type: "电器", count: 25 },
// ]

export const getRepairTypeStatsByBuilding = async () => {
    // 实际后端调用代码
    return http({
        url: '/repair/type-stats',
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    // 模拟数据返回
    const groupedData = mockData.reduce((result, item) => {
        const key = `${item.buildingId}-${item.type}`;
        if (!result[key]) {
            result[key] = { buildingId: item.buildingId, type: item.type, count: 0 };
        }
        result[key].count += item.count;
        return result;
    }, {});

    return {
        data: Object.values(groupedData),
    };
};


