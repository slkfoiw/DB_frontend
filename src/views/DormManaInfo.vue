<template>
    <div class="dorm-mana-list">
        <el-breadcrumb separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>宿管信息</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 导入和导出功能 -->
            <div>
                <el-upload class="upload-demo" drag accept=".xls, .xlsx, .xml" multiple
                    :on-change="handleFileUpload" :before-upload="beforeUpload"
                    auto-upload="false">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">重新导入宿管信息，将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
                <el-button @click="exportDormManagers">导出宿管信息</el-button>
            </div>

            <!-- 搜索宿管、添加宿管 -->
            <div style="margin: 10px 0">
                <el-input v-model="searchQuery" clearable placeholder="请输入宿管工号或姓名" prefix-icon="Search"
                    style="width: 20%" />
                <el-button icon="Search" style="margin-left: 5px" type="primary" @click="load"></el-button>
                <div style="float: right">
                    <el-tooltip content="添加宿管" placement="top">
                        <el-button icon="plus" style="width: 50px" type="primary" @click="openModal()"></el-button>
                    </el-tooltip>
                </div>
            </div>

            <!-- 表格显示宿管信息 -->
            <el-table :data="dormManagers" style="width: 100%">
                <el-table-column label="序号" type="index" />
                <el-table-column prop="managerId" label="宿管ID" sortable />
                <el-table-column prop="name" label="姓名" sortable />
                <el-table-column prop="dormId" label="公寓号" sortable />
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button icon="Edit" @click="openModal(scope.row)">编辑</el-button>
                        <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row.managerId)">
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

            <!-- 弹窗（添加/编辑宿管） -->
            <el-dialog v-model="showModal" title="宿管信息" @close="closeModal">
                <div class="modal-content">
                    <h3>{{ isEdit ? '编辑宿管' : '添加宿管' }}</h3>
                    <el-form :model="form" ref="formRef">
                        <el-form-item label="宿管ID" prop="managerId" required>
                            <el-input v-model="form.managerId" placeholder="请输入宿管ID"></el-input>
                        </el-form-item>
                        <el-form-item label="宿管姓名" prop="name" required>
                            <el-input v-model="form.name" placeholder="请输入宿管姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="公寓号" prop="dormId" required>
                            <el-input v-model="form.dormId" placeholder="请输入公寓号"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="saveDormMana">{{ isEdit ? '更新' : '添加' }}</el-button>
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
import { getDormManagers, addDormManager, updateDormManager, deleteDormManager, checkIfIdExists, updateAllDormManagers } from '@/api/dormManager';
import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus';
import { parseString } from 'xml2js';

const dormManagers = ref([]);
const searchQuery = ref('');
const totalitems = ref(0);
const form = ref({ managerId: '', name: '', dormId: '' });
const oldManagerId = ref('');
const isEdit = ref(false);
const showModal = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);

const load = async () => {
    try {
        const response = await getDormManagers({pageNum: currentPage.value, pageSize: pageSize.value, search: searchQuery.value});
        dormManagers.value = response.data.records;
        totalitems.value = response.data.total;
    } catch (error) {
        ElMessage.error('获取宿管信息失败: ' + error.message);
    }
};

const handleCurrentChange = (pageNum) => {
    currentPage.value = pageNum;
    load();
}

const handleSizeChange = (newPageSize) => {
    pageSize.value = newPageSize;
    load();
}

const openModal = (manager = null) => {
    if (manager) {
        form.value = { ...manager };
        oldManagerId.value = manager.managerId;
        isEdit.value = true;
    } else {
        resetForm();
        oldManagerId.value = null;
        isEdit.value = false;
    }
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const saveDormMana = async () => {
    console.log('form:', form.value);
    const { managerId, name, dormId } = form.value;
    
    // if (!/^\d{8}$/.test(managerId)) {
    //     ElMessage.error('宿管ID必须是8位数字！');
    //     return;
    // }
    
    if (!name || !dormId) {
        ElMessage.error('请填写完整信息！');
        return;
    }
    
    if (!isEdit.value || managerId !== oldManagerId.value) {
        const idExists = await checkIfIdExists(managerId);
        if (idExists.code !== 0) {
            ElMessage.error(idExists.msg);
            return;
        }
    }
    const res = isEdit.value ? await updateDormManager({oldManagerId:oldManagerId.value, manager:form.value}) : await addDormManager(form.value);
    console.log('res:', res);
    if (res.code === 0) {
        ElMessage.success(res.msg);
    } else {
        ElMessage.error(res.msg);
    }
    load(); 
    closeModal();
};

const handleDelete = async (managerId) => {
    const res = await deleteDormManager(managerId);
    if (res.code !== 0) {
        ElMessage.error(res.msg);
    } else {
        ElMessage.success(res.msg);
    }
    load();
};

const resetForm = () => {
    form.value = { managerId: '', name: '', dormId: '' };
};

const beforeUpload = (file) => {
    const isExcel = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(file.type);
    const isXML = file.type === 'text/xml';

    if (!isExcel && !isXML) {
        ElMessage.error('上传文件只能是表格或XML格式!');
        return false;
    }
    return true;
};

const handleFileUpload = (file) => {
    console.log('file.raw: ', file.raw);
    if (file.raw) {
        const extension = file.raw.name.split('.').pop().toLowerCase();
        const reader = new FileReader();

        reader.onload = (event) => {
            const fileData = event.target.result;
            if (extension === 'xml') {
                parseXML(fileData);
            } else {
                parseExcel(fileData);
            }
        };
        reader.readAsArrayBuffer(file.raw);
    } else {
        ElMessage.error('文件上传失败');
    }
};

const parseExcel = async (data) => {
    console.log('data:', data);
    const workbook = XLSX.read(data, { type: 'array' });
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    console.log('jsonData:', jsonData);
    const res = await updateAllDormManagers(jsonData);
    console.log('res:', res);
    if (res.code !== 0) {
        ElMessage.error(res.msg);
        return;
    }
    ElMessage.success(res.msg);
};

const parseXML = async (data) => {
    parseString(data, async (err, result) => {
        if (err) {
            console.log('err:', err);
            ElMessage.error('XML解析失败!');
            return;
        }
        const res = await updateAllDormManagers(result);
        if (res.code !== 0) {
            ElMessage.error(res.msg);
            return;
        }
        ElMessage.success(res.msg);
    });
};

const exportDormManagers = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dormManagers.value);
    XLSX.utils.book_append_sheet(wb, ws, '宿管信息');
    XLSX.writeFile(wb, '宿管信息.xlsx');
};

onMounted(load)
</script>

<style scoped>
@import '@/assets/css/table.css';
</style>
