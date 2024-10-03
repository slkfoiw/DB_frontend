<template>
    <div class="repair-list-container">
        <h2>报修列表</h2>

        <!-- 搜索框 -->
        <div class="search">
            <input v-model="searchQuery" placeholder="搜索报修类型" />
        </div>

        <!-- 排序按钮 -->
        <div class="sort-buttons">
            <button @click="sortByDate('asc')">按时间升序</button>
            <button @click="sortByDate('desc')">按时间降序</button>
        </div>

        <!-- 表格显示报修信息 -->
        <table>
            <thead>
                <tr>
                    <th>报修ID</th>
                    <th>报修时间</th>
                    <th>报修类型</th>
                    <th>公寓号</th>
                    <th>宿舍号</th>
                    <th>报修状态</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(repair, index) in currentRepairs" :key="repair.id">
                    <td>{{ repair.id }}</td>
                    <td>{{ new Date(repair.date).toLocaleString() }}</td>
                    <td>{{ repair.type }}</td>
                    <td>{{ repair.apartmentNumber }}</td>
                    <td>{{ repair.dormitoryNumber }}</td>
                    <td>
                        <select v-model="repair.status">
                            <option value="未完成">未完成</option>
                            <option value="已完成">已完成</option>
                        </select>
                    </td>
                    <td>
                        <button @click="updateRepair(repair)">更新状态</button>
                    </td>
                </tr>
                <!-- 添加空行补足不足的行数 -->
                <tr v-for="n in emptyRows" :key="n">
                    <td colspan="7" style="height: 40px;"></td>
                </tr>
            </tbody>
        </table>

        <!-- 翻页控件 -->
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
            <span>第 {{ currentPage }} 页</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getRepairs, updateRepairStatus } from '@/api/admin'; // 替换为实际 API

export default {
    name: 'RepairList',
    setup() {
        const repairs = ref([]);
        const searchQuery = ref('');
        const currentPage = ref(1);
        const itemsPerPage = ref(5);

        const totalPages = computed(() => Math.ceil(filteredRepairs.value.length / itemsPerPage.value));

        // 获取报修列表
        const fetchRepairs = async () => {
            const response = await getRepairs();
            repairs.value = response.data; // 假设 API 返回的数据
        };

        const filteredRepairs = computed(() => {
            return repairs.value.filter(repair => {
                return repair.type.toLowerCase().includes(searchQuery.value.toLowerCase());
            });
        });

        const currentRepairs = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value;
            return filteredRepairs.value.slice(start, start + itemsPerPage.value);
        });

        const emptyRows = computed(() => {
            return itemsPerPage.value - currentRepairs.value.length;
        });

        const sortByDate = (order) => {
            if (order === 'asc') {
                repairs.value.sort((a, b) => new Date(a.date) - new Date(b.date));
            } else {
                repairs.value.sort((a, b) => new Date(b.date) - new Date(a.date));
            }
        };

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++;
            }
        };

        const prevPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--;
            }
        };

        const updateRepair = async (repair) => {
            await updateRepairStatus(repair.id, { status: repair.status });
            await fetchRepairs(); // 刷新报修列表
        };

        onMounted(fetchRepairs); // 获取报修列表

        return {
            repairs,
            searchQuery,
            currentPage,
            itemsPerPage,
            totalPages,
            filteredRepairs,
            currentRepairs,
            emptyRows,
            sortByDate,
            nextPage,
            prevPage,
            updateRepair,
        };
    }
};
</script>

<style scoped>
@import '@/assets/css/table.css';

.repair-list-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 8px;
    border: 1px solid #ddd;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

.pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.pagination button {
    margin: 0 5px;
}
</style>