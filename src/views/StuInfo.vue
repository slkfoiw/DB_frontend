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
                <el-upload class="upload-demo" drag accept=".xls, .xlsx, .xml" action="" multiple
                    :on-change="handleFileUpload" :before-upload="beforeUpload">
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
            <el-table :data="paginatedStudents" style="width: 100%">
                <el-table-column label="序号" type="index" />
                <el-table-column prop="studentId" label="学号" sortable />
                <el-table-column prop="stuName" label="姓名" sortable />
                <el-table-column prop="dormitoryNumber" label="公寓号" sortable />
                <el-table-column prop="roomNumber" label="宿舍号" sortable />
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
                            <el-input v-model="form.studentId" :disabled="isEdit" />
                        </el-form-item>
                        <el-form-item label="姓名" prop="stuName">
                            <el-input v-model="form.stuName" placeholder="请输入姓名" />
                        </el-form-item>
                        <el-form-item label="公寓号" prop="dormitoryNumber">
                            <el-input v-model="form.dormitoryNumber" placeholder="请输入公寓号" />
                        </el-form-item>
                        <el-form-item label="宿舍号" prop="roomNumber">
                            <el-input v-model="form.roomNumber" placeholder="请输入宿舍号" />
                        </el-form-item>
                        <el-form-item label="专业" prop="major">
                            <el-input v-model="form.major" placeholder="请输入专业" />
                        </el-form-item>
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
import { getStudents, addStudent, updateStudent, deleteStudent, checkIfIdExists, updateAllStudents } from '@/api/student';
import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus';

const students = ref([]);
const searchQuery = ref('');
const form = ref({
    studentId: '',
    stuName: '',
    dormitoryNumber: '',
    roomNumber: '',
    major: ''
});
const oldStudentId = ref('');
const isEdit = ref(false);
const showModal = ref(false);
const currentPage = ref(1);
const pageSize = ref(10); // 每页显示10条数据
const paginatedStudents = ref([]);
const filteredStudents = computed(() => {
    return students.value.filter(student => {
        return (
            student.studentId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            student.stuName.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    });
});
const totalitems = computed(() => filteredStudents.value.length);

const fetchStudents = async () => {
    try {
        const response = await getStudents();
        students.value = response.data;
        load();
    } catch (error) {
        console.error('获取学生信息失败:', error);
    }
};

// 搜索功能
const load = () => {
    paginatedStudents.value = filteredStudents.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value);
}

// 翻页功能
const handleCurrentChange = (pageNum) => {
    currentPage.value = pageNum;
    load();
}

const handleSizeChange = (newPageSize) => {
    pageSize.value = newPageSize;
    load();
}

const openModal = (student = null) => {
    if (student) {
        form.value = { ...student };
        oldStudentId.value = student.studentId;
        isEdit.value = true;
    } else {
        form.value = { studentId: '', stuName: '', dormitoryNumber: '', roomNumber: '', major: '' };
        oldStudentId.value = null;
        isEdit.value = false;
    }
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};

const saveStudent = async () => {
    // 验证学号是否满足8位数字的条件
    const studentId = form.value.studentId;
    const isValidStudentId = /^\d{8}$/.test(studentId);
    if (!isValidStudentId) {
        alert('学号必须是8位数字！');
        return;
    }
    // 验证信息是否为空
    if (form.value.stuName === '' || form.value.dormitoryNumber === '' || form.value.roomNumber === '' || form.value.major === '') {
        alert('请填写完整信息！');
        return;
    }
    // 检查ID是否已被使用
    if (!isEdit.value || studentId !== oldStudentId) {
        const idExists = await checkIfIdExists(studentId);
        if (idExists) {
            ElMessage.error('学号已被其他人使用！');
            return;
        }
    }

    const res = isEdit.value ? await updateStudent(form.value) : await addStudent(form.value);
    if (res.success) {
        ElMessage.success(res.message);
    } else {
        ElMessage.error(res.message);
    }
    fetchStudents();
    closeModal();
};

const handleDelete = async (studentId) => {
    const res = await deleteStudent(studentId);
    if (res.success) {
        ElMessage.success(res.message);
    } else {
        ElMessage.error(res.message);
    }
    fetchStudents();
}

const beforeUpload = (file) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel';
    const isXML = file.type === 'text/xml';

    if (!isExcel && !isXML) {
        ElMessage.error('上传文件只能是表格或XML格式!');
        return false;
    }
    return true;
};

const handleFileUpload = (file) => {
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
    } else {
        ElMessage.error('文件上传失败');
    }
};


const parseExcel = async (data) => {
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log('Excel数据:', jsonData);
    const res = await updateAllStudents(jsonData);
    if (res.success) {
        ElMessage.success(res.message);
    } else {
        ElMessage.error(res.message);
    }
};

const parseXML = async (data) => {
    parseString(data, async (err, result) => {
        if (err) {
            ElMessage.error('XML解析失败!');
        } else {
            console.log('XML数据:', result);
            const res = await updateAllStudents(result);
            if (res.success) {
                ElMessage.success(res.message);
            } else {
                ElMessage.error(res.message);
            }
        }
    });
};

const exportStudents = () => {
    const wb = XLSX.utils.book_new(); // 创建新的工作簿
    const ws = XLSX.utils.json_to_sheet(students.value); // 将学生信息转为工作表
    XLSX.utils.book_append_sheet(wb, ws, '学生信息'); // 将工作表加入工作簿
    XLSX.writeFile(wb, '学生信息.xlsx'); // 导出为 Excel 文件
};

onMounted(fetchStudents);

</script>

<style scoped>
@import '@/assets/css/table.css';
</style>