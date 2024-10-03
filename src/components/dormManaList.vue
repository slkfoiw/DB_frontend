<template>
    <div class="dorm-mana-list">
        <h2>宿管信息列表</h2>

        <!-- 导入和导出功能 -->
        <div>
            <h4>导入宿管信息</h4>
            <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
            <h4>导出宿管信息</h4>
            <button @click="exportDormManagers">导出宿管信息</button>
        </div>

        <!-- 搜索宿管 -->
        <input v-model="searchQuery" placeholder="搜索宿管工号、姓名" />

        <!-- 排序按钮 -->
        <div class="sort-buttons">
            <button @click="sortBy('managerId')">按宿管ID排序</button>
            <button @click="sortBy('managerName')">按宿管姓名拼音排序</button>
            <!-- 添加按钮，打开弹窗 -->
            <button @click="openModal()">添加宿管</button>
        </div>


        <!-- 表格显示宿管信息 -->
        <table>
            <thead>
                <tr>
                    <th>宿管ID</th>
                    <th>姓名</th>
                    <th>公寓号</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(manager, index) in currentDormManagers" :key="manager.managerId">
                    <td>{{ manager.managerId }}</td>
                    <td>{{ manager.managerName }}</td>
                    <td>{{ manager.apartmentNumber }}</td>
                    <td>
                        <template v-if="manager.managerId">
                            <button @click="openModal(manager)">编辑</button>
                            <button @click="deleteDormMana(manager.managerId)">删除</button>
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- 翻页控件 -->
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
            <span>第 {{ currentPage }} 页</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
        </div>

        <!-- 弹窗（添加/编辑宿管信息） -->
        <div v-if="isModalVisible" class="modal">
            <div class="modal-content">
                <h3>{{ isEdit ? '编辑宿管' : '添加宿管' }}</h3>
                <form @submit.prevent="saveDormMana">
                    <div>
                        <label for="managerName">宿管姓名:</label>
                        <input v-model="form.managerName" type="text" id="managerName" required />
                    </div>
                    <div>
                        <label for="apartmentNumber">公寓号:</label>
                        <input v-model="form.apartmentNumber" type="text" id="apartmentNumber" required />
                    </div>
                    <button type="submit">{{ isEdit ? '更新' : '添加' }}</button>
                    <button type="button" @click="closeModal">取消</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { getDormManagers, addDormManager, updateDormManager, deleteDormManager } from '@/api/dormManager';
import * as XLSX from 'xlsx';

export default {
    name: 'DormManaList',
    setup() {
        const dormManagers = ref([]);
        const form = ref({
            managerId: '',
            managerName: '',
            apartmentNumber: ''
        });
        const isEdit = ref(false);
        const isModalVisible = ref(false);
        const sortKey = ref('managerId'); // 默认按宿管ID排序
        const isAscending = ref(true); // 默认升序
        const currentPage = ref(1); // 当前页
        const itemsPerPage = ref(10); // 每页显示的条目数
        const searchQuery = ref(''); // 搜索查询

        // 获取宿管信息列表
        const fetchDormManagers = async () => {
            try {
                const response = await getDormManagers();
                dormManagers.value = response.data;
            } catch (error) {
                console.error('获取宿管信息失败:', error);
            }
        };

        // 计算总页数
        const totalPages = computed(() => {
            return Math.ceil(sortedDormManagers.value.length / itemsPerPage.value);
        });

        // 获取当前页的数据，并进行搜索过滤
        const currentDormManagers = computed(() => {
            const filteredManagers = sortedDormManagers.value.filter(manager => {
                return (
                    manager.managerId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                    manager.managerName.toLowerCase().includes(searchQuery.value.toLowerCase())
                );
            });

            const start = (currentPage.value - 1) * itemsPerPage.value;
            const end = start + itemsPerPage.value;
            const currentData = filteredManagers.slice(start, end);
           
            // 计算缺少的行数
            const missingRows = itemsPerPage.value - currentData.length;
            // 填补空行
            for (let i = 0; i < missingRows; i++) {
                currentData.push({ managerId: '', managerName: '', apartmentNumber: '' });
            }
            return currentData;
        });

        // 翻页功能
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

        // 打开弹窗
        const openModal = (manager = null) => {
            if (manager) {
                form.value = { ...manager };
                isEdit.value = true;
            } else {
                resetForm();
                isEdit.value = false;
            }
            isModalVisible.value = true;
        };

        // 关闭弹窗
        const closeModal = () => {
            isModalVisible.value = false;
        };

        // 更新宿管信息
        const saveDormMana = async () => {
            // 验证宿管ID是否满足8位数字的条件
            const managerId = form.value.managerId;
            const isValid = /^\d{8}$/.test(managerId); 
            if (!isValid) {
                alert('宿管ID必须是8位数字！'); 
                return;
            }
            if (form.value.managerName === '' || form.value.apartmentNumber === '') {
                alert('请填写完整信息！');
                return;
            }
            
            if (isEdit.value) {
                try {
                    await updateDormManager(form.value);
                    fetchDormManagers(); // 刷新列表
                    closeModal();
                } catch (error) {
                    console.error('更新宿管信息失败:', error);
                }
            } else {
                try {
                    await addDormManager(form.value);
                    fetchDormManagers(); // 刷新列表
                    closeModal();
                } catch (error) {
                    console.error('添加宿管失败:', error);
                }
            }
        };

        // 删除宿管
        const deleteDormMana = async (managerId) => {
            try {
                await deleteDormManager(managerId);
                fetchDormManagers(); // 刷新列表
            } catch (error) {
                console.error('删除宿管失败:', error);
            }
        };

        // 排序逻辑
        const sortBy = (key) => {
            if (sortKey.value === key) {
                isAscending.value = !isAscending.value; // 如果再次点击同一个字段，则切换升降序
            } else {
                sortKey.value = key;
                isAscending.value = true; // 默认升序
            }
        };

        // 根据选择的字段排序后的宿管列表
        const sortedDormManagers = computed(() => {
            return [...dormManagers.value].sort((a, b) => {
                let result;
                if (sortKey.value === 'managerName') {
                    // 按拼音排序
                    result = a.managerName.localeCompare(b.managerName, 'zh');
                } else {
                    // 按ID排序
                    result = a[sortKey.value] > b[sortKey.value] ? 1 : -1;
                }
                return isAscending.value ? result : -result;
            });
        });

        // 重置表单
        const resetForm = () => {
            form.value = {
                managerId: '',
                managerName: '',
                apartmentNumber: ''
            };
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
                
                // 解析数据并更新宿管信息
                dormManagers.value = jsonData.map(manager => ({
                    managerId: manager['宿管ID'],
                    managerName: manager['姓名'],
                    apartmentNumber: manager['公寓号']
                }));
            };

            reader.readAsArrayBuffer(file);
        };

        const exportDormManagers = () => {
            const wb = XLSX.utils.book_new(); // 创建新的工作簿
            const ws = XLSX.utils.json_to_sheet(dormManagers.value); // 将宿管信息转为工作表
            XLSX.utils.book_append_sheet(wb, ws, '宿管信息'); // 将工作表加入工作簿
            XLSX.writeFile(wb, '宿管信息.xlsx'); // 导出为 Excel 文件
        };

        onMounted(() => {
            fetchDormManagers();
        });

        return {
            dormManagers,
            form,
            isEdit,
            isModalVisible,
            sortedDormManagers,
            currentDormManagers,
            currentPage,
            totalPages,
            nextPage,
            prevPage,
            openModal,
            closeModal,
            saveDormMana,
            deleteDormMana,
            sortBy,
            searchQuery,
            handleFileUpload,
            exportDormManagers
        };
    }
};
</script>

<style scoped>
@import '@/assets/css/table.css';

.dorm-mana-list {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}
</style>
