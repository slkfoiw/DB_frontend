import http from "@/utils/http";

const mockAdmins = [
    { adminId: 'admin01', adminName: '张三', role: '宿舍管理员' },
    { adminId: 'admin02', adminName: '李四', role: '宿舍管理员' },
    { adminId: 'admin03', adminName: '王五', role: '学校管理员' },
    { adminId: 'admin04', adminName: '赵六', role: '学校管理员' },
];

const mockNotices = [
    { id: 1, date: new Date(), title: '第一条公告', publisher: '张三', content: '这是第一条公告' },
    { id: 2, date: new Date(Date.now() - 86400000), title: '第二条公告', publisher: '李四', content: '这是第二条公告' },
    { id: 3, date: new Date(Date.now() - 172800000), title: '第二条公告', publisher: '王五', content: '这是第三条公告' },
    { id: 4, date: new Date(Date.now() - 259200000), title: '第四条公告', publisher: '赵六', content: '这是第四条公告' },
    { id: 5, date: new Date(Date.now() - 345600000), title: '第五条公告', publisher: '张三', content: '这是第五条公告' },
    { id: 6, date: new Date(Date.now() - 432000000), title: '第六条公告', publisher: '李四', content: '这是第六条公告' },
    { id: 7, date: new Date(Date.now() - 518400000), title: '第七条公告', publisher: '王五', content: '这是第七条公告' },
    { id: 8, date: new Date(Date.now() - 604800000), title: '第八条公告', publisher: '赵六', content: '这是第八条公告' },
    { id: 9, date: new Date(Date.now() - 691200000), title: '第九条公告', publisher: '张三', content: '这是第九条公告' },
    { id: 10, date: new Date(Date.now() - 777600000), title: '第十条公告', publisher: '李四', content: '这是第十条公告' },
    { id: 11, date: new Date(Date.now() - 864000000), title: '第十一条公告', publisher: '王五', content: '这是第十一条公告' },
    { id: 12, date: new Date(Date.now() - 950400000), title: '第十二条公告', publisher: '赵六', content: '这是第十二条公告' },
    { id: 13, date: new Date(Date.now() - 1036800000), title: '第十三条公告', publisher: '张三', content: '这是第十三条公告' }
];

const mockRepairs = [
    { id: 1, date: new Date(), type: '管道漏水', apartmentNumber: '12', dormitoryNumber: '101', status: '未完成' },
    { id: 2, date: new Date(Date.now() - 86400000), type: '电路故障', apartmentNumber: '4', dormitoryNumber: '102', status: '已完成' },
    { id: 3, date: new Date(Date.now() - 172800000), type: '门锁问题', apartmentNumber: '13', dormitoryNumber: '103', status: '未完成' },
    // ... 其他报修数据
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

export const getNotices = () => {
    // return http({
    //     url: 'admin/get-notices',
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    return {
        data: mockNotices
    };
};

export const addNotice = (notice) => {
    // return http({
    //     url: 'admin/add-notice',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: notice
    // })
    const newId = mockNotices.length ? Math.max(mockNotices.map(n => n.id)) + 1 : 1;
    mockNotices.push({ ...form.value, id: newId, date: new Date() }); 
    return { success: true };
};

export const updateNotice = (notice) => {
    // return http({
    //     url: `admin/update-notice/${notice.id}`,
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: notice
    // })
    const index = mockNotices.findIndex(n => n.id === notice.id);
    if (index !== -1) {
        mockNotices[index] = notice; // 模拟更新
    }
    return { success: true };
};

export const deleteNotice = (noticeId) => {
    // return http({
    //     url: `admin/delete-notice/${noticeId}`,
    //     method: 'DELETE'
    // })
    const index = mockNotices.findIndex(n => n.id === noticeId);
    if (index !== -1) {
        mockNotices.splice(index, 1); // 模拟删除
    }
    return { success: true };
};

export const getRepairs = () => {
    // return http({
    //     url: 'admin/get-repairs',
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    return {
        data: mockRepairs
    };
};

export const updateRepairStatus = async (repairId, newStatus) => {
    const index = mockRepairs.findIndex(r => r.id === repairId);
    if (index !== -1) {
        mockRepairs[index].status = newStatus.status; // 更新报修状态
    }
    return { success: true };
};