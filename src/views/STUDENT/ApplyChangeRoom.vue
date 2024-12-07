<template>
  <div>
    <el-breadcrumb separator-icon="ArrowRight" style="margin: 16px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>申请管理</el-breadcrumb-item>
      <el-breadcrumb-item>调宿申请</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin: 15px; min-height: calc(100vh - 111px)">
      <div>
        <!-- 功能区 -->
        <div style="margin: 10px 0">
          <!-- 搜索区 -->
          <div style="margin: 10px 0">
            <el-input v-model="search" clearable placeholder="请输入学号" prefix-icon="Search" style="width: 20%" />
            <el-button icon="Search" style="margin-left: 5px" type="primary" @click="load"></el-button>
            <div style="float: right">
              <el-tooltip content="添加" placement="top">
                <el-button icon="Plus" style="width: 50px" type="primary" @click="add"></el-button>
              </el-tooltip>
            </div>
          </div>
        </div>
        <!-- 表格 -->
        <el-table v-loading="loading" :data="tableData" border max-height="705" style="width: 100%">
          <el-table-column label="#" type="index" />
          <el-table-column label="学号" prop="studentId" sortable width="100px" />
          <el-table-column label="姓名" prop="name" width="100px" />
          <el-table-column label="当前公寓号" prop="curDormId" sortable />
          <el-table-column label="当前宿舍号" prop="curRoomId" sortable />
          <el-table-column label="当前床位号" prop="curBedId" sortable />
          <el-table-column label="目标公寓号" prop="toDormId" sortable/>
          <el-table-column label="目标宿舍号" prop="toRoomId" sortable />
          <el-table-column label="目标床位号" prop="toBedId" sortable />
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
              <el-tag
                :type="scope.row.status === '通过' ? 'success' : (scope.row.status === '驳回' ? 'danger' : 'info')"
                disable-transitions
              >
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" prop="createDate" sortable />
          <el-table-column label="处理时间" prop="finishDate" sortable />
          <!-- 操作栏 -->
          <el-table-column label="操作" width="130px">
            <template #default="scope">
              <el-button icon="MoreFilled" type="default" @click="showDetail(scope.row)"></el-button>
              <el-button v-if="scope.row.status === '未处理' && scope.row.studentId === user.userId" icon="Edit" type="primary" @click="handleEdit(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div style="margin: 10px 0">
          <el-pagination
            v-model:currentPage="currentPage"
            :page-size="pageSize"
            :page-sizes="[10, 20]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <!-- 弹窗 -->
        <el-dialog v-model="dialogVisible" title="修改" width="30%" @close="cancel">
          <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="学号" prop="studentId">
              <el-input v-model="form.studentId" disabled style="width: 80%" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" disabled style="width: 80%" />
            </el-form-item>
            <el-form-item label="当前公寓号" prop="curDormId">
              <el-input v-model="form.curDormId" disabled style="width: 80%" />
            </el-form-item>
            <el-form-item label="当前宿舍号" prop="curRoomId">
              <el-input v-model="form.curRoomId" disabled style="width: 80%" />
            </el-form-item>
            <el-form-item label="当前床位号" prop="curBedId">
              <el-input v-model="form.curBedId" disabled style="width: 80%" />
            </el-form-item>
            <el-form-item label="目标公寓号" prop="toDormId">
              <el-select v-model="form.toDormId" placeholder="选择公寓号" style="width: 80%">
                <el-option v-for="build in dormBuildings" :key="build.id" :label="build.name" :value="build.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="目标宿舍号" prop="toRoomId">
              <el-input v-model.number="form.toRoomId" style="width: 80%" />
            </el-form-item>
            <el-form-item label="目标床位号" prop="toBedId">
              <el-input v-model.number="form.toBedId" style="width: 80%" />
            </el-form-item>
            <el-form-item label="申请时间" prop="createDate" style="margin-top: 27px">
              <el-date-picker
                v-model="form.createDate"
                :disabled="!judgeOption"
                clearable
                placeholder="选择时间"
                style="width: 50%"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" @click="save">确定</el-button>
            </span>
          </template>
        </el-dialog>
        <!-- 详情信息弹窗 -->
        <el-dialog v-model="detailDialog" title="学生信息" width="30%" @close="cancel">
          <el-form ref="formRef" :model="form" label-width="220px">
            <el-form-item label="学号：" prop="studentId">
              <span>{{ form.studentId }}</span>
            </el-form-item>
            <el-form-item label="姓名：" prop="name">
              <span>{{ form.name }}</span>
            </el-form-item>
            <el-form-item label="当前公寓号：" prop="curDormId">
              <span>{{ form.curDormId }}</span>
            </el-form-item>
            <el-form-item label="当前宿舍号：" prop="curRoomId">
              <span>{{ form.curRoomId }}</span>
            </el-form-item>
            <el-form-item label="当前床位号：" prop="curBedId">
              <span>{{ form.curBedId }}</span>
            </el-form-item>
            <el-form-item label="目标公寓号：" prop="toDormId">
              <span>{{ form.toDormId }}</span>
            </el-form-item>
            <el-form-item label="目标宿舍号：" prop="toRoomId">
              <span>{{ form.toRoomId }}</span>
            </el-form-item>
            <el-form-item label="目标床位号：" prop="toBedId">
              <span>{{ form.toBedId }}</span>
            </el-form-item>
            <el-form-item label="申请时间：" prop="createDate">
              <span>{{ form.createDate }}</span>
            </el-form-item>
            <el-form-item label="申请状态：" prop="status">
              <span>{{ form.status }}</span>
            </el-form-item>
            <el-form-item label="处理时间：" prop="finishDate">
              <span>{{ form.finishDate }}</span>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script setup>

import { ref, reactive, onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { checkRoomState, checkRoomExist, checkBedState, fetchAdjustRoomData, updateAdjustRoom, addAdjustRoom } from '@/api/applyChangeRoom'; // 导入API
import { getRoomBedUserId } from '@/api/myRoomInfo';
import { useUserStore } from '@/store/user';

const filterTag = (value, row) => {
  return row.status === value;
};
const user = useUserStore().userInfo;
const loading = ref(true);
const dialogVisible = ref(false);
const detailDialog = ref(false);
const search = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref([]);
const dormRoomId = ref(0);
const orderState = ref(false);
const judgeOption = ref(false);
const formRef = ref(null);
const form = reactive({
      id:'',
      studentId: '',
      name: '',
      curDormId: '',
      curRoomId: '',
      curBedId: '',
      toDormId: '',
      toRoomId: '',
      toBedId: '',
      createDate: '',
      status: '',
      finishDate: ''
    });

const roomForm = reactive({
  dormId:'',
	roomId:'',
  firstBed: '',
  secondBed: '',
  thirdBed: '',
  fourthBed: ''
});

// 检查房间状态
const checkRoomStateHandler = async (rule, value, callback) => {
  dormRoomId.value = value;
  if (typeof value === "number") {
    try {
      const res = await checkRoomState(form.toDormId, dormRoomId.value);
      const result = await checkRoomExist(form.toDormId, dormRoomId.value);
      if (result.code === -1) {
        callback(new Error(result.msg));
      } else if (res.code === -1) {
        callback(new Error(res.msg));
      } else {
        callback();
      }
    } catch (error) {
      callback(new Error("请求失败"));
    }
  } else {
    callback(new Error("请输入正确的数据"));
  }
};

// 检查床位状态
const checkBedStateHandler = async (rule, value, callback) => {
  try {
    const res = await checkBedState(form.toDormId, dormRoomId.value, value);
    if (res.code === 0) {
      console.log(res);
      callback();
    } else {
      callback(new Error(res.msg));
    }
  } catch (error) {
    callback(new Error("请求失败"));
  }
};

const rules = reactive({
  studentId: [
    { required: true, message: "请输入学号", trigger: "blur" },
    { pattern: /^[a-zA-Z0-9]{4,9}$/, message: "必须由 4 到 9 个字母或数字组成", trigger: "blur" },
  ],
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { pattern: /^(?:[\u4E00-\u9FA5·]{2,10})$/, message: "必须由 2 到 10 个汉字组成", trigger: "blur" },
  ],
  curRoomId: [
    { required: true, message: "请输入当前宿舍号", trigger: "blur" },
  ],
  curBedId: [
    { required: true, message: "请输入当前床位号", trigger: "blur" },
  ],
  toRoomId: [
    { validator: checkRoomStateHandler, trigger: "blur" },
  ],
  toBedId: [
    { validator: checkBedStateHandler, trigger: "blur" },
  ],
});

// 加载数据
const load = async () => {
  try {
    const res = await fetchAdjustRoomData({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      search: search.value,
    });
    tableData.value = res.data.records;
    total.value = res.data.total;
    loading.value = false;
  } catch (error) {
    console.error('加载数据失败', error);
  }
};

// 添加记录时，打开对话框并初始化表单
const add = () => {
  dialogVisible.value = true;
  nextTick(async () => {
    formRef.value.resetFields();
    const user = useUserStore().userInfo;
    form.studentId = user.userId;
    form.name = user.name;
    
    const res = await getRoomBedUserId(form.studentId);
    if (res.code === 0) {
      form.curDormId = res.data.dormId;
      form.curRoomId = res.data.roomId;
      roomForm.value = res.data;
      form.curBedId = calBedNum(form.studentId, roomForm.value);
    } else {
      ElMessage({
        message: res.msg,
        type: "error",
      });
    }
    judgeOption.value = true;
  });
};

// 保存数据
const save = () => {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        if (!judgeOption.value) {
          judgeOrderState(form.status);
          const res = await updateAdjustRoom(orderState.value, form);
          handleResponse(res, "修改成功");
        } else {
          const res = await addAdjustRoom(form);
          handleResponse(res, "添加成功");
        }
      } catch (error) {
        ElMessage({ message: "请求失败", type: "error" });
      }
    }
  });
};

// 计算床位号
const calBedNum = (studentId, data) => {
  console.log(data.firstBed === null);
  if (data.firstBed != null && data.firstBed === studentId) return 1;
  if (data.secondBed != null && data.secondBed === studentId) return 2;
  if (data.thirdBed != null && data.thirdBed === studentId) return 3;
  if (data.fourthBed != null && data.fourthBed === studentId) return 4;
};

// 判断订单状态
const judgeOrderState = (status) => {
  if (status === '通过') orderState.value = true;
  else orderState.value = false;
};

// 处理响应
const handleResponse = (res, successMessage) => {
  if (res.code === 0) {
    ElMessage({
      message: successMessage,
      type: "success",
    });
    search.value = "";
    load();
    dialogVisible.value = false;
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
    });
  }
};

// 取消操作
const cancel = () => {
  formRef.value.resetFields();
  dialogVisible.value = false;
  detailDialog.value = false;
};

// 显示详情
const showDetail = (row) => {
  detailDialog.value = true;
  nextTick(() => {
    formRef.value.resetFields();
    Object.assign(form, row); // 拷贝行数据
  });
};

// 编辑记录
const handleEdit = (row) => {
  dialogVisible.value = true;
  nextTick(() => {
    formRef.value.resetFields();
    Object.assign(form, row);
    judgeOption.value = false;
  });
};

// 处理分页改变
const handleSizeChange = (pageSize) => {
  pageSize.value = pageSize;
  load();
};

const handleCurrentChange = (pageNum) => {
  currentPage.value = pageNum;
  load();
};

const dormBuildings = ref([
  {id: '1', name: '1-南区学生公寓-女'},
  {id: '2', name: '2-南区学生公寓-女'},
  {id: '3', name: '3-南区学生公寓-女'},
  {id: '4', name: '4-南区学生公寓-男'},
  {id: '5', name: '5-南区学生公寓-男'},
  {id: '6', name: '6-南区学生公寓-男'},
  {id: '11', name: '11-北区学生公寓-混合'},
  {id: '12', name: '12-北区学生公寓-女'},
  {id: '13', name: '13-北区学生公寓-女'},
  {id: '15', name: '15-北区学生公寓-男'},
  {id: '16', name: '16-北区学生公寓-男'},
  {id: '21', name: '21-大运村学生公寓-混合'},
  {id: '22', name: '22-大运村学生公寓-混合'},
  {id: '23', name: '23-大运村学生公寓-女'},
  {id: '24', name: '24-大运村学生公寓-男'},
]);

onMounted(() => {
  load();
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>
