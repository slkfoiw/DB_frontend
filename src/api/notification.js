import http from "@/utils/http";

let mockNotifications = [
    { id: 1, sender: "宿管", type: "公告", date: "2024-12-01", status: "未读" },
    { id: 2, sender: "系统管理员", type: "报修", date: "2024-12-01", status: "未读" },
    { id: 3, sender: "学生", type: "调宿申请", date: "2024-11-30", status: "已读" },
];

export const getNotifications = () => {
    return http({
        url: '/notification/get',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return { data: [...mockNotifications] }; // 模拟数据
};

export const markAsRead = (id) => {
    return http({
        url: `/notification/mark-as-read/${id}`,
        method: 'PUT',
    });
    if (mockNotifications[id]) {
        mockNotifications[id].status = "已读"; // 模拟标记已读
    }
    return { success: true, message: "消息已标记为已读" };
};
