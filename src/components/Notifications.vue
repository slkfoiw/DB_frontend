<template>
    <el-breadcrumb separator-icon="ArrowRight" style="margin: 16px">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>我的消息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="hover" class="notification-card">
        <div class="card-header">
            <el-icon size="30">
                <message />
            </el-icon>
            <h2>消息管理</h2>
        </div>
        <el-table :data="notifications" style="width: 100%;" class="custom-table">
            <el-table-column label="消息内容">
                <template #default="scope">
                    <div class="notification-item">
                        <el-tag v-if="scope.row.status === '未读'" type="danger" class="unread-tag">
                            未读
                        </el-tag>
                        <el-tag v-if="scope.row.status === '已读'" type="info" class="read-tag">
                            已读
                        </el-tag>
                        <span :class="{ 'clickable-message': true, 'unread-message': scope.row.status === '未读' }"
                            @click="handleNotificationClick(scope.row)">
                            您收到了一条来自 {{ scope.row.sender }} 的 {{ scope.row.type }} {{ scope.row.date }}
                        </span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
import { getNotifications, markAsRead } from "@/api/notification.js";

export default {
    data() {
        return {
            notifications: [],
        };
    },
    methods: {
        async fetchNotifications() {
            const res = await getNotifications();
            this.notifications = res.data;
        },
        async handleNotificationClick(notification) {
            try {
                // 标记为已读
                if (notification.status === "未读") {
                    const res = await markAsRead(notification.id);
                    if (res.code === 0) {
                        notification.status = "已读"; // 更新本地状态
                    } else {
                        this.$message.error("标记失败：" + res.msg);
                        return;
                    }
                }
                // 跳转到对应页面
                const routes = {
                    公告: "/announcementBoard",
                    报修: "/repairList",
                    调宿申请: "/changeRoomList",
                };
                this.$router.push(routes[notification.type]);
            } catch (error) {
                this.$message.error("操作失败：" + error.message);
            }
        },
    },
    created() {
        this.fetchNotifications();
    },
};
</script>

<style scoped>
.notification-card {
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.card-header h2 {
    font-size: 18px;
    font-weight: 500;
    margin: 0;
}

.custom-table {
    --el-table-border-color: #ebeef5;
    --el-table-header-background-color: #f5f7fa;
    --el-table-row-hover-color: #f9f9f9;
}

.notification-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.unread-tag {
    font-size: 12px;
}

.clickable-message {
    cursor: pointer;
    text-decoration: underline;
    font-size: 14px;
    color: #606266;
}

.clickable-message:hover {
    color: #409eff;
}

.unread-message {
    font-weight: bold;
    color: #f56c6c;
}
</style>
