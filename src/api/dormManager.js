import http from "@/utils/http";

const mockDormManagers = [
    { managerId: '22500002', managerName: '宿管C', dormitoryNumber: '12' },
    { managerId: '22500003', managerName: '宿管B', dormitoryNumber: '13' },
    { managerId: '22500001', managerName: '宿管A', dormitoryNumber: '11' },
    { managerId: '22500004', managerName: '宿管D', dormitoryNumber: '14' },
    { managerId: '22500005', managerName: '宿管E', dormitoryNumber: '15' },
    { managerId: '22500006', managerName: '宿管F', dormitoryNumber: '16' },
    { managerId: '22500007', managerName: '宿管G', dormitoryNumber: '17' },
    { managerId: '22500008', managerName: '宿管H', dormitoryNumber: '18' },
    { managerId: '22500009', managerName: '宿管I', dormitoryNumber: '19' },
    { managerId: '22500010', managerName: '宿管J', dormitoryNumber: '20' },
    { managerId: '22500011', managerName: '宿管K', dormitoryNumber: '21' },
    { managerId: '22500012', managerName: '宿管L', dormitoryNumber: '22' },
];

export const getDormManagers = () => {
    // return http({
    //     url: 'dormManager/get-dorm-managers',
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    return {
        data: mockDormManagers
    };
};

export const addDormManager = (manager) => {
    // return http({
    //     url: 'dormManager/add-dorm-manager',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: manager
    // })
    mockDormManagers.push(manager); // 模拟添加
    console.log(mockDormManagers);
    return { 
        success: true,
        message: '添加成功'
    };
};

export const updateDormManager = (manager) => {
    // return http({
    //     url: `dormManager/update-dorm-manager/${manager.managerId}`,
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: manager
    // })
    const index = mockDormManagers.findIndex(m => m.managerId === manager.managerId);
    if (index !== -1) {
        mockDormManagers[index] = manager; // 模拟更新
    }
    console.log(mockDormManagers);
    return { 
        success: true,
        message: '编辑成功'
    };
};

export const updateAllDormManagers = (data) => {
    // return http({
    //     url: `student/update-all-dorm-managers`,
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: data
    // })
    mockDormManagers = data;
    return { 
        success: true,
        message: '更新成功'
    };
}

export const deleteDormManager = (managerId) => {
    // return http({
    //     url: `dormManager/delete-dorm-manager/${managerId}`,
    //     method: 'DELETE'
    // })
    const index = mockDormManagers.findIndex(m => m.managerId === managerId);
    if (index !== -1) {
        mockDormManagers.splice(index, 1); // 模拟删除
    }
    return { 
        success: true,
        message: '删除成功'
    };;
};

export const checkIfIdExists = (managerId) => {
    // return http({
    //     url: `dormManager/check-if-id-exits/${managerId}`,
    //     method: 'GET'
    // })
    return mockDormManagers.some(m => m.managerId === managerId);
}