<template>
    <el-card>
        <h2>消息管理</h2>
        <el-table :data="notifications" style="width: 100%">
            <el-table-column label="消息内容">
                <template #default="scope">
                    <span
                        :style="{ color: scope.row.status === '未读' ? 'red' : 'black' }"
                        @click="handleNotificationClick(scope.row)"
                        class="clickable-message"
                    >
                        您收到了一条来自 {{ scope.row.sender }} 的 {{ scope.row.type }} {{ scope.row.date }}
                    </span>
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
                    if (res.success) {
                        notification.status = "已读"; // 更新本地状态
                    } else {
                        this.$message.error("标记失败：" + res.message);
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

<style>
.clickable-message {
    cursor: pointer;
    text-decoration: underline;
}
</style>
