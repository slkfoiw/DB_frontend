<template>
    <div>
        <el-breadcrumb separator-icon="ArrowRight" style="margin: 16px">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>宿舍管理</el-breadcrumb-item>
            <el-breadcrumb-item>房间信息</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card style="margin: 15px; min-height: calc(100vh - 111px)">
            <div>
                <!-- 导入和导出功能 -->
                <div>
                    <el-upload class="upload-demo" drag accept=".xls, .xlsx" :on-change="handleFileUpload"
                        :auto-upload="false">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">重新导入宿舍信息，将文件拖到此处，或<em>点击上传</em></div>
                    </el-upload>
                    <el-button @click="exportDormRooms">导出宿舍信息</el-button>
                </div>
                <!--    功能区-->
                <div style="margin: 10px 0">
                    <!--    搜索区-->
                    <div style="margin: 10px 0">
                        <el-input v-model="search" clearable placeholder="请输入房间号或学生学号" prefix-icon="Search"
                            style="width: 30%" />
                        <el-button icon="Search" style="margin-left: 5px" type="primary" @click="load" plain="true"></el-button>
                        <div style="float: right">
                            <el-tooltip content="添加房间" placement="top">
                                <el-button icon="plus" style="width: 50px" type="primary" @click="addRoom" plain="true"></el-button>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
                <!--    表格-->
                <el-table :data="dormRooms" style="width: 100%" :sort-method="sortMethod" @sort-change="handleSortChange">
                    <el-table-column label="#" type="index" />
                    <!-- 床位展开-->
                    <el-table-column label="展开" type="expand">
                        <template #default="props">
                            <el-form inline label-position="left">
                                <el-form-item label="一号床位" class="item">
                                    <el-tag v-if="props.row.firstBed != null" disable-transitions type="primary">
                                        {{ props.row.firstBed }}
                                    </el-tag>
                                    <div class="el-form--inline-icon">
                                        <el-icon v-if="props.row.firstBed == null" @click="showBedModal(1, props.row)">
                                            <plus />
                                        </el-icon>
                                        <div v-if="props.row.firstBed != null" class="el-form--inline-icon">
                                            <el-icon @click="detailIcon(1, props.row)">
                                                <more-filled />
                                            </el-icon>
                                            <el-icon @click="showBedModal(1, props.row)">
                                                <edit />
                                            </el-icon>
                                            <el-popconfirm title="确认删除？" @confirm="handleDeleteStuFromBed(1, props.row)">
                                                <template #reference>
                                                    <el-icon>
                                                        <delete />
                                                    </el-icon>
                                                </template>
                                            </el-popconfirm>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item label="二号床位" class="item">
                                    <el-tag v-if="props.row.secondBed != null" disable-transitions type="primary">{{
                                        props.row.secondBed }}
                                    </el-tag>
                                    <div class="el-form--inline-icon">
                                        <el-icon v-if="props.row.secondBed == null" @click="showBedModal(2, props.row)">
                                            <plus />
                                        </el-icon>
                                        <div v-if="props.row.secondBed != null" class="el-form--inline-icon">
                                            <el-icon @click="detailIcon(2, props.row)">
                                                <more-filled />
                                            </el-icon>
                                            <el-icon @click="showBedModal(2, props.row)">
                                                <edit />
                                            </el-icon>
                                            <el-popconfirm title="确认删除？" @confirm="handleDeleteStuFromBed(2, props.row)">
                                                <template #reference>
                                                    <el-icon>
                                                        <delete />
                                                    </el-icon>
                                                </template>
                                            </el-popconfirm>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item label="三号床位" class="item">
                                    <el-tag v-if="props.row.thirdBed != null" disable-transitions type="primary">{{
                                        props.row.thirdBed }}
                                    </el-tag>
                                    <div class="el-form--inline-icon">
                                        <el-icon v-if="props.row.thirdBed == null" @click="showBedModal(3, props.row)">
                                            <plus />
                                        </el-icon>
                                        <div v-if="props.row.thirdBed != null" class="el-form--inline-icon">
                                            <el-icon @click="detailIcon(3, props.row)">
                                                <more-filled />
                                            </el-icon>
                                            <el-icon @click="showBedModal(3, props.row)">
                                                <edit />
                                            </el-icon>
                                            <el-popconfirm title="确认删除？" @confirm="handleDeleteStuFromBed(3, props.row)">
                                                <template #reference>
                                                    <el-icon>
                                                        <delete />
                                                    </el-icon>
                                                </template>
                                            </el-popconfirm>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item label="四号床位" class="item">
                                    <el-tag v-if="props.row.fourthBed != null" disable-transitions type="primary">{{
                                        props.row.fourthBed }}
                                    </el-tag>
                                    <div class="el-form--inline-icon">
                                        <el-icon v-if="props.row.fourthBed == null" @click="showBedModal(4, props.row)">
                                            <plus />
                                        </el-icon>
                                        <div v-if="props.row.fourthBed != null" class="el-form--inline-icon">
                                            <el-icon @click="detailIcon(4, props.row)">
                                                <more-filled />
                                            </el-icon>
                                            <el-icon @click="showBedModal(4, props.row)">
                                                <edit />
                                            </el-icon>
                                            <el-popconfirm title="确认删除？" @confirm="handleDeleteStuFromBed(4, props.row)">
                                                <template #reference>
                                                    <el-icon>
                                                        <delete />
                                                    </el-icon>
                                                </template>
                                            </el-popconfirm>
                                        </div>
                                    </div>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column label="房间号" prop="roomId" sortable />
                    <el-table-column label="楼栋号" prop="dormId" sortable />
                    <el-table-column label="楼层" prop="floor" sortable />
                    <el-table-column label="最多可住人数" prop="capacity" />
                    <el-table-column :filter-method="filterTag" :filters="[
                        { text: 0, value: 0 },
                        { text: 1, value: 1 },
                        { text: 2, value: 2 },
                        { text: 3, value: 3 },
                        { text: 4, value: 4 },
                    ]" filter-placement="bottom-end" label="已住人数" prop="peopleNum" sortable />
                    <!--      操作栏-->
                    <el-table-column label="操作" width="130px">
                        <template #default="scope">
                            <el-button icon="Edit" type="primary" plain="true" @click.stop="editRoom(scope.row)"></el-button>
                            <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row.dormId, scope.row.roomId)">
                                <template #reference>
                                    <el-button icon="Delete" type="danger" plain="true"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <div style="margin: 10px 0">
                    <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange"
                        :current-page="currentPage" :page-size="pageSize" :page-sizes="[10, 20]" :total="totalitems"
                        layout="total, sizes, prev, pager, next, jumper" :disabled="totalitems === 0">
                    </el-pagination>
                </div>
                <!--      弹窗-->
                <div>
                    <!-- 添加房间-->
                    <el-dialog v-model="addRoomDialog" title="房间信息" @close="cancel">
                        <h3>添加房间</h3>
                        <el-form ref="formRef" :model="form" label-width="120px">
                            <el-form-item label="楼栋号" prop="dormId" required>
                                <el-input v-model="form.dormId" style="width: 80%"></el-input>
                            </el-form-item>
                            <el-form-item label="楼层数" prop="floor" required>
                                <el-input v-model="form.floor" style="width: 80%"></el-input>
                            </el-form-item>
                            <el-form-item label="房间号" prop="roomId" required>
                                <el-input v-model="form.roomId" style="width: 80%"></el-input>
                            </el-form-item>
                            <el-form-item label="最多可住人数" prop="capacity" required>
                                <el-input v-model="form.capacity" style="width: 80%"></el-input>
                            </el-form-item>
                            <el-form-item label="已住人数" prop="peopleNum">
                                <el-input v-model="form.peopleNum" style="width: 80%" :disabled=true>0</el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary"  @click="saveNewRoom">添加</el-button>
                                <el-button type="default"  @click="cancel">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                    <!-- 编辑房间-->
                    <el-dialog v-model="editRoomDialog" title="编辑操作" width="30%" @close="cancel">
                        <el-form ref="formRef" :model="form" label-width="120px">
                            <el-form-item label="楼栋号" prop="dormId">
                                <el-input v-model.number="form.dormId" :disabled="disabled"
                                    style="width: 80%"></el-input>
                            </el-form-item>
                            <el-form-item label="楼层数" prop="floor">
                                <el-input v-model.number="form.floor" style="width: 80%"></el-input>
                            </el-form-item>
                            <el-form-item label="房间号" prop="roomId">
                                <el-input v-model.number="form.roomId" :disabled="disabled"
                                    style="width: 80%"></el-input>
                            </el-form-item>
                            <el-form-item label="最多可住人数" prop="capacity">
                                <el-input v-model.number="form.capacity" style="width: 80%"></el-input>
                            </el-form-item>
                            <el-form-item label="已住人数" prop="peopleNum">
                                <el-input v-model.number="form.peopleNum" :disabled=true
                                    style="width: 80%"></el-input>
                            </el-form-item>
                        </el-form>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button @click="cancel">取 消</el-button>
                                <el-button type="primary" @click="saveUpdateRoom">确 定</el-button>
                            </span>
                        </template>
                    </el-dialog>
                    <!-- 床位 弹窗-->
                    <el-dialog v-model="bedDialog" title="操作" width="30%" @close="cancel">
                        <el-form ref="formRef" :model="form" label-width="120px">
                            <el-form-item label="楼栋号" prop="dormId">
                                <el-input v-model.number="form.dormId" :disabled="true" style="width: 80%"></el-input>
                            </el-form-item>
                            <el-form-item label="楼层数" prop="floor">
                                <el-input v-model.number="form.floor" :disabled="true" style="width: 80%"></el-input>
                            </el-form-item>
                            <el-form-item label="房间号" prop="roomId">
                                <el-input v-model.number="form.roomId" :disabled="true" style="width: 80%"></el-input>
                            </el-form-item>
                            <el-form-item v-if="bedNum === 1" label="床位(一)" prop="firstBed">
                                <el-input v-model.number="form.firstBed" placeholder="请输入学号"
                                    style="width: 80%"></el-input>
                            </el-form-item>
                            <el-form-item v-if="bedNum === 2" label="床位(二)" prop="secondBed">
                                <el-input v-model.number="form.secondBed" placeholder="请输入学号"
                                    style="width: 80%"></el-input>
                            </el-form-item>
                            <el-form-item v-if="bedNum === 3" label="床位(三)" prop="thirdBed">
                                <el-input v-model.number="form.thirdBed" placeholder="请输入学号"
                                    style="width: 80%"></el-input>
                            </el-form-item>
                            <el-form-item v-if="bedNum === 4" label="床位(四)" prop="fourthBed">
                                <el-input v-model.number="form.fourthBed" placeholder="请输入学号"
                                    style="width: 80%"></el-input>
                            </el-form-item>
                        </el-form>
                        <template #footer>
                            <span class="dialog-footer">
                                <el-button @click="cancel">取 消</el-button>
                                <el-button type="primary" @click="saveStuBed">确 定</el-button>
                            </span>
                        </template>
                    </el-dialog>
                    <!-- 学生信息弹窗-->
                    <el-dialog v-model="stuInfoDialog" title="学生信息" width="20%" @close="cancel">
                        <el-form ref="formRef" :model="stuForm" label-width="120px">
                            <el-form-item label="学号：" prop="studentId">
                                <span>{{ stuForm.studentId }}</span>
                            </el-form-item>
                            <el-form-item label="用户名：" prop="username">
                                <span>{{ stuForm.username }}</span>
                            </el-form-item>
                            <el-form-item label="姓名：" prop="name">
                                <span>{{ stuForm.name }}</span>
                            </el-form-item>
                            <el-form-item label="专业：" prop="major">
                                <span>{{ stuForm.major }}</span>
                            </el-form-item>
                            <el-form-item label="性别：" prop="gender">
                                <span>{{ stuForm.gender }}</span>
                            </el-form-item>
                            <el-form-item label="个人简介：" prop="introduction">
                                <span>{{ stuForm.introduction }}</span>
                            </el-form-item>
                            <el-form-item label="邮箱地址：" prop="email">
                                <span>{{ stuForm.email }}</span>
                            </el-form-item>
                        </el-form>
                    </el-dialog>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { updateAllRoomInfos, getDormRooms, deleteDormRoom, updateDormRoom, addDormRoom, updateBed, deleteStuFromBed } from '@/api/roomInfo';
import { getStudentById } from '@/api/student';
import { ElMessage } from "element-plus";
import * as XLSX from 'xlsx';
import { parseString } from 'xml2js';
import { MoreFilled, Edit } from '@element-plus/icons-vue';

const dormRooms = ref([]);
const search = ref('');
const totalitems = ref(0);
const form = ref({ roomId: '', dormId: '', floor: '', capacity: '', peopleNum: '', firstBed: '', secondBed: '', thirdBed: '', fourthBed: '' });
const oldroomId = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const judge = ref(false);
const dialogVisible = ref(false);
const addRoomDialog = ref(false);
const disabled = ref(false);
const bedDialog = ref(false);
const stuInfoDialog = ref(false);
const stuForm = ref({ studentId: '', username: '', name: '', major: '', gender: '', introduction: '', email: '' });
const bedNum = ref(0);
const editRoomDialog = ref(false);
const sortField = ref('');
const sortOrder = ref('');

const resetForm = () => {
    form.value = { roomId: '', dormId: '', floor: '', capacity: '', peopleNum: '', firstBed: '', secondBed: '', thirdBed: '', fourthBed: '' };
}

const addRoom = () => {
    disabled.value = false;
    resetForm();
    form.value.peopleNum = 0;
    judge.value = false;
    addRoomDialog.value = true;
    console.log('add');
};

const editRoom = (room) => {
    console.log('edit room:', room);
    form.value = { ...room };
    oldroomId.value = room.roomId;
    editRoomDialog.value = true;
    disabled.value = true;
};

const cancel = () => {
    resetForm();
    dialogVisible.value = false;
    bedDialog.value = false;
    stuInfoDialog.value = false;
    addRoomDialog.value = false;
    editRoomDialog.value = false;
};

const saveNewRoom = async () => {
    const res = await addDormRoom(form.value);
    if (res.code !== 0) {
        ElMessage.error(res.msg);
        return;
    }
    ElMessage.success(res.msg);
    cancel();
    await load();
}

const saveUpdateRoom = async () => {
    const res = await updateDormRoom(form.value);
    if (res.code !== 0) {
        ElMessage.error(res.msg);
        return;
    }
    ElMessage.success(res.msg);
    cancel();
    await load();
}

const load = async () => {
    const response = await getDormRooms({ 
        pageNum: currentPage.value, 
        pageSize: pageSize.value, 
        search: search.value,
        sortField: sortField.value,
        sortOrder: sortOrder.value,
    });
    if (response.code !== 0) {
        ElMessage.error('获取宿舍信息失败: ' + response.msg);
        return;
    }
    dormRooms.value = response.data.records;
    totalitems.value = response.data.total;
};

const handleCurrentChange = async (pageNum) => {
    currentPage.value = pageNum;
    await load();
};

const handleSizeChange = async (newPageSize) => {
    pageSize.value = newPageSize;
    await load();
};

const handleSortChange = (sort) => {
    sortField.value = sort.prop;
    sortOrder.value = sort.order === 'ascending' ? 'asc' : 'desc';
    load();
};

const filterTag = (value, row) => {
    return row.peopleNum === value;
};

const showBedModal = (num, info) => {
    //显示对应床位input
    bedNum.value = num;
    //修改床位所住的学生
    bedDialog.value = true;
    resetForm();
    form.value = { ...info };
};

const detailIcon = async (num, info) => {
    //查看床位所住的学生
    let stu = "";
    // 删除
    if (num === 1) {
        stu = info.firstBed;
    } else if (num === 2) {
        stu = info.secondBed;
    } else if (num === 3) {
        stu = info.thirdBed;
    } else if (num === 4) {
        stu = info.fourthBed;
    }
    const res = await getStudentById(stu);
    console.log('getStudentById res:', res);
    if (res.code !== 0) {
        ElMessage.error(res.msg);
        return;
    }
    stuForm.value = res.data;
    stuInfoDialog.value = true;
}

const handleDeleteStuFromBed = async (num, info) => {
    const res = await deleteStuFromBed({dormId: info.dormId, roomId: info.roomId, bedId: num});
    console.log('deleteStuFromBed res:', res);
    if (res.code !== 0) {
        ElMessage.error(res.msg);
    } else {
        ElMessage.success(res.msg);
    }
    await load();
};

const handleDelete = async (dormId, roomId) => {
    try {
        const res = await deleteDormRoom({dormId, roomId});
        if (res.code !== 0) throw new Error(res.msg);
        ElMessage.success(res.msg);
    } catch (error) {
        ElMessage.error(error.message);
    } finally {
        await load();
    }
};

const saveStuBed = async () => {
    console.log('bedNum:', bedNum.value);
    let studentId;
    if (bedNum.value === 1) {
        studentId = form.value.firstBed;
    } else if (bedNum.value === 2) {
        studentId = form.value.secondBed;
    } else if (bedNum.value === 3) {
        studentId = form.value.thirdBed;
    } else if (bedNum.value === 4) {
        studentId = form.value.fourthBed;
    }
    const res = await updateBed({
        dormId: form.value.dormId,
        roomId: form.value.roomId,
        bedId: bedNum.value,
        studentId: studentId,
    });
    if (res.code !== 0) {
        ElMessage.error(res.msg);
        return;
    }
    ElMessage.success(res.msg);
    cancel();
    await load();
};

const handleFileUpload = (file) => {
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
    try {
        const workbook = XLSX.read(data, { type: 'array' });
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
        const res = await updateAllRoomInfos(jsonData);
        if (res.code !== 0) throw new Error(res.msg);
        ElMessage.success(res.msg);
    } catch (error) {
        ElMessage.error(error.message);
    }
};

const parseXML = async (data) => {
    parseString(data, async (err, result) => {
        if (err) {
            ElMessage.error('XML解析失败!');
            return;
        }
        try {
            const res = await updateAllRoomInfos(result);
            if (res.code !== 0) throw new Error(res.msg);
            ElMessage.success(res.msg);
        } catch (error) {
            ElMessage.error(error.message);
        }
    });
};

const exportDormRooms = async () => {
    const wb = XLSX.utils.book_new();
    const res = await getDormRooms({
        pageNum: 1, 
        pageSize: 1000000, 
        search: search.value,
        sortField: sortField.value,
        sortOrder: sortOrder.value
    });
    const ws = XLSX.utils.json_to_sheet(res.data.records);
    XLSX.utils.book_append_sheet(wb, ws, '宿舍信息');
    XLSX.writeFile(wb, '宿舍信息.xlsx');
};

onMounted(load);

</script>

<style scoped>
.demo-table-expand {
    font-size: 0;
}

.demo-table-expand label {
    text-align: center;
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    text-align: center;
    margin-right: 0;
    margin-bottom: 0;
    width: 25%;
}

.el-form--inline-icon {
    margin-left: 5px;
    display: flex;
    font-size: 16px;
}

.el-form--inline-icon>.el-icon {
    cursor: pointer;
    margin: 0 5px;
}

.item {
    margin-left: 50px;
    margin-bottom: 0;
    width: 20%;

}
</style>