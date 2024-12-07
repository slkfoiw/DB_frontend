import http from "@/utils/http";

// 模拟数据
const mockData = [
    { buildingId: "9", buildingType: "男", floor: 1, department: "系 01", studentCount: 15 },
    { buildingId: "9", buildingType: "男", floor: 1, department: "系 02", studentCount: 10 },
    { buildingId: "9", buildingType: "男", floor: 2, department: "系 01", studentCount: 12 },
    { buildingId: "9", buildingType: "男", floor: 2, department: "系 03", studentCount: 8 },
    { buildingId: "13", buildingType: "女", floor: 1, department: "系 01", studentCount: 20 },
    { buildingId: "13", buildingType: "女", floor: 1, department: "系 02", studentCount: 15 },
    { buildingId: "2", buildingType: "混合", floor: 1, department: "系 01", studentCount: 10 },
    { buildingId: "2", buildingType: "混合", floor: 1, department: "系 02", studentCount: 8 },
    { buildingId: "2", buildingType: "混合", floor: 2, department: "系 03", studentCount: 6 },
];

// 获取公寓统计数据
// [
//     { buildingId: "1A", buildingType: "男", studentCount: 45 },
//     { buildingId: "2B", buildingType: "女", studentCount: 35 },
//     { buildingId: "3C", buildingType: "混合", studentCount: 31 }
// ]
export const getBuildingStats = () => {
    // 实际后端调用代码
    return http({
        url: '/student/building-stats',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // 模拟数据返回
    const aggregatedData = mockData.reduce((result, item) => {
        const key = `${item.buildingId}-${item.buildingType}`;
        if (!result[key]) {
            result[key] = { buildingId: item.buildingId, buildingType: item.buildingType, studentCount: 0 };
        }
        result[key].studentCount += item.studentCount;
        return result;
    }, {});

    return {
        data: Object.values(aggregatedData)
    };
};

// 获取按系号钻取数据
// payload（对象），包含以下字段：
// buildingId：公寓楼编号。
// drillBy：钻取维度（"department"）
// 假设输入参数为 { buildingId: "9", drillBy: "department" }：
// [
//     { department: "系 01", studentCount: 27 },
//     { department: "系 02", studentCount: 10 },
//     { department: "系 03", studentCount: 8 }
// ]
export const getBuildingDrilldown = (payload) => {
    const { buildingId, drillBy } = payload;

    // 实际后端调用代码（注释掉，适配模拟数据）
    return http({
        url: '/student/building-drilldown',
        method: 'POST',
        data: payload,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // 模拟数据返回
    const filteredData = mockData.filter((item) => item.buildingId === buildingId);
    const groupedData = filteredData.reduce((result, item) => {
        const key = item[drillBy];
        if (!result[key]) {
            result[key] = { [drillBy]: key, studentCount: 0 };
        }
        result[key].studentCount += item.studentCount;
        return result;
    }, {});

    return {
        data: Object.values(groupedData)
    };
};

// 获取按楼层钻取数据
// payload（对象），包含以下字段：
// buildingId：公寓楼编号。
// filterBy：过滤条件（"department"）。
// value：过滤条件对应的值（如"系 01"）。
// 假设输入参数为 { buildingId: "1A", filterBy: "department", value: "系 01" }：
// [
//     { floor: 1, studentCount: 25 },
//     { floor: 2, studentCount: 20 }
// ]
export const getBuildingFloorDrilldown = (payload) => {
    const { buildingId, filterBy, value } = payload;

    // 实际后端调用代码（注释掉，适配模拟数据）
    return http({
        url: '/student/building-floor-drilldown',
        method: 'POST',
        data: payload,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // 模拟数据返回
    const filteredData = mockData.filter(
        (item) => item.buildingId === buildingId && item[filterBy] === value
    );
    const groupedData = filteredData.reduce((result, item) => {
        const key = item.floor;
        if (!result[key]) {
            result[key] = { floor: key, studentCount: 0 };
        }
        result[key].studentCount += item.studentCount;
        return result;
    }, {});

    return {
        data: Object.values(groupedData)
    };
};
