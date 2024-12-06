<template>
    <div class="stu-list">
        <el-breadcrumb separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>学生信息</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 导入和导出功能 -->
            <div>
                <el-upload class="upload-demo" drag accept=".xls, .xlsx, .xml" action=""
                    :on-change="handleFileUpload" 
                    :auto-upload="false">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">重新导入学生信息，将文件拖到此处，或<em>点击上传</em></div>
                </el-upload>
                <el-button @click="exportStudents">导出学生信息</el-button>
            </div>

            <!-- 搜索宿管、排序、添加宿管 -->
            <div style="margin: 10px 0">
                <el-input v-model="searchQuery" clearable placeholder="搜索学生学号、姓名" prefix-icon="Search"
                    style="width: 20%;"></el-input>
                <el-button icon="Search" style="margin-left: 5px" type="primary" @click="load"></el-button>
                <!-- <el-button icon="refresh-left" style="margin-left: 10px" type="default" @click="reset"></el-button> -->
                <div style="float: right">
                    <el-tooltip content="添加学生" placement="top">
                        <el-button icon="plus" style="width: 50px" type="primary" @click="openModal()"></el-button>
                    </el-tooltip>
                </div>
            </div>

            <!-- 表格显示宿管信息 -->
            <el-table :data="students" style="width: 100%">
                <el-table-column label="序号" type="index" />
                <el-table-column prop="studentId" label="学号" sortable />
                <el-table-column prop="name" label="姓名" sortable />
                <el-table-column prop="dormId" label="公寓号" sortable />
                <el-table-column prop="roomId" label="宿舍号" sortable />
                <el-table-column prop="major" label="专业" />
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button icon="Edit" @click="openModal(scope.row)">编辑</el-button>
                        <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row.studentId)">
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

            <!-- 弹窗（添加/编辑学生） -->
            <el-dialog v-model="showModal" title="宿管信息" @close="closeModal">
                <div class="modal-content">
                    <h3>{{ isEdit ? '编辑学生' : '添加学生' }}</h3>
                    <el-form :model="form" ref="formRef">
                        <el-form-item label="学号" prop="studentId">
                            <el-input v-model="form.studentId" placeholder="请输入学号" :disabled="isEdit" />
                        </el-form-item>
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="form.name" placeholder="请输入姓名" />
                        </el-form-item>
                        <el-form-item label="公寓号" prop="dormId">
                            <el-input v-model="form.dormId" placeholder="请输入公寓号" />
                        </el-form-item>
                        <el-form-item label="宿舍号" prop="roomId">
                            <el-input v-model="form.roomId" placeholder="请输入宿舍号" />
                        </el-form-item>
                        <el-select v-model="form.majorId" placeholder="请选择专业">
                            <el-option
                                v-for="major in majors" 
                                :key="major.majorId" 
                                :label="major.major" 
                                :value="major.majorId" 
                            />
                        </el-select>
                        <el-form-item>
                            <el-button type="primary" @click="saveStudent">{{ isEdit ? '保存' : '添加' }}</el-button>
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
import { getStudents, addStudent, updateStudent, deleteStudent, updateAllStudents, getMajors } from '@/api/student';
import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus';

const students = ref([]);
const searchQuery = ref('');
const form = ref({
    studentId: '',
    name: '',
    dormId: '',
    roomId: '',
    majorId: '',
    major: ''
});
const totalitems = ref(0);
const oldStudentId = ref('');
const isEdit = ref(false);
const showModal = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const majors = ref([]);

const load = async () => {
    const response = await getStudents({pageNum: currentPage.value, pageSize: pageSize.value, search: searchQuery.value});
    if (response.code !== 0) {
        ElMessage.error(response.msg);
        return;
    }
    students.value = response.data.records;
    totalitems.value = response.data.total;
}

const loadMajors = async () => {
    const response = await getMajors();
    if (response.code !== 0) {
        ElMessage.error(response.msg);
        return;
    }
    majors.value = response.data;  // 将后端返回的专业列表存入 majors
};

const handleCurrentChange = async (pageNum) => {
    currentPage.value = pageNum;
    await load();
}

const handleSizeChange = async (newPageSize) => {
    pageSize.value = newPageSize;
    await load();
}

const openModal = (student = null) => {
    if (student) {
        form.value = { ...student };
        oldStudentId.value = student.studentId;
        isEdit.value = true;
    } else {
        form.value = { studentId: '', name: '', dormId: '', roomId: '', major: '' };
        oldStudentId.value = null;
        isEdit.value = false;
    }
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const saveStudent = async () => {
    
    // 验证信息是否为空
    if (form.value.name === '' || form.value.dormId === '' || form.value.roomId === '' || form.value.major === '') {
        alert('请填写完整信息！');
        return;
    }

    const res = isEdit.value ? await updateStudent({oldStudentId: oldStudentId.value, student: form.value}) : await addStudent(form.value);
    if (res.code !== 0) {
        ElMessage.error(res.msg);
        return;
    }
    ElMessage.success(res.msg);
    await load();
    closeModal();
};

const handleDelete = async (studentId) => {
    const res = await deleteStudent(studentId);
    if (res.code !== 0) {
        ElMessage.error(res.msg);
    } else {
        ElMessage.success(res.msg);
    }
    await load();
}

const handleFileUpload = async (file) => {
    if (file.raw) {
        const extension = file.raw.name.split('.').pop().toLowerCase();
        const reader = new FileReader();

        reader.onload = async (event) => {
            const fileData = event.target.result;
            if (extension === 'xml') {
                await parseXML(fileData);
            } else {
                await parseExcel(fileData);
            }
            await load();
        };
        reader.readAsArrayBuffer(file.raw);
    } else {
        ElMessage.error('文件上传失败');
    }
};


const parseExcel = async (data) => {
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    const res = await updateAllStudents(jsonData);
    if (res.code !== 0) {
        ElMessage.error(res.msg);
        return;
    }
    ElMessage.success(res.msg);
};

const parseXML = async (data) => {
    parseString(data, async (err, result) => {
        if (err) {
            ElMessage.error('XML解析失败!');
        } else {
            console.log('XML数据:', result);
            const res = await updateAllStudents(result);
            if (res.code !== 0) {
                ElMessage.error(res.msg);
                return;
            }
            ElMessage.success(res.msg);
        }
    });
};

const exportStudents = () => {
    const wb = XLSX.utils.book_new(); // 创建新的工作簿
    const ws = XLSX.utils.json_to_sheet(students.value); // 将学生信息转为工作表
    XLSX.utils.book_append_sheet(wb, ws, '学生信息'); // 将工作表加入工作簿
    XLSX.writeFile(wb, '学生信息.xlsx'); // 导出为 Excel 文件
};

onMounted(async () => {
    await load();
    await loadMajors();  // 加载专业列表
});

</script>

<style scoped>
@import '@/assets/css/table.css';
</style>