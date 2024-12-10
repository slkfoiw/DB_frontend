import http from '@/utils/http';

// 获取维修记录
export const getRepairRecords = (params) => {
    return http({
      url: `/repair/find/${params.studentId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize,
        search: params.search,
        sortField: params.sortField,
        sortOrder: params.sortOrder
      }
    });
  };
  
  // 新增维修记录
  export const addRepair = (form) => {
    return http({
      url: '/repair/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: form
    });
  };
  