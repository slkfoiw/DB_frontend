<template>
    <div class="stu-list">
        <h2>学生信息列表</h2>
        <div>
            <h4>导入学生信息</h4>
            <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
            <h4>导出学生信息</h4>
            <button @click="exportStudents">导出学生信息</button>
        </div>

        <input v-model="searchQuery" placeholder="搜索学生学号、姓名" />
        <div class="sort-buttons">
            <button @click="sortByStudentId">按学号排序</button>
            <button @click="sortByNamePinyin">按姓名拼音排序</button>
            <button @click="openAddModal">添加学生</button>
        </div>

        <table>
            <thead>
                <tr>
                    <th>学号</th>
                    <th>姓名</th>
                    <th>公寓号</th>
                    <th>宿舍号</th>
                    <th>专业</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="student in paginatedStudents" :key="student.studentId">
                    <td>{{ student.studentId }}</td>
                    <td>{{ student.stuName }}</td>
                    <td>{{ student.apartmentNumber }}</td>
                    <td>{{ student.dormitoryNumber }}</td>
                    <td>{{ student.major }}</td>
                    <td>
                        <template v-if="student.studentId"> <!-- 只在有有效的宿管ID时显示按钮 -->
                            <button @click="openEditModal(student)">编辑</button>
                            <button @click="deleteDormMana(student.studentId)">删除</button>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
            <span>第 {{ currentPage }} 页</span>
            <button @click="nextPage" :disabled="currentPage >= totalPages">下一页</button>
        </div>

        <!-- 添加/编辑学生模态框 -->
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <h3>{{ isEditing ? '编辑学生' : '添加学生' }}</h3>
                <label>学号:</label>
                <input v-model="currentStudent.studentId" :disabled="isEditing" />
                <label>姓名:</label>
                <input v-model="currentStudent.stuName" />
                <label>公寓号:</label>
                <input v-model="currentStudent.apartmentNumber" />
                <label>宿舍号:</label>
                <input v-model="currentStudent.dormitoryNumber" />
                <label>专业:</label>
                <input v-model="currentStudent.major" />
                <button @click="saveStudent">{{ isEditing ? '保存' : '添加' }}</button>
                <button @click="closeModal">取消</button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getStudents, addStudent, updateStudent, deleteStudent } from '@/api/student';
import * as XLSX from 'xlsx';

export default {
    setup() {
        const students = ref([]);
        const searchQuery = ref('');
        const currentPage = ref(1);
        const pageSize = 10; // 每页显示10条数据
        const showModal = ref(false);
        const isEditing = ref(false);
        const currentStudent = ref({
            studentId: '',
            stuName: '',
            apartmentNumber: '',
            dormitoryNumber: '',
            major: ''
        });

        const filteredStudents = computed(() => {
            return students.value.filter(student =>
                student.stuName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                student.studentId.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
        });

        const paginatedStudents = computed(() => {
            const start = (currentPage.value - 1) * pageSize;
            const currentData = filteredStudents.value.slice(start, start + pageSize);
             // 计算缺少的行数
            const missingRows = pageSize - currentData.length;

            // 填补空行
            for (let i = 0; i < missingRows; i++) {
                currentData.push({ managerId: '', managerName: '', apartmentNumber: '' });
            }

            return currentData;
        });

        const totalPages = computed(() => {
            return Math.ceil(filteredStudents.value.length / pageSize);
        });

        const fetchStudents = async () => {
            try {
                const response = await getStudents();
                students.value = response.data;
            } catch (error) {
                console.error('获取学生信息失败:', error);
            }
        };

        const sortByStudentId = () => {
            students.value.sort((a, b) => a.studentId.localeCompare(b.studentId));
        };

        const sortByNamePinyin = () => {
            students.value.sort((a, b) => a.stuName.localeCompare(b.stuName, 'zh-Hans-CN'));
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

        const openAddModal = () => {
            currentStudent.value = { studentId: '', stuName: '', apartmentNumber: '', dormitoryNumber: '', major: '' };
            isEditing.value = false;
            showModal.value = true;
        };

        const openEditModal = (student) => {
            currentStudent.value = { ...student };
            isEditing.value = true;
            showModal.value = true;
        };

        const saveStudent = async() => {
            // 验证学号是否满足8位数字的条件
            const studentId = currentStudent.value.studentId;
            const isValidStudentId = /^\d{8}$/.test(studentId); 
            if (!isValidStudentId) {
                alert('学号必须是8位数字！'); 
                return; 
            }
            // 验证信息是否为空
            if (currentStudent.value.stuName === '' || currentStudent.value.apartmentNumber === '' || currentStudent.value.dormitoryNumber === '' || currentStudent.value.major === '') {
                alert('请填写完整信息！');
                return;
            }

            if (isEditing.value) {
                await updateStudent(currentStudent.value)
                const index = students.value.findIndex(s => s.studentId === currentStudent.value.studentId);
                if (index !== -1) {
                    students.value[index] = { ...currentStudent.value };
                }
            } else {
                awaitaddStudent(currentStudent.value);
                students.value.push({ ...currentStudent.value });
            }
            closeModal();
        };

        const deleteStudent = (studentId) => {
            students.value = students.value.filter(student => student.studentId !== studentId);
        };

        const closeModal = () => {
            showModal.value = false;
        };

        const exportStudents = () => {
            const wb = XLSX.utils.book_new(); // 创建新的工作簿
            console.log("1");
            const ws = XLSX.utils.json_to_sheet(filteredStudents.value); // 将学生信息转为工作表
            console.log("1");
            XLSX.utils.book_append_sheet(wb, ws, '学生信息'); // 将工作表加入工作簿
            XLSX.writeFile(wb, '学生信息.xlsx'); // 导出为 Excel 文件
        };

        const handleFileUpload = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                // 清空现有学生数据并填充导入的数据
                students.value = jsonData.map(student => ({
                    studentId: student['学号'],
                    stuName: student['姓名'],
                    apartmentNumber: student['公寓号'],
                    dormitoryNumber: student['宿舍号'],
                    major: student['专业']
                }));
            };

            reader.readAsArrayBuffer(file);
        };

        onMounted(fetchStudents);

        return {
            students,
            searchQuery,
            currentPage,
            pageSize,
            filteredStudents,
            paginatedStudents,
            totalPages,
            showModal,
            isEditing,
            currentStudent,
            fetchStudents,
            sortByStudentId,
            sortByNamePinyin,
            nextPage,
            prevPage,
            openAddModal,
            openEditModal,
            saveStudent,
            deleteStudent,
            closeModal,
            exportStudents,
            handleFileUpload
        };
    },
};
</script>

<style scoped>
@import '@/assets/css/table.css';

.stu-list {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}
</style>