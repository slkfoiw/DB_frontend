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
                <el-table :data="dormBuildings" style="width: 100%">
                    <el-table-column label="#" type="index"/>
                    <el-table-column label="楼栋号" prop="dormId" sortable/>
                    <el-table-column label="地址" prop="address"/>
                    <el-table-column
                        :filter-method="filterTag"
                        :filters="[
                        { text: '男', value: '男' },
                        { text: '女', value: '女' },
                        { text: '混合', value: '混合' }
                    ]"
                        filter-placement="bottom-end"
                        label="备注"
                        prop="gender"
                    />
                    <!--      操作栏-->
                    <el-table-column label="操作" width="130px">
                        <template #default="scope">
                            <el-button icon="Edit" type="primary" @click="edit(scope.row)"
                            ></el-button>
                            <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row.dormId)">
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
                        <el-form-item label="编号" prop="dormId">
                        <el-input v-model.number="form.dormId" style="width: 80%"></el-input>
                        </el-form-item>
                        <el-form-item label="地址" prop="address">
                        <el-input v-model="form.address" style="width: 80%"></el-input>
                        </el-form-item>
                        <el-select v-model="form.gender" placeholder="请选择类型">
                        <el-option
                            v-for="gender in genders" 
                            :key="gender.genderId" 
                            :label="gender.gender" 
                            :value="gender.genderId" 
                        />
                        </el-select>
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
const totalitems = ref(0);
const form = ref({dormId: '',
                address: '',
                gender: '',});
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const oldDormId = ref('');
const genders = ref([
    {genderId: 0, gender: '女'},
    {genderId: 1, gender: '男'},
    {genderId: 2, gender: '混合'}
])
const resetForm = () => {
    form.value = {dormId: '',
                address: '',
                gender: '',};
};

const load = async () => {
    const response = await getDormBuilds({pageNum: currentPage.value, pageSize: pageSize.value, search: search.value});
    if (response.code !== 0) {
        ElMessage.error('获取公寓信息失败: ' + response.msg);
        return;
    }
    console.log('response:', response);
    dormBuildings.value = response.data.records;
    totalitems.value = response.data.total;
};

const add = () => {
    dialogVisible.value = true;
    isEdit.value = false;
    resetForm();
};


const edit = (row) => {
    dialogVisible.value = true;
    isEdit.value = true;
    oldDormId.value = row.dormId;
    let genderId = 0;
    if (row.gender === '女') {
        genderId = 0;
    } else if (row.gender === '男') {
        genderId = 1;
    } else {
        genderId = 2;
    }
    form.value = {dormId: row.dormId,
                address: row.address,
                gender: genderId,};
};

const cancel = () => {
    resetForm();
    dialogVisible.value = false;
    isEdit.value = false;
};

const save = async () => {
    console.log('form:', form.value);
    const res = isEdit.value? await updateDormBuild({oldDormId: oldDormId.value, dorm: form.value}) : await addDormBuild(form.value);
    if (res.code !== 0) {
        ElMessage.error(res.msg);
        return;
    }
    ElMessage.success(res.message);
    await load();
    cancel();
};

const filterTag = (value, row) => {
    return row.gender === value;
};

const handleDelete = async (id) => {
    const res = await deleteDormBuild(id);
    if (res.code !== 0) {
        ElMessage.error(res.msg);
        return;
    }
    ElMessage.success(res.message);
    await load();
};

const handleCurrentChange = async (pageNum) => {
    currentPage.value = pageNum;
    await load();
};

const handleSizeChange = async(newPageSize) => {
    pageSize.value = newPageSize;
    await load();
};

onMounted(load);

</script>