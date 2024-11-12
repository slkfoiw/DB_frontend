import http from "@/utils/http";

let mockbuildingInfos = [
    { dormBuildId: '01', dormBuildAddr: '校内', dormBuildDetail: '男宿舍'},
    { dormBuildId: '02', dormBuildAddr: '校内', dormBuildDetail: '男宿舍'},
    { dormBuildId: '03', dormBuildAddr: '校内', dormBuildDetail: '男宿舍'},
    { dormBuildId: '04', dormBuildAddr: '校内', dormBuildDetail: '男宿舍'},
    { dormBuildId: '05', dormBuildAddr: '校内', dormBuildDetail: '男宿舍'},
    { dormBuildId: '06', dormBuildAddr: '校内', dormBuildDetail: '男宿舍'},
    { dormBuildId: '07', dormBuildAddr: '校内', dormBuildDetail: '男宿舍'},
    { dormBuildId: '08', dormBuildAddr: '校外', dormBuildDetail: '男宿舍'},
    { dormBuildId: '09', dormBuildAddr: '校外', dormBuildDetail: '男宿舍'},
    { dormBuildId: '10', dormBuildAddr: '校外', dormBuildDetail: '男宿舍'},
    { dormBuildId: '11', dormBuildAddr: '校外', dormBuildDetail: '女宿舍'},
    { dormBuildId: '12', dormBuildAddr: '北区', dormBuildDetail: '女宿舍'},
    { dormBuildId: '13', dormBuildAddr: '北区', dormBuildDetail: '女宿舍'},
    { dormBuildId: '14', dormBuildAddr: '北区', dormBuildDetail: '女宿舍'},
    { dormBuildId: '15', dormBuildAddr: '北区', dormBuildDetail: '女宿舍'},
    { dormBuildId: '16', dormBuildAddr: '北区', dormBuildDetail: '女宿舍'},
    { dormBuildId: '17', dormBuildAddr: '校外', dormBuildDetail: '女宿舍'},
    { dormBuildId: '18', dormBuildAddr: '校外', dormBuildDetail: '女宿舍'},
    { dormBuildId: '19', dormBuildAddr: '校外', dormBuildDetail: '女宿舍'},
    { dormBuildId: '20', dormBuildAddr: '校外', dormBuildDetail: '女宿舍'},
    { dormBuildId: '21', dormBuildAddr: '校外', dormBuildDetail: '女宿舍'},
];

export const rules = {
    dormBuildId: [
        {required: true, message: "请输入楼宇号", trigger: "blur"},
        {pattern: /^[0-9]{2}$/, message: "范围：01-99", trigger: "blur"},
    ],
    dormBuildAddr: [
        {required: true, message: "请输入楼宇地址", trigger: "blur"},
    ],
    dormBuildDetail: [
        {required: true, message: "请输入楼宇详情", trigger: "blur"},
    ],
};

export const getDormBuilds = () => {
    // return http({
    //     url: 'buildingInfo/get-building-info',
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    return {
        data: [...mockbuildingInfos]
    };
};

export const addDormBuild = (buildingInfo) => {
    // return http({
    //     url: 'buildingInfo/add-building-info',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: buildingInfo
    // })
    mockbuildingInfos.push(buildingInfo); // 模拟添加
    console.log(mockbuildingInfos);
    return { 
        success: true,
        message: '添加成功'
    };
};

export const updateDormBuild = (buildingInfo) => {
    // return http({
    //     url: `buildingInfo/update-building-info/${buildingInfo.dormBuildId}`,
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: buildingInfo
    // })
    const index = mockbuildingInfos.findIndex(s => s.dormBuildId === buildingInfo.dormBuildId);
    if (index !== -1) {
        mockbuildingInfos[index] = buildingInfo; // 模拟更新
    }
    return { 
        success: true,
        message: '编辑成功'
    };
};

export const deleteDormBuild = (dormBuildId) => {
    // return http({
    //     url: `buildingInfo/delete-building-info/${dormBuildId}`,
    //     method: 'DELETE',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    mockbuildingInfos = mockbuildingInfos.filter(r => r.dormBuildId !== dormBuildId); // 模拟删除
    console.log(mockbuildingInfos);
    return { 
        success: true,
        message: '删除成功'
    };
};