<template>
  <div class="announcement-list-container">
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>公告列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框 -->
      <div style="margin: 10px 0">
        <el-input v-model="searchQuery" clearable placeholder="搜索发布人或公告主题或公告内容" prefix-icon="Search" style="width: 30%" />
        <el-button icon="Search" plain="true" style="margin-left: 5px" type="primary" @click="load"></el-button>
        <div style="float: right">
          <el-tooltip content="添加公告" placement="top">
            <el-button icon="plus" plain="true" style="width: 50px" type="primary" @click="openModal()"></el-button>
          </el-tooltip>
        </div>
      </div>

      <!-- 表格显示公告信息 -->
      <el-table :data="announcements" style="width: 100%" :sort-method="sortMethod" @sort-change="handleSortChange">
        <el-table-column label="序号" type="index" />
        <el-table-column prop="date" label="发布时间" sortable />
        <el-table-column prop="title" label="主题" sortable />
        <el-table-column prop="senderUsername" label="发布人" />
        <el-table-column prop="notifyObject" label="通知对象">
          <template v-slot="scope">
            <span>
              {{ scope.row.notifyObject === 0 ? '全体' : `${scope.row.notifyObject}公寓` }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button icon="more-filled" type="warning" plain="true" @click="openDetail(scope.row)"></el-button>
            <el-button icon="Edit" type="primary" plain="true" @click="openModal(scope.row)"></el-button>
            <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row.id)">
              <template #reference>
                <el-button icon="Delete" type="danger" plain="true"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 翻页控件 -->
      <div style="margin: 10px 0">
      <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="currentPage"
        :page-size="pageSize" :page-sizes="[10, 20]" :total="totalitems"
        layout="total, sizes, prev, pager, next, jumper" :disabled="totalitems === 0">
      </el-pagination>
      </div>

      <!-- 弹窗（添加/编辑公告信息） -->
      <el-dialog v-model="showModal" title="公告信息" @close="closeModal">
        <div class="modal-content">
          <h3>{{ isEdit ? '编辑公告' : '添加公告' }}</h3>
          <el-form :model="form" ref="formRef">
            <el-form-item label="主题" prop="title" required>
              <el-input v-model="form.title" placeholder="请输入公告主题"></el-input>
            </el-form-item>
            <el-form-item required>
              <el-select v-model="form.notifyObject" placeholder="请选择通知对象" :disabled="isEdit">
                  <el-option
                      v-for="notifyObjectOption in notifyObjectOptions" 
                      :key="notifyObjectOption.dormId" 
                      :label="notifyObjectOption.dormId === 0 ? '全体' : `${notifyObjectOption.dormId}公寓`"
                      :value="notifyObjectOption.dormId" 
                  />
              </el-select>
            </el-form-item>
            <el-form-item label="内容" prop="content" required>
              <el-input v-model="form.content" type="textarea" placeholder="请输入公告内容"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleChange">{{ isEdit ? '更新' : '添加' }}</el-button>
              <el-button type="default" @click="closeModal">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>

      <!--    公告详情-->
      <el-dialog v-model="showDetail" title="详情">
        <div v-html="detail.content"></div>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="closeDetail">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { addAnnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement } from '@/api/admin'; // 替换为实际 API
import { getDormBuilds } from '@/api/dormitoryInfo';
import { ElMessage } from 'element-plus';

const announcements = ref([]);
const form = ref({ id: null, senderUsername: '', notifyObject: '', title: '', content: '', date: '' });
const isEdit = ref(false);
const showModal = ref(false);
const detail = ref('');
const showDetail = ref(false);
const searchQuery = ref('');
const totalitems = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const notifyObjectOptions = ref([]);
const sortField = ref('');
const sortOrder = ref('');

const load = async () => {
  const response = await getAnnouncements({
    pageNum: currentPage.value, 
    pageSize: pageSize.value,
    search: searchQuery.value,
    sortField: sortField.value,
    sortOrder: sortOrder.value
  });
  if (response.code !== 0) {
    ElMessage.error(response.msg);
    return;
  }
  console.log(response.data);
  announcements.value = response.data.records;
  totalitems.value = response.data.total;
  const res = await getDormBuilds({pageNum: 1, pageSize: 10000});
  if (res.code !== 0) {
    ElMessage.error('获取公寓信息失败: ' + res.msg);
    return;
  }
  notifyObjectOptions.value = res.data.records;
  notifyObjectOptions.value = [{ dormId: 0 }, ...notifyObjectOptions.value];
};

// 翻页功能
const handleCurrentChange = (pageNum) => {
  currentPage.value = pageNum;
  load();
}

const handleSizeChange = (newPageSize) => {
  pageSize.value = newPageSize;
  load();
}

const handleSortChange = (sort) => {
    sortField.value = sort.prop;
    sortOrder.value = sort.order === 'ascending' ? 'asc' : 'desc';
    load();
};

const openModal = (announcement = null) => {
  if (announcement) {
    form.value = { ...announcement }; // 复制公告信息
    isEdit.value = true;
  } else {
    resetForm();
    isEdit.value = false;
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const openDetail = (row) => {
  detail.value = row;
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
};

const handleChange = async () => {
  const res = isEdit.value ? await updateAnnouncement(form.value) : await addAnnouncement(form.value);
  if (res.code !== 0) {
    ElMessage.error(res.msg);
    return;
  }
  ElMessage.success(res.msg);
  await load(); // 刷新公告列表
  closeModal();
};

const handleDelete = async (id) => {
  const res = await deleteAnnouncement(id);
  if (res.code !== 0) {
    ElMessage.error(res.msg);
    return;
  }
  ElMessage.success(res.msg);
  await load();
};

const resetForm = () => {
  form.value = { id: null, senderUsername: '', title: '', content: '', releasTime: '' };
};

onMounted(load); // 获取公告列表
</script>

<style scoped>
@import '../assets/css/table.css';
</style>