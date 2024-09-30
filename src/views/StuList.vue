<template>
    <div>
        <h2>学生信息列表</h2>
        <input v-model="searchQuery" placeholder="搜索学生" />
        <button @click="sortByStudentId">按学号排序</button>
        <button @click="sortByNamePinyin">按姓名拼音排序</button>
        <button @click="openAddModal">添加学生</button>

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
                        <button @click="openEditModal(student)">编辑</button>
                        <button @click="deleteStudent(student.studentId)">删除</button>
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
import { getStudents } from '@/api/student.js'; // 假设你有一个 api.js 文件用于处理 API 调用

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
            return filteredStudents.value.slice(start, start + pageSize);
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

        const saveStudent = () => {
            if (isEditing.value) {
                const index = students.value.findIndex(s => s.studentId === currentStudent.value.studentId);
                if (index !== -1) {
                    students.value[index] = { ...currentStudent.value };
                }
            } else {
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
        };
    },
};
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

.pagination {
    margin-top: 10px;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 300px;
}

.modal-content label {
    display: block;
    margin: 10px 0 5px;
}
</style>