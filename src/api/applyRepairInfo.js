// 获取维修记录
export const getRepairRecords = (params) => {
    // return request({
    //   url: `/repair/find/${params.userId}`,
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   data: {
    //     pageNum: params.pageNum,
    //     pageSize: params.pageSize,
    //     search: params.search,
    //   }
    // });
  
    // 模拟数据
    return {
      data: {
        records: [
            { index: 1, title: "修理记录1", content:"张田中掉在下水道里了", dormBuildId: 13, dormRoomId: 257, repairer: "樊孜昱", state: "未完成", orderBuildTime: "2021-07-01 12:00:00", orderFinishTime: "2021-07-02 12:00:00" },
            { index: 2, title: "修理记录2", content:"多栋把马桶拉堵了",dormBuildId: 13, dormRoomId: 256, repairer: "辛卓妍", state: "完成", orderBuildTime: "2021-07-01 12:00:00", orderFinishTime: "2021-07-02 12:00:00" },
        ],
        total: 2,
      }
    };
  };
  
  // 新增维修记录
  export const addRepair = (form) => {
    // return request({
    //   url: '/repair/add',
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   data: form
    // });
  
    // 模拟数据
    return {
      data: {
        code: "0",
        msg: "新增成功"
      }
    };
  };
  