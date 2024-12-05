// api/dormMaDataAnalysis.js
import http from "@/utils/http"; // 假定你有一个封装好的 http 模块

// 获取宿管统计数据
export const getDormManagerStats = async () => {
  // 示例接口调用（实际情况根据后端接口调整）
  // return http({
  //   url: "/dormManager/get-dorm-manager-stats",
  //   method: "GET",
  //   headers: { "Content-Type": "application/json" },
  // });

  // 模拟数据返回
  return {
    data: [
      { buildingId: "A1", buildingType: "男", managerCount: 2 },
      { buildingId: "B2", buildingType: "女", managerCount: 3 },
      { buildingId: "C3", buildingType: "混合", managerCount: 1 },
    ],
  };
};
