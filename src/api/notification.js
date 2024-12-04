let mockNotifications = [
    { sender: "宿管", type: "公告", date: "2024-12-01", status: "未读" },
    { sender: "系统管理员", type: "报修", date: "2024-12-01", status: "未读" },
    { sender: "学生", type: "调宿申请", date: "2024-11-30", status: "已读" },
];

export const getNotifications = () => {
    // return http({
    //     url: 'notifications',
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // });
    return { data: [...mockNotifications] }; // 模拟数据
};

export const markAsRead = (id) => {
    // return http({
    //     url: `notifications/mark-as-read/${id}`,
    //     method: 'PUT',
    // });
    if (mockNotifications[id]) {
        mockNotifications[id].status = "已读"; // 模拟标记已读
    }
    return { success: true, message: "消息已标记为已读" };
};
