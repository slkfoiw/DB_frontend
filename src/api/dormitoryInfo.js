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
        {pattern: /^[0-9]{1,2}$/, message: "范围：1-99", trigger: "blur"},
    ],
    address: [
        {required: true, message: "请输入楼宇地址", trigger: "blur"},
    ],
};

export const getDormBuilds = ({pageNum, pageSize, search}) => {
    return http({
        url: '/dorm/get-dorms',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            pageNum,
            pageSize,
            search  
        }
    })
    return {
        data: [...mockbuildingInfos]
    };
};

export const addDormBuild = (buildingInfo) => {
    return http({
        url: '/dorm/add-dorm',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: buildingInfo
    })
    mockbuildingInfos.push(buildingInfo); // 模拟添加
    console.log(mockbuildingInfos);
    return { 
        success: true,
        message: '添加成功'
    };
};

export const updateDormBuild = ({oldDormId, dorm}) => {
    return http({
        url: `/dorm/update-dorm/${oldDormId}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        data: dorm
    })
    // const id = mockbuildingInfos.findIndex(s => s.dormId === buildingInfo.dormId);
    // if (id !== -1) {
    //     mockbuildingInfos[id] = buildingInfo; // 模拟更新
    // }
    // return { 
    //     success: true,
    //     message: '编辑成功'
    // };
};

export const deleteDormBuild = (dormId) => {
    return http({
        url: `/dorm/delete-dorm/${dormId}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    mockbuildingInfos = mockbuildingInfos.filter(r => r.dormId !== dormId); // 模拟删除
    console.log(mockbuildingInfos);
    return { 
        success: true,
        message: '删除成功'
    };
};