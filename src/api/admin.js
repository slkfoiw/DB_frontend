import http from "@/utils/http";

const mockAdmins = [
    { adminId: 'admin01', adminName: '张三', role: '宿舍管理员' },
    { adminId: 'admin02', adminName: '李四', role: '宿舍管理员' },
    { adminId: 'admin03', adminName: '王五', role: '学校管理员' },
    { adminId: 'admin04', adminName: '赵六', role: '学校管理员' },
];

const mockAnnouncements = [
    { id: 1, releaseTime: new Date().toLocaleString(), title: '第一条公告', publisher: '张三', content: '这是第一条公告', recipient: '全体' },
    { id: 2, releaseTime: new Date(Date.now() - 86400000).toLocaleString(), title: '第二条公告', publisher: '李四', content: '这是第二条公告', recipient: '所有宿管' },
    { id: 3, releaseTime: new Date(Date.now() - 172800000).toLocaleString(), title: '第二条公告', publisher: '王五', content: '这是第三条公告', recipient: '所有学生' },
    { id: 4, releaseTime: new Date(Date.now() - 259200000).toLocaleString(), title: '第四条公告', publisher: '赵六', content: '这是第四条公告', recipient: '全体' },
    { id: 5, releaseTime: new Date(Date.now() - 345600000).toLocaleString(), title: '第五条公告', publisher: '张三', content: '这是第五条公告', recipient: '全体' },
    { id: 6, releaseTime: new Date(Date.now() - 432000000).toLocaleString(), title: '第六条公告', publisher: '李四', content: '这是第六条公告', recipient: '全体' },
    { id: 7, releaseTime: new Date(Date.now() - 518400000).toLocaleString(), title: '第七条公告', publisher: '王五', content: '这是第七条公告', recipient: '全体' },
    { id: 8, releaseTime: new Date(Date.now() - 604800000).toLocaleString(), title: '第八条公告', publisher: '赵六', content: '这是第八条公告', recipient: '全体' },
    { id: 9, releaseTime: new Date(Date.now() - 691200000).toLocaleString(), title: '第九条公告', publisher: '张三', content: '这是第九条公告', recipient: '全体' },
    { id: 10, releaseTime: new Date(Date.now() - 777600000).toLocaleString(), title: '第十条公告', publisher: '李四', content: '这是第十条公告', recipient: '全体' },
    { id: 11, releaseTime: new Date(Date.now() - 864000000).toLocaleString(), title: '第十一条公告', publisher: '王五', content: '这是第十一条公告', recipient: '全体' },
    { id: 12, releaseTime: new Date(Date.now() - 950400000).toLocaleString(), title: '第十二条公告', publisher: '赵六', content: '这是第十二条公告', recipient: '全体' },
    { id: 13, releaseTime: new Date(Date.now() - 1036800000).toLocaleString(), title: '第十三条公告', publisher: '张三', content: '这是第十三条公告', recipient: '全体' }
];

const mockRepairs = [
    { id: 1, date: new Date().toLocaleString(), type: '管道漏水', dormitoryNumber: '12', roomNumber: '101', status: '未完成' },
    { id: 2, date: new Date(Date.now() - 86400000).toLocaleString(), type: '电路故障', dormitoryNumber: '4', roomNumber: '102', status: '已完成' },
    { id: 3, date: new Date(Date.now() - 172800000).toLocaleString(), type: '门锁问题', dormitoryNumber: '13', roomNumber: '103', status: '未完成' },
];

const mockChangeRoom = [
    { id: 1, studentId: '1234567', curDormId: '12', curRoomId: '101', curBedId: '1', toDormId: '13', toRoomId: '102', toBedId: '2', status: '通过', createDate: new Date().toLocaleString(), finishDate: new Date().toLocaleString() },
    { id: 2, studentId: '1234568', curDormId: '12', curRoomId: '102', curBedId: '2', toDormId: '13', toRoomId: '103', toBedId: '3', status: '驳回', createDate: new Date().toLocaleString(), finishDate: new Date().toLocaleString() },
    { id: 3, studentId: '1234569', curDormId: '12', curRoomId: '103', curBedId: '3', toDormId: '13', toRoomId: '104', toBedId: '4', status: '未处理', createDate: new Date().toLocaleString(), finishDate: null },
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
        data: [...mockAdmins]
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
    return { 
        success: true,
        message: '添加成功'
    };
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
    const id = mockAdmins.findIndex(a => a.adminId === admin.adminId);
    if (id !== -1) {
        mockAdmins[id] = admin; // 模拟更新
    }
    return { 
        success: true,
        message: '更新成功'
    };
};

export const deleteAdmin = (adminId) => {
    // return http({
    //     url: `admin/delete-admin/${adminId}`,
    //     method: 'DELETE'
    // })
    const id = mockAdmins.findIndex(a => a.adminId === adminId);
    if (id !== -1) {
        mockAdmins.splice(id, 1); // 模拟删除
    }
    return { 
        success: true,
        message: '删除成功'
    };
};

export const getAnnouncements = ({pageNum, pageSize, search, sortField, sortOrder}) => {
    return http({
        url: '/announcement/get-announcements',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            pageNum,
            pageSize,
            search,
            sortField,
            sortOrder
        }
    })
    return {
        data: [...mockAnnouncements]
    };
};

export const addAnnouncement = (announcement) => {
    return http({
        url: '/announcement/add-announcement',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: announcement
    })
    const newId = mockAnnouncements.length ? Math.max(mockAnnouncements.map(n => n.id)) + 1 : 1;
    mockAnnouncements.push({ ...announcement.value, id: newId, date: new Date() });
    return { 
        success: true,
        message: '添加成功'
    };
};

export const updateAnnouncement = (announcement) => {
    return http({
        url: `/announcement/update-announcement/${announcement.id}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        data: announcement
    })
    const id = mockAnnouncements.findIndex(n => n.id === announcement.id);
    if (id !== -1) {
        mockAnnouncements[id] = announcement; // 模拟更新
    }
    return { 
        success: true,
        message: '更新成功'
    };
};

export const deleteAnnouncement = (announcementId) => {
    return http({
        url: `/announcement/delete-announcement/${announcementId}`,
        method: 'DELETE'
    })
    const id = mockAnnouncements.findIndex(n => n.id === announcementId);
    if (id !== -1) {
        mockAnnouncements.splice(id, 1); // 模拟删除
    }
    return { 
        success: true,
        message: '删除成功'
    };
};

export const getChangeRoom = ({pageNum, pageSize, search, sortField, sortOrder}) => {
    return http({
        url: '/adjustRoom/get-change-room',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            pageNum,
            pageSize,
            search,
            sortField,
            sortOrder
        }
    })
    return {
        data: [...mockChangeRoom]
    };
};

export const updateChangeRoom = (changeRoom) => {
    return http({
        url: '/adjustRoom/update-change-room',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        data: changeRoom
    })
    const id = mockChangeRoom.findIndex(c => c.id === changeRoom.id);
    if (id !== -1) {
        mockChangeRoom[id] = changeRoom; // 模拟更新
    }
    return { 
        success: true,
        message: '更新成功'
    };
};

export const deleteChangeRoom = (changeRoomId) => {
    return http({
        url: `/adjustRoom/delete-change-room/${changeRoomId}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    const id = mockChangeRoom.findIndex(c => c.id === changeRoomId);
    if (id !== -1) {
        mockChangeRoom.splice(id, 1); // 模拟删除
    }
    return { 
        success: true,
        message: '删除成功'
    };
}

export const getRepairs = ({pageNum, pageSize, search, sortField, sortOrder}) => {
    return http({
        url: '/repair/get-repairs',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            pageNum,
            pageSize,
            search,
            sortField,
            sortOrder
        }
    })
    return {
        data: [...mockRepairs]
    };
};

export const addRepair = async (repair) => {
    return http({
        url: '/repair/add-repair',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: repair
    })
    const newId = mockRepairs.length ? Math.max(mockRepairs.map(r => r.id)) + 1 : 1;
    mockRepairs.push({ ...repair, id: newId, date: new Date().toLocaleString() }); 
    return { 
        success: true,
        message: '添加成功'
    };
}

export const updateRepair = async (repair) => {
    return http({
        url: '/repair/update-repair',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        data: repair
    })
    const id = mockRepairs.findIndex(r => r.id === repair.id);
    if (id !== -1) {
        mockRepairs[id] = repair; // 更新报修状态
    }
    return { 
        success: true,
        message: '更新成功'
    };
};

export const deleteRepair = async (repairId) => {
    return http({
        url: `/repair/delete-repair/${repairId}`,
        method: 'DELETE'
    })
    const id = mockRepairs.findIndex(r => r.id === repairId);
    if (id !== -1) {
        mockRepairs.splice(id, 1); // 模拟删除
    }
    return { 
        success: true,
        message: '删除成功'
    };
};

export const sendAnnouncementApi = async (announcement) => {
    // return http({
    //     url: 'admin/send-announcement',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: announcement
    // })
    
    // 模拟发送公告
    const newId = mockAnnouncements.length ? Math.max(mockAnnouncements.map(n => n.id)) + 1 : 1;
    // 将公告的发布时间设置为当前时间
    const newAnnouncement = { ...announcement, id: newId, date: new Date() }; 
    mockAnnouncements.push(newAnnouncement);
    return { 
        success: true,
        message: '发送成功'
    };
};