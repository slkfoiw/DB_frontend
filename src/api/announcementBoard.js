// announcementApi.js
import http from "@/utils/http";

// 获取公告列表
export const fetchAnnouncements = (userid) => {
    // return http({
    //   url: '/announcement/list/${userid}',
    //   method: 'GET'
    // });
    
    return {
        code: "0",
        data: {
            records: [
                { id: 1, title: "宿舍清洁检查通知", content: "请各位同学注意保持宿舍卫生，要有蟑螂了！！！危危危危危危危危危危危危危危危危危危危危危危",  author: "宿管阿姨", date: "2024-10-15", isRead: false },
                { id: 2, title: "停水通知", content: "因管道维护，宿舍楼将在10月16日停水，注意。因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意因管道维护，宿舍楼将在10月16日停水，注意",  author: "宿管阿姨", date: "2024-10-12", isRead: true },
                { id: 3, title: "紧急通知", content: "今天晚上宿舍门禁时间调整至22:30", author: "宿管阿姨", date: "2024-10-10", isRead: false }
            ],
            total: 3
        },
        msg: "Successfully fetched announcements",
    };
};

// 标记公告为已读
export const markRead = (announcementId, userid) => {
    // return http({
    //   url: `/announcement/markRead/${announcementId}/${userid}`,
    //   method: 'POST'
    // });

    return {
        code: "0",
        data: {
            success: true
        },
        msg: "Successfully marked as read",
    };
};

