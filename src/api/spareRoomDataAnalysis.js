import http from "@/utils/http";

const mockSpareRoomData = [
    { buildingId: "11", floor: 1, spareBeds: 4, floorCapacity: 30 },
    { buildingId: "11", floor: 2, spareBeds: 6, floorCapacity: 30 },
    { buildingId: "12", floor: 1, spareBeds: 25, floorCapacity: 25 },
    { buildingId: "12", floor: 3, spareBeds: 15, floorCapacity: 20 },
    { buildingId: "13", floor: 1, spareBeds: 0, floorCapacity: 35 },
    { buildingId: "13", floor: 2, spareBeds: 0, floorCapacity: 35 },
];

const mockRepairHistoryData = [
    { buildingId: "11", roomId: "101", type: "电器", count: 2 },
    { buildingId: "11", roomId: "201", type: "家具", count: 1 },
    { buildingId: "12", roomId: "101", type: "管道", count: 3 },
    { buildingId: "12", roomId: "301", type: "电器", count: 1 },
];

// 获取所有房间信息（包含每层容量、空床位等）
export const getSpareRoomData = async () => {
    // 实际api
    return http({
        url: "/room/data",
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    // 模拟直接返回完整数据
    return {
        data: mockSpareRoomData, // 返回完整数据
    };
};

// 获取空宿舍的报修历史数据
// BuildingId: 11
// [
//     { "roomId": "101", "type": "电器", "count": 2 },
//     { "roomId": "201", "type": "家具", "count": 1 }
// ]
export const getEmptyRoomRepairHistory = async (buildingId) => {
    // 实际api
    return http({
        url: `/room/repair-history?buildingId=${buildingId}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    // 模拟从后端获取指定楼栋的空宿舍报修历史
    const data = mockRepairHistoryData
        .filter((item) => item.buildingId === buildingId)
        .map((item) => ({
            roomId: item.roomId,
            type: item.type,
            count: item.count,
        }));

    return {
        data,
    };
};


