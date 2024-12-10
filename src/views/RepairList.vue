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
            <el-table :data="repairs" style="width: 100%" :sort-method="sortMethod" @sort-change="handleSortChange">
                <el-table-column label="序号" type="index" />
                <el-table-column prop="createDate" label="报修时间" sortable />
                <el-table-column prop="finishDate" label="完成时间" sortable />
                <el-table-column prop="title" label="报修类型" />
                <el-table-column prop="dormId" label="公寓号" />
                <el-table-column prop="roomId" label="宿舍号" />
                <el-table-column prop="applicantId" label="申请人" sortable />
                <el-table-column :filter-method="filterTag" :filters="[
                    { text: '已完成', value: 0 },
                    { text: '未完成', value: 1 },
                ]" filter-placement="bottom-end" label="报修状态" prop="status" sortable>
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 0 ? 'success' : 'info'" disable-transitions>
                            {{ scope.row.status === 0 ? '已完成' : '未完成' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <!-- 详情按钮始终显示 -->
                        <el-button icon="more-filled" type="default" @click="openDetail(scope.row)"></el-button>
                        <!-- 编辑和删除按钮仅在状态为未完成时显示 -->
                        <template v-if="scope.row.status === 1">
                            <el-button icon="Edit" type="primary" @click="openModal(scope.row)"></el-button>
                            <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row.id)">
                                <template #reference>
                                    <el-button icon="Delete" type="danger"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
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
                        <el-form-item label="报修时间" prop="createDate" style="margin-top: 27px">
                            <el-date-picker v-model="form.createDate" :disabled="isEdit" clearable placeholder="选择时间"
                                style="width: 48%" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="报修类型" prop="title" required>
                            <el-input v-model="form.title" placeholder="请输入报修类型"></el-input>
                        </el-form-item>
                        <el-form-item label="公寓号" prop="dormId" required>
                            <el-input v-model="form.dormId" :disabled="isEdit" placeholder="请输入公寓号"></el-input>
                        </el-form-item>
                        <el-form-item label="宿舍号" prop="roomId" required>
                            <el-input v-model="form.roomId" :disabled="isEdit" placeholder="请输入房间号"></el-input>
                        </el-form-item>
                        <el-form-item label="申请人学号" prop="applicantId" required>
                            <el-input v-model="form.applicantId" :disabled="isEdit" placeholder="请输入申请人学号"></el-input>
                        </el-form-item>
                        <el-form-item label="内容" prop="content" required>
                            <el-input v-model="form.content" type="textarea" placeholder="请输入具体内容"></el-input>
                        </el-form-item>
                        <el-form-item label="报修状态" prop="status" required>
                            <el-radio-group v-model="form.status">
                                <el-radio :label="0">已完成</el-radio>
                                <el-radio :label="1">未完成</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleChange">{{ isEdit ? '更新' : '添加' }}</el-button>
                            <el-button type="default" @click="closeModal">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>

            <!--    报修详情-->
            <el-dialog v-model="showDetail" title="详情">
                <div v-html="detail.content"></div>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary" @click="closeDetail">确 定</el-button>
                    </span>
                </template>
            </el-dialog>
        </el-card>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getRepairs, updateRepair, addRepair, deleteRepair } from '@/api/admin';
import { ElMessage } from 'element-plus';

const repairs = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const totalitems = ref(0);
const showModal = ref(false);
const detail = ref('');
const showDetail = ref(false);
const form = ref({ id: null, createDate: '', finishDate: null, title: '', content: '', applicantId: '',  dormId: '', roomId: '', status: '' });
const isEdit = ref(false);
const sortField = ref('');
const sortOrder = ref('');

const filterTag = (value, row) => {
    return row.status === value;
};

const load = async () => {
    const response = await getRepairs({
        pageNum: currentPage.value, 
        pageSize: pageSize.value, 
        search: searchQuery.value,
        sortField: sortField.value,
        sortOrder: sortOrder.value
    });
    if (response.code !== 0) {
        ElMessage.error(response.msg);
        return;
    }
    console.log('load: ', response.data.records);
    repairs.value = response.data.records;
    totalitems.value = response.data.total;
}

const handleCurrentChange = async (pageNum) => {
    currentPage.value = pageNum;
    await load();
}

const handleSizeChange = async (newPageSize) => {
    pageSize.value = newPageSize;
    await load();
}

const handleSortChange = (sort) => {
    sortField.value = sort.prop;
    sortOrder.value = sort.order === 'ascending' ? 'asc' : 'desc';
    load();
};

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
    form.value = { id: null, createDate: '', finishDate: null, title: '', dormId: '', roomId: '', status: '' };
};

const closeModal = () => {
    showModal.value = false;
};


const openDetail = (row) => {
  detail.value = row;
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
};

const handleChange = async () => {
    console.log('handleChange: ', form.value);
    const res = isEdit.value ? await updateRepair(form.value) : await addRepair(form.value);
    console.log('handleChange: ', res);
    if (res.code !== 0) {
        ElMessage.error(res.msg);
        return;
    }
    ElMessage.success(res.msg);
    await load();
    closeModal();
};

const handleDelete = async (id) => {
    const res = await deleteRepair(id);
    if (res.success) {
        ElMessage.success(res.message);
    } else {
        ElMessage.error(res.message);
    }
    await load();
}

onMounted(load); // 获取报修列表

</script>

<style scoped>
@import '@/assets/css/table.css';
</style>