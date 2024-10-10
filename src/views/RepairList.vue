<template>
    <div class="repair-list-container">
        <el-breadcrumb separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>报修记录</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 搜索框 -->
            <div style="margin: 10px 0">
                <el-input v-model="searchQuery" clearable placeholder="请输入报修类型" prefix-icon="Search"
                    style="width: 20%" />
                <el-button icon="Search" style="margin-left: 5px" type="primary" @click="load"></el-button>
                <div style="float: right">
                    <el-tooltip content="添加报修记录" placement="top">
                        <el-button icon="plus" style="width: 50px" type="primary" @click="openModal()"></el-button>
                    </el-tooltip>
                </div>
            </div>

            <!-- 表格显示报修信息 -->
            <el-table :data="paginatedRepairs" style="width: 100%">
                <el-table-column label="序号" type="index" />
                <el-table-column prop="date" label="报修时间" sortable />
                <el-table-column prop="type" label="报修类型" />
                <el-table-column prop="dormitoryNumber" label="公寓号" />
                <el-table-column prop="roomNumber" label="宿舍号" />
                <el-table-column :filter-method="filterTag" :filters="[
                    { text: '已完成', value: '已完成' },
                    { text: '未完成', value: '未完成' },
                ]" filter-placement="bottom-end" label="报修状态" prop="status" sortable>
                    <template #default="scope">
                        <el-tag :type="scope.row.status === '已完成' ? 'success' : 'info'" disable-transitions>{{
                            scope.row.status }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button icon="Edit" type="primary" @click="openModal(scope.row)">编辑</el-button>
                        <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button icon="Delete" type="danger">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 翻页控件 -->
            <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
                :current-page="currentPage" :page-size="pageSize" :page-sizes="[10, 20]" :total="totalitems"
                layout="total, sizes, prev, pager, next, jumper" :disabled="totalitems === 0">
            </el-pagination>

            <!-- 弹窗 -->
            <el-dialog v-model="showModal" title="报修信息" @close="closeModal">
                <div class="modal-content">
                    <h3>{{ isEdit ? '编辑报修' : '添加报修' }}</h3>
                    <el-form :model="form" ref="formRef">
                        <el-form-item label="报修时间" prop="date" style="margin-top: 27px">
                            <el-date-picker v-model="form.date" :disabled="isEdit" clearable
                                placeholder="选择时间" style="width: 48%" type="datetime"
                                value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="报修类型" prop="type" required>
                            <el-input v-model="form.type" placeholder="请输入报修类型"></el-input>
                        </el-form-item>
                        <el-form-item label="公寓号" prop="dormitoryNumber" required>
                            <el-input v-model="form.dormitoryNumber" placeholder="请输入公寓号"></el-input>
                        </el-form-item>
                        <el-form-item label="宿舍号" prop="roomNumber" required>
                            <el-input v-model="form.roomNumber" placeholder="请输入公寓号"></el-input>
                        </el-form-item>
                        <el-form-item label="报修状态" prop="status" required>
                            <el-radio-group v-model="form.status">
                                <el-radio label="已完成">已完成</el-radio>
                                <el-radio label="未完成">未完成</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleChange">{{ isEdit ? '更新' : '添加' }}</el-button>
                            <el-button type="default" @click="closeModal">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getRepairs, updateRepair, addRepair, deleteRepair } from '@/api/admin'; // 替换为实际 API


const repairs = ref([]);
const filteredRepairs = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const paginatedRepairs = ref([]);
const totalitems = ref(0);
const showModal = ref(false);
const form = ref({ id: null, date: '', type: '', dormitoryNumber: '', roomNumber: '', status: '' });
const isEdit = ref(false);

// 获取报修列表
const fetchRepairs = async () => {
    const response = await getRepairs();
    repairs.value = response.data; // 假设 API 返回的数据
    load();
};

const filterTag = (value, row) => {
    return row.status === value;
};

const load = () => {
    filteredRepairs.value = repairs.value.filter(
    repair => {
        return repair.type.toLowerCase().includes(searchQuery.value.toLowerCase());
    });
    totalitems.value = filteredRepairs.value.length;
    const start = (currentPage.value - 1) * pageSize.value;
    paginatedRepairs.value = filteredRepairs.value.slice(start, start + pageSize.value);
}

const handleCurrentChange = (pageNum) => {
    currentPage.value = pageNum;
    load();
}

const handleSizeChange = (newPageSize) => {
    pageSize.value = newPageSize;
    load();
}

const openModal = (repair = null) => {
    if (repair) {
        form.value = { ...repair };
        isEdit.value = true;
    } else {
        resetForm();
        isEdit.value = false;
    }
    showModal.value = true;
};

const resetForm = () => {
    form.value = { id: null, date: '', type: '', dormitoryNumber: '', roomNumber: '', status: '' };
};

const closeModal = () => {
    showModal.value = false;
};

const handleChange = async () => {
    const res = isEdit.value ? await updateRepair(form.value) : await addRepair(form.value);
    if (res.success) {
        ElMessage.success(res.message);
    } else {
        ElMessage.error(res.message);
    }
    fetchRepairs();
    closeModal();
};

const handleDelete = async (id) => {
    const res = await deleteRepair(id);
    if (res.success) {
        ElMessage.success(res.message);
    } else {
        ElMessage.error(res.message);
    }
    fetchRepairs();
}

onMounted(fetchRepairs); // 获取报修列表

</script>

<style scoped>
@import '@/assets/css/table.css';
</style>