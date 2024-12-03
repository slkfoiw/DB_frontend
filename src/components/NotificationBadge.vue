<template>
    <el-badge :value="unreadCount" class="notification-badge">
        <el-button icon="el-icon-bell" type="text" @click="goToNotifications">消息</el-button>
    </el-badge>
</template>

<script>
import { getNotifications } from "@/api/notification.js";

export default {
    data() {
        return {
            unreadCount: 0,
        };
    },
    methods: {
        async fetchNotifications() {
            const res = await getNotifications();
            this.unreadCount = res.data.filter((n) => n.status === "未读").length;
        },
        goToNotifications() {
            this.$router.push("/notifications");
        },
    },
    created() {
        this.fetchNotifications();
    },
};
</script>
