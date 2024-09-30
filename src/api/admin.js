import http from "@/utils/http";

const mockAdmins = [
    { adminId: 'admin01', adminName: '张三', role: '宿舍管理员' },
    { adminId: 'admin02', adminName: '李四', role: '宿舍管理员' },
    { adminId: 'admin03', adminName: '王五', role: '学校管理员' },
    { adminId: 'admin04', adminName: '赵六', role: '学校管理员' },
];

export const getAdmins = () => {
    // return http({
    //     url: 'admin/get-admins',
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    return {
        data: mockAdmins
    };
};

export const addAdmin = (admin) => {
    // return http({
    //     url: 'admin/add-admin',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: admin
    // })
    mockAdmins.push(admin); // 模拟添加
    return { success: true };
};

export const updateAdmin = (admin) => {
    // return http({
    //     url: `admin/update-admin/${admin.adminId}`,
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: admin
    // })
    const index = mockAdmins.findIndex(a => a.adminId === admin.adminId);
    if (index !== -1) {
        mockAdmins[index] = admin; // 模拟更新
    }
    return { success: true };
};

export const deleteAdmin = (adminId) => {
    // return http({
    //     url: `admin/delete-admin/${adminId}`,
    //     method: 'DELETE'
    // })
    const index = mockAdmins.findIndex(a => a.adminId === adminId);
    if (index !== -1) {
        mockAdmins.splice(index, 1); // 模拟删除
    }
    return { success: true };
};
