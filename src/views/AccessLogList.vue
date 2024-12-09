<template>
    <el-card>
        <div class="filter">
            <el-input v-model="searchQuery" placeholder="搜索用户名" @input="fetchLogs" clearable class="filter-input">
                <template #append>
                    <el-button @click="fetchLogs">搜索</el-button>
                </template>
            </el-input>
        </div>

        <el-table :data="logs" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="50" />
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="userIp" label="用户IP" />
            <el-table-column prop="accessedPage" label="访问页面" />
            <el-table-column prop="date" label="访问时间" />
            <el-table-column prop="type" label="类型" />
        </el-table>
    </el-card>
</template>

<script>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import http from "@/utils/http";

export default {
    name: "AccessLogs",
    setup() {
        const logs = ref([]);
        const searchQuery = ref("");

        // 获取日志数据
        const fetchLogs = async () => {
            try {
                const response = await http.get('/access-logs/search', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: { username: searchQuery.value }
                });

                console.log(response.data);
                logs.value = response.data;
            } catch (error) {
                ElMessage.error("获取日志失败！");
            }
        };

        // 初始化获取数据
        onMounted(fetchLogs);

        return { logs, searchQuery, fetchLogs };
    },
};
</script>

<style>
.filter {
    margin-bottom: 20px;
}

.filter-input {
    width: 300px;
}
</style>