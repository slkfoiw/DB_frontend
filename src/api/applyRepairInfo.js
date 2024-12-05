// 获取维修记录
export const getRepairRecords = (params) => {
    // return request({
    //   url: `/repair/find`,
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
            { id: 1, title: "修理记录1", content:"张田中掉在下水道里了", dormId: 13, roomId: 257, repairer: "樊孜昱", status: "未完成", createDate: "2021-07-01 12:00:00", finishDate: "2021-07-02 12:00:00" },
            { id: 2, title: "修理记录2", content:"多栋把马桶拉堵了",dormId: 13,roomId: 256, repairer: "辛卓妍", status: "完成", createDate: "2021-07-01 12:00:00", finishDate: "2021-07-02 12:00:00" },
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
        code: "0",
        msg: "新增成功"
    };
  };
  