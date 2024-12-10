<template>
    <div>
      <el-breadcrumb separator-icon="ArrowRight" style="margin: 16px">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>信息管理</el-breadcrumb-item>
        <el-breadcrumb-item>调宿记录</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card style="margin: 15px; min-height: calc(100vh - 111px)">
        <div>
          <!--    功能区-->
          <div style="margin: 10px 0">
            <!--    搜索区-->
            <div style="margin: 10px 0">
              <el-input v-model="searchQuery" clearable placeholder="请输入学号" prefix-icon="Search" style="width: 20%"/>
              <el-button icon="Search" style="margin-left: 5px" type="primary" @click="load"></el-button>
            </div>
          </div>
          <!--    表格-->
          <el-table :data="tableData" border max-height="705" style="width: 100%" :sort-method="sortMethod" @sort-change="handleSortChange">
            <el-table-column label="#" type="index"/>
            <el-table-column label="学号" prop="studentId" sortable width="100px"/>
            <el-table-column label="当前公寓号" prop="curDormId" sortable/>
            <el-table-column label="当前房间号" prop="curRoomId" sortable/>
            <!-- <el-table-column label="当前床位号" prop="curBedId" sortable/> -->
            <el-table-column label="目标公寓号" prop="toDormId" sortable/>
            <el-table-column label="目标房间号" prop="toRoomId" sortable/>
            <!-- <el-table-column label="目标床位号" prop="toBedId" sortable/> -->
            <el-table-column
                :filter-method="filterTag"
                :filters="[
                { text: '未处理', value: '未处理' },
                { text: '通过', value: '通过' },
                { text: '驳回', value: '驳回' },
              ]"
                filter-placement="bottom-end"
                label="申请状态"
                prop="status"
                sortable
                width="130px"
            >
              <template #default="scope">
                <el-tag :type="scope.row.status === '通过' ? 'success' : (scope.row.status === '驳回' ? 'danger' : 'info')"
                        disable-transitions
                >{{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="申请时间" prop="createDate" sortable/>
            <!-- <el-table-column label="处理时间" prop="finishDate" sortable/> -->
            <!--      操作栏-->
            <el-table-column label="操作" width="190px">
              <template #default="scope">
                <el-button v-if="scope.row.status==='通过' ||scope.row.status==='驳回'" icon="more-filled" type="default"
                           @click="showDetail(scope.row)"></el-button>
                <el-button v-if="scope.row.status!=='通过' " icon="Edit" type="primary"
                           @click="handleEdit(scope.row)"></el-button>
                <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row.id)">
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
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            >
            </el-pagination>
          </div>
          <div>
            <!--      弹窗-->
            <el-dialog v-model="dialogVisible" title="操作" width="30%" @open="fetchEmptyBeds" @close="cancel">
              <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="学号" prop="studentId">
                  <el-input v-model="form.studentId" disabled style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="当前公寓号" prop="curDormId">
                  <el-input v-model="form.curDormId" disabled style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item disabled label="当前房间号" prop="curRoomId">
                  <el-input v-model="form.curRoomId" disabled style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="当前床位号" prop="curBedId">
                  <el-input v-model="form.curBedId" disabled style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="目标公寓号" prop="toDormId">
                  <el-input v-model="form.toDormId" style="width: 80%"></el-input>
                </el-form-item>
                <el-form-item label="目标房间号" prop="toRoomId">
                  <el-input v-model="form.toRoomId" style="width: 80%"></el-input>
                </el-form-item>
<!-- 动态下拉框 -->
                <el-form-item label="目标床位号：" prop="toBedId" required>
                <el-select v-model="form.toBedId" placeholder="请选择目标床位号" style="width: 100%;">
                <el-option v-for="bed in emptyBeds" :key="bed" :label="'床位 ' + bed" :value="bed"></el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="申请时间" prop="createDate" style="margin-top: 27px">
                  <el-date-picker
                      v-model="form.createDate"
                      clearable
                      disabled
                      placeholder="选择时间"
                      style="width: 50%"
                      type="datetime"
                      value-format="YYYY-MM-DD HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="申请状态" prop="status" required>
                  <el-radio-group v-model="form.status">
                    <el-radio :label="0">通过</el-radio>
                    <el-radio :label="1">驳回</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="处理时间" prop="finishDate" style="margin-top: 27px" required>
                  <el-date-picker
                      v-model="form.finishDate"
                      clearable
                      placeholder="选择时间"
                      style="width: 50%"
                      type="datetime"
                      value-format="YYYY-MM-DD HH:mm:ss"
                  ></el-date-picker>
                </el-form-item>
              </el-form>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="cancel">取 消</el-button>
                  <el-button type="primary" @click="save">确 定</el-button>
                </span>
              </template>
            </el-dialog>
            <!--详情信息弹窗-->
            <el-dialog v-model="detailDialog" title="学生信息" width="30%" @close="cancel">
              <el-form ref="formRef" :model="form" label-width="220px">
                <el-form-item label="学号：" prop="studentId">
                  <template #default="">
                    <span>{{ form.studentId }}</span>
                  </template>
                </el-form-item>
                <el-form-item label="当前公寓号：" prop="curDormId">
                  <template #default="">
                    <span>{{ form.curDormId }}</span>
                  </template>
                </el-form-item>
                <el-form-item label="当前房间号：" prop="curRoomId">
                  <template #default="">
                    <span>{{ form.curRoomId }}</span>
                  </template>
                </el-form-item>
                <el-form-item label="当前床位号：" prop="curBedId">
                  <template #default="">
                    <span>{{ form.curBedId }}</span>
                  </template>
                </el-form-item>
                <el-form-item label="目标公寓号：" prop="toDormId">
                  <template #default="">
                    <span>{{ form.toDormId }}</span>
                  </template>
                </el-form-item>
                <el-form-item label="目标房间号：" prop="toRoomId">
                  <template #default="">
                    <span>{{ form.toRoomId }}</span>
                  </template>
                </el-form-item>
                <el-form-item label="目标床位号：" prop="toBedId">
                  <template #default="">
                    <span>{{ form.toBedId }}</span>
                  </template>
                </el-form-item>
                <el-form-item label="申请时间：" prop="createDate">
                  <template #default="">
                    <span>{{ form.createDate }}</span>
                  </template>
                </el-form-item>
                <el-form-item label="申请状态：" prop="status">
                  <template #default="">
                    <span>{{ form.status }}</span>
                  </template>
                </el-form-item>
                <el-form-item label="处理时间：" prop="finishDate">
                  <template #default="">
                    <span>{{ form.finishDate }}</span>
                  </template>
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
import { getChangeRoom, updateChangeRoom, deleteChangeRoom } from '@/api/admin';
import { ElMessage } from 'element-plus';
import { getEmptyBedId } from '@/api/myRoomInfo';

const tableData = ref([]);
const dialogVisible = ref(false);
const detailDialog = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const sortField = ref('');
const sortOrder = ref('');

const form = ref({
    id: '',
    studentId: '',
    curDormId: '',
    curRoomId: '',
    curBedId: '',
    toDormId: '',
    toRoomId: '',
    toBedId: '',
    status: '',
    createDate: '',
    finishDate: '',
});

const emptyBeds = ref([]); // 存储空床位列表

// 获取空床位数据
const fetchEmptyBeds = async () => {
    try {
        console.log('Fetching empty beds:', form.value.toDormId, form.value.toRoomId);
        const response = await getEmptyBedId({ dormId: form.value.toDormId, roomId: form.value.toRoomId });
        if (response.code !== 0) {
            ElMessage.error(response.msg);
            return;
        }
        console.log('Empty beds:', response.data);
        emptyBeds.value = response.data; // 更新空床位数据
    } catch (error) {
        console.error('Error fetching empty beds:', error);
        ElMessage.error('获取空床位失败！');
    }
};

const filterTag = (value, row) => {
    return row.status === value;
};

// 方法：获取换宿数据
const load = async () => {
    try {
        const response = await getChangeRoom({
          pageNum: currentPage.value, 
          pageSize: pageSize.value, 
          search: searchQuery.value,
          sortField: sortField.value,
          sortOrder: sortOrder.value,
        });
        if (response.code !== 0) {
          ElMessage.error(response.msg);
          return;
        }
        console.log(response.data);
        tableData.value = response.data.records;
        total.value = response.data.total;
    } catch (error) {
        console.error('Error fetching data:', error);
        ElMessage.error('获取换宿数据失败！');
    }
};

// 方法：显示详情
const showDetail = (changeRoom) => {
    form.value = { ...changeRoom };
    detailDialog.value = true;
};

// 方法：取消操作
const cancel = () => {
    dialogVisible.value = false;
    detailDialog.value = false;
    resetForm();
};

// 方法：编辑数据
const handleEdit = async(changeRoom) => {
    form.value = { ...changeRoom };
    console.log(form.value);
    dialogVisible.value = true;
  };

// 方法：保存数据
const save = async () => {
  const res = await updateChangeRoom(form.value);
  if (res.code !== 0) {
    ElMessage.error(res.msg);
    return;
  }
  ElMessage.success(res.msg);
  await load(); // 刷新数据
  cancel();
};

// 方法：删除数据
const handleDelete = async (id) => {
    try {
      console.log('Delete:', id);
      const res = await deleteChangeRoom(id);
      if (res.code !== 0) ElMessage.error(res.msg);
      ElMessage.success(res.msg);
    } catch (error) {
        ElMessage.error(error.msg);
    }
    await load(); // 刷新数据
};

// 分页处理
const handleCurrentChange = async (pageNum) => {
    currentPage.value = pageNum;
    await load(); // 更新当前页数据
};

const handleSizeChange = async (newPageSize) => {
    pageSize.value = newPageSize;
    await load(); // 更新每页显示数量
};

const handleSortChange = (sort) => {
    sortField.value = sort.prop;
    sortOrder.value = sort.order === 'ascending' ? 'asc' : 'desc';
    load();
};

// 方法：重置表单
const resetForm = () => {
    form.value = {
        id: null,
        studentId: '',
        curDormId: '',
        curRoomId: '',
        curBedId: '',
        toDormId: '',
        toRoomId: '',
        toBedId: '',
        status: '',
        createDate: '',
        finishDate: null,
    };
};

// 生命周期钩子
onMounted(load);

</script>
