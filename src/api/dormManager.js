import http from "@/utils/http";

const mockDormManagers = [
    { managerId: 'mgr01', managerName: '宿管A', apartmentNumber: '11' },
    { managerId: 'mgr02', managerName: '宿管B', apartmentNumber: '12' },
    { managerId: 'mgr03', managerName: '宿管C', apartmentNumber: '13' },
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
    return { success: true };
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
    return { success: true };
};

export const deleteDormManager = (managerId) => {
    // return http({
    //     url: `dormManager/delete-dorm-manager/${managerId}`,
    //     method: 'DELETE'
    // })
    const index = mockDormManagers.findIndex(m => m.managerId === managerId);
    if (index !== -1) {
        mockDormManagers.splice(index, 1); // 模拟删除
    }
    return { success: true };
};
