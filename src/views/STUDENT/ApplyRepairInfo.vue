<template>
  <div>
    <el-breadcrumb separator-icon="ArrowRight" style="margin: 16px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>申请报修</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin: 15px; min-height: calc(100vh - 111px)">
      <div>
        <!--    功能区-->
        <div style="margin: 10px 0">
          <!--    搜索区-->
          <div style="margin: 10px 0">
            <el-input v-model="search" clearable placeholder="请输入标题" prefix-icon="Search" style="width: 20%"/>
            <el-button icon="Search" style="margin-left: 5px" type="primary" @click="load"></el-button>
            <div style="float: right">
              <el-tooltip content="添加" placement="top">
                <el-button icon="plus" style="width: 50px" type="primary" @click="add"></el-button>
              </el-tooltip>
            </div>
          </div>
        </div>
        <!--    表格-->
        <el-table v-loading="loading" :data="tableData" border max-height="705" style="width: 100%">
          <el-table-column label="#" type="index"/>
          <el-table-column :show-overflow-tooltip="true" label="标题" prop="title"/>
          <el-table-column label="公寓号" prop="dormId" sortable width="150px"/>
          <el-table-column label="宿舍号" prop="roomId" sortable width="150px"/>
          <el-table-column label="申请人" prop="repairer" width="150px"/>
          <el-table-column
              :filter-method="filterTag"
              :filters="[
              { text: '已完成', value: '已完成' },
              { text: '未完成', value: '未完成' },
            ]"
              filter-placement="bottom-end"
              label="订单状态"
              prop="status"
              sortable
          >
            <template #default="scope">
              <el-tag :type="scope.row.status === '已完成' ? 'success' : 'info'" disable-transitions
              >{{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="订单创建时间" prop="createDate" sortable/>
          <el-table-column label="订单完成时间" prop="finishDate" sortable/>
          <!--      详情栏-->
          <el-table-column label="详情" width="74px">
            <template #default="scope">
              <el-button icon="more-filled" type="default" @click="showDetail(scope.row)"></el-button>
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
        <!--      弹窗-->
        <div>
          <el-dialog v-model="dialogVisible" title="添加" width="30%" @close="cancel">
            <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="公寓号" prop="dormId" style="margin-bottom: 27px">
                <el-input v-model="form.dormId" disabled style="width: 80%">{{ this.room.dormId }}</el-input>
              </el-form-item>
              <el-form-item label="宿舍号" prop="roomId" style="margin-bottom: 27px">
                <el-input v-model="form.roomId" disabled style="width: 80%">{{ this.room.roomId }}</el-input>
              </el-form-item>
              <el-form-item label="申请人" prop="repairer">
                <el-input v-model="form.repairer" disabled style="width: 80%">{{ this.name }}</el-input>
              </el-form-item>
              <el-form-item label="标题" prop="title" style="margin-bottom: 27px">
                <el-input v-model="form.title" clearable style="width: 80%"></el-input>
              </el-form-item>
              <el-form-item label="内容" prop="content">
                <el-input
                    v-model="form.content"
                    :autosize="{ minRows: 3, maxRows: 10 }"
                    autosize
                    clearable
                    style="width: 80%"
                    type="textarea"
                ></el-input>
              </el-form-item>
              <el-form-item label="订单创建时间" prop="createDate" style="margin-top: 27px">
                <el-date-picker
                    v-model="form.createDate"
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
          <!--   内容详情弹窗-->
          <el-dialog v-model="detailDialog" title="详情" width="30%">
            <el-card>
              <div v-html="detail.content"></div>
            </el-card>
            <template #footer>
              <span class="dialog-footer">
                <el-button type="primary" @click="closeDetails">确 定</el-button>
              </span>
            </template>
          </el-dialog>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { getRepairRecords, addRepair } from '@/api/applyRepairInfo';  // 引入你的api文件
import { getRoomInfo } from '@/api/myRoomInfo';
import { useUserStore } from '@/store/user';

// 响应式变量
const loading = ref(true);
const dialogVisible = ref(false);
const detailDialog = ref(false);
const search = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref([]);
const detail = reactive({});
const form = reactive({});
const formRef = ref(null);
const room = reactive({
  roomId: '',
  dormId: '',
});
const name = ref('');
const userId = ref('');
const rules = reactive({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  createDate: [{ required: true, message: '请选择时间', trigger: 'blur' }],
});

// 初始化
const init = () => {
  const user = useUserStore().userInfo;
  name.value = user.name;
  userId.value = user.userId;
  console.log(user);
};

// 获取房间信息
const getInfo = async () => {
  const res = await getRoomInfo(userId.value);
  if (res.code === 0) {
    room.roomId = res.data.roomId;
    room.dormId = res.data.dormId;
  } else {
    ElMessage({
      message: res.msg,
      type: 'error',
    });
  }
};

// 加载数据
const load = async () => {
  const params = {
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    search: search.value,
    studentId: userId.value,
  };
  const res = await getRepairRecords(params);
  if (res.code !== 0) {
    ElMessage({
      message: res.msg,
      type: 'error',
    });
    return;
  }
  tableData.value = res.data.records;
  total.value = res.data.total;
  loading.value = false;
};

// 过滤标签
const filterTag = (value, row) => row.status === value;

// 展示详情
const showDetail = (row) => {
  detailDialog.value = true;
  console.log(row);
  nextTick(() => {
    Object.assign(detail, row);
    console.log(detail.content);
    console.log(detail);
  });
};

// 关闭详情弹窗
const closeDetails = () => {
  detailDialog.value = false;
};

// 新增维修记录
const add = () => {
  dialogVisible.value = true;
  nextTick(() => {
    form.repairer = name.value;
    form.dormId = room.dormId;
    form.roomId = room.roomId;
  });
};

// 保存维修记录
const save = async () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      const res = await addRepair(form);
      if (res.code === 0) {
        ElMessage({
          message: '新增成功',
          type: 'success',
        });
        search.value = '';
        load();
        dialogVisible.value = false;
      } else {
        ElMessage({
          message: res.msg,
          type: 'error',
        });
      }
    }
  });
};

// 取消添加
const cancel = () => {
  formRef.value.resetFields();
  dialogVisible.value = false;
};

// 改变分页大小
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  load();
};

// 改变当前页码
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  load();
};

// 初始化加载
onMounted(() => {
  init();
  getInfo();
  load();
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});

</script>