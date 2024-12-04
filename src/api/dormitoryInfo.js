import http from "@/utils/http";

let mockbuildingInfos = [
    { dormId: '01', address: '校内', dormBuildDetail: '男宿舍'},
    { dormId: '02', address: '校内', dormBuildDetail: '男宿舍'},
    { dormId: '03', address: '校内', dormBuildDetail: '男宿舍'},
    { dormId: '04', address: '校内', dormBuildDetail: '男宿舍'},
    { dormId: '05', address: '校内', dormBuildDetail: '男宿舍'},
    { dormId: '06', address: '校内', dormBuildDetail: '男宿舍'},
    { dormId: '07', address: '校内', dormBuildDetail: '男宿舍'},
    { dormId: '08', address: '校外', dormBuildDetail: '男宿舍'},
    { dormId: '09', address: '校外', dormBuildDetail: '男宿舍'},
    { dormId: '10', address: '校外', dormBuildDetail: '男宿舍'},
    { dormId: '11', address: '校外', dormBuildDetail: '女宿舍'},
    { dormId: '12', address: '北区', dormBuildDetail: '女宿舍'},
    { dormId: '13', address: '北区', dormBuildDetail: '女宿舍'},
    { dormId: '14', address: '北区', dormBuildDetail: '女宿舍'},
    { dormId: '15', address: '北区', dormBuildDetail: '女宿舍'},
    { dormId: '16', address: '北区', dormBuildDetail: '女宿舍'},
    { dormId: '17', address: '校外', dormBuildDetail: '女宿舍'},
    { dormId: '18', address: '校外', dormBuildDetail: '女宿舍'},
    { dormId: '19', address: '校外', dormBuildDetail: '女宿舍'},
    { dormId: '20', address: '校外', dormBuildDetail: '女宿舍'},
    { dormId: '21', address: '校外', dormBuildDetail: '女宿舍'},
];

export const rules = {
    dormId: [
        {required: true, message: "请输入楼宇号", trigger: "blur"},
        {pattern: /^[0-9]{2}$/, message: "范围：01-99", trigger: "blur"},
    ],
    address: [
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
    //     url: `buildingInfo/update-building-info/${buildingInfo.dormId}`,
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: buildingInfo
    // })
    const id = mockbuildingInfos.findIndex(s => s.dormId === buildingInfo.dormId);
    if (id !== -1) {
        mockbuildingInfos[id] = buildingInfo; // 模拟更新
    }
    return { 
        success: true,
        message: '编辑成功'
    };
};

export const deleteDormBuild = (dormId) => {
    // return http({
    //     url: `buildingInfo/delete-building-info/${dormId}`,
    //     method: 'DELETE',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    mockbuildingInfos = mockbuildingInfos.filter(r => r.dormId !== dormId); // 模拟删除
    console.log(mockbuildingInfos);
    return { 
        success: true,
        message: '删除成功'
    };
};