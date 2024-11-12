<template>
    <div>
        <el-breadcrumb replace="true" separator-icon="ArrowRight" style="margin: 16px">
        <el-breadcrumb-item :to="{ path: 'home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>宿舍管理</el-breadcrumb-item>
        <el-breadcrumb-item>公寓信息</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card style="margin: 15px; min-height: calc(100vh - 111px)">
            <div>
            <!--    功能区-->
                <div style="margin: 10px 0">
                <!--    搜索区-->
                    <div style="margin: 10px 0">
                        <el-input v-model="search" clearable placeholder="请输入编号/地址/备注" prefix-icon="Search" style="width: 20%"/>
                        <el-button icon="Search" style="margin-left: 5px" type="primary" @click="load"></el-button>
                        <div style="float: right">
                            <el-tooltip content="添加" placement="top">
                            <el-button icon="plus" style="width: 50px" type="primary" @click="add"></el-button>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
                <!--    表格-->
                <el-table :data="paginatedBuildings" style="width: 100%">
                    <el-table-column label="#" type="index"/>
                    <el-table-column label="编号" prop="dormBuildId" sortable/>
                    <el-table-column label="地址" prop="dormBuildAddr"/>
                    <el-table-column
                        :filter-method="filterTag"
                        :filters="[
                        { text: '男宿舍', value: '男宿舍' },
                        { text: '女宿舍', value: '女宿舍' },
                    ]"
                        filter-placement="bottom-end"
                        label="备注"
                        prop="dormBuildDetail"
                    />
                    <!--      操作栏-->
                    <el-table-column label="操作" width="130px">
                        <template #default="scope">
                            <el-button icon="Edit" type="primary" @click="handleEdit(scope.row)"
                            ></el-button>
                            <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row.dormBuildId)">
                            <template #reference>
                                <el-button icon="Delete" type="danger"></el-button>
                            </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <div style="margin: 10px 0">
                    <el-pagination
                        v-model:currentPage="currentPage"
                        :page-size="pageSize"
                        :page-sizes="[10, 20]"
                        :total="totalitems"
                        layout="total, sizes, prev, pager, next, jumper"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    >
                    </el-pagination>
                </div>
                <!--      弹窗-->
                <div>
                    <el-dialog v-model="dialogVisible" title="操作" width="30%" @close="cancel">
                    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
                        <el-form-item label="编号" prop="dormBuildId">
                        <el-input v-model.number="form.dormBuildId" :disabled="disabled" style="width: 80%"></el-input>
                        </el-form-item>
                        <el-form-item label="地址" prop="dormBuildAddr">
                        <el-input v-model="form.dormBuildAddr" style="width: 80%"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="dormBuildDetail">
                        <el-input
                            v-model="form.dormBuildDetail"
                            :autosize="{ minRows: 2, maxRows: 4 }"
                            style="width: 80%"
                            type="textarea"
                        ></el-input>
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                        <el-button @click="cancel">取 消</el-button>
                        <el-button type="primary" @click="save">确 定</el-button>
                        </span>
                    </template>
                    </el-dialog>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getDormBuilds, addDormBuild, updateDormBuild, deleteDormBuild, rules } from '@/api/dormitoryInfo';
import { ElMessage } from "element-plus";

const dormBuildings = ref([]);
const search = ref('');
const filteredBuildings = ref([]);
const totalitems = ref(0);
const paginatedBuildings = ref([]);
const form = ref({dormBuildId: '',
                dormBuildAddr: '',
                dormBuildDetail: '',});
const dialogVisible = ref(false);
const disabled = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);

const resetForm = () => {
    form.value = {dormBuildId: '',
                dormBuildAddr: '',
                dormBuildDetail: '',};
};

const load = () => {
    filteredBuildings.value = dormBuildings.value.filter(building => 
                            String(building.dormBuildId).toLowerCase().includes(search.value.toLowerCase()) ||
                            String(building.dormBuildAddr).toLowerCase().includes(search.value.toLowerCase()) ||
                            String(building.dormBuildDetail).toLowerCase().includes(search.value.toLowerCase()));
    totalitems.value = filteredBuildings.value.length;
    paginatedBuildings.value = filteredBuildings.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
};

const fetchDormBuilds = async () => {
    try {
        const response = await getDormBuilds();
        dormBuildings.value = response.data;
        load();
    } catch (error) {
        ElMessage.error('获取公寓信息失败: ' + error.message);
    }
};

const add = () => {
    dialogVisible.value = true;
    disabled.value = false;
    form.value = {};
};

const cancel = () => {
    resetForm();
    dialogVisible.value = false;
    disabled.value = false;
};

const save = async () => {
    if(!disabled.value) {
        try {
            const res = await addDormBuild(form.value);
            if (!res.success) throw new Error(res.message);
            ElMessage.success(res.message);
        } catch (error) {
            ElMessage.error(error.message);
        } finally {
            fetchDormBuilds();
            cancel();
        }
    } else {
        try {
            const res = await updateDormBuild(form.value);
            if (!res.success) throw new Error(res.message);
            ElMessage.success(res.message);
        } catch (error) {
            ElMessage.error(error.message);
        } finally {
            fetchDormBuilds();
            cancel();
        }
    }
};

const filterTag = (value, row) => {
    return row.dormBuildDetail === value;
};

const handleEdit = (row) => {
    dialogVisible.value = true;
    disabled.value = true;
    form.value = {dormBuildId: row.dormBuildId,
                dormBuildAddr: row.dormBuildAddr,
                dormBuildDetail: row.dormBuildDetail,};
};

const handleDelete = async (id) => {
    try {
        const res = await deleteDormBuild(id);
        if (!res.success) throw new Error(res.message);
        ElMessage.success(res.message);
    } catch (error) {
        ElMessage.error(error.message);
    } finally {
        fetchDormBuilds();
    }
};

const handleCurrentChange = (pageNum) => {
    currentPage.value = pageNum;
    load();
};

const handleSizeChange = (newPageSize) => {
    pageSize.value = newPageSize;
    load();
};

onMounted(fetchDormBuilds);

</script>