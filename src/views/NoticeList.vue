<template>
  <div class="notice-list-container">
    <el-breadcrumb separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>公告列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 搜索框 -->
      <div style="margin: 10px 0">
        <el-input v-model="searchQuery" clearable placeholder="搜索发布人或公告内容" prefix-icon="Search" style="width: 20%" />
        <el-button icon="Search" style="margin-left: 5px" type="primary" @click="load"></el-button>
        <div style="float: right">
          <el-tooltip content="添加公告" placement="top">
            <el-button icon="plus" style="width: 50px" type="primary" @click="openModal()"></el-button>
          </el-tooltip>
        </div>
      </div>

      <!-- 表格显示公告信息 -->
      <el-table :data="paginatedNotices" style="width: 100%">
        <el-table-column label="序号" type="index" />
        <el-table-column prop="releaseTime" label="发布时间" sortable />
        <el-table-column prop="title" label="主题" />
        <el-table-column prop="publisher" label="发布人" />
        <el-table-column prop="recipient" label="通知对象" />
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button icon="more-filled" type="default" @click="openDetail(scope.row)"></el-button>
            <el-button icon="Edit" @click="openModal(scope.row)"></el-button>
            <el-popconfirm title="确认删除？" @confirm="handleDelete(scope.row.Id)">
              <template #reference>
                <el-button icon="Delete" type="danger"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 翻页控件 -->
      <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="currentPage"
        :page-size="pageSize" :page-sizes="[10, 20]" :total="totalitems"
        layout="total, sizes, prev, pager, next, jumper" :disabled="totalitems === 0">
      </el-pagination>

      <!-- 弹窗（添加/编辑公告信息） -->
      <el-dialog v-model="showModal" title="公告信息" @close="closeModal">
        <div class="modal-content">
          <h3>{{ isEdit ? '编辑公告' : '添加公告' }}</h3>
          <el-form :model="form" ref="formRef">
            <el-form-item label="主题" prop="title" required>
              <el-input v-model="form.title" placeholder="请输入公告主题"></el-input>
            </el-form-item>
            <el-form-item label="通知对象" prop="recipient" required>
              <el-input v-model="form.recipient" placeholder="请输入通知对象"></el-input>
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
import { ref, computed, onMounted } from 'vue';
import { addNotice, getNotices, updateNotice, deleteNotice } from '@/api/admin'; // 替换为实际 API
import { getUserInfo } from '@/api/user';

const notices = ref([]);
const filteredNotices = ref([]);
const form = ref({ id: null, publisher: '', recipient: '', title: '', content: '', date: '' });
const isEdit = ref(false);
const showModal = ref(false);
const detail = ref('');
const showDetail = ref(false);
const searchQuery = ref('');
const totalitems = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const paginatedNotices = ref([]);

// 假设获取当前登录用户的名字的函数
const getCurrentUserName = async () => {
  const userInfo = await getUserInfo();
  const userName = userInfo.data.name;
  return userName; // 这里应该替换为实际获取用户名的逻辑
};

// 获取公告列表
const fetchNotices = async () => {
  const response = await getNotices();
  notices.value = response.data; // 假设 API 返回的数据
  load();
};


const load = () => {
  filteredNotices.value = notices.value.filter(notice => {
    return (
      notice.publisher.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      notice.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }); 
  totalitems.value = filteredNotices.value.length;
  const start = (currentPage.value - 1) * pageSize.value;
  paginatedNotices.value = filteredNotices.value.slice(start, start + pageSize.value);
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

const openModal = (notice = null) => {
  if (notice) {
    form.value = { ...notice }; // 复制公告信息
    isEdit.value = true;
  } else {
    resetForm();
    form.value.publisher = getCurrentUserName(); // 添加时设置发布人为当前登录用户
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
  if (isEdit.value) {
    await updateNotice(form.value);
  } else {
    await addNotice(form.value);
  }
  await fetchNotices(); // 刷新公告列表
  closeModal();
};

const handleDelete = async (id) => {
  await deleteNotice(id);
  await fetchNotices();
};

const resetForm = () => {
  form.value = { id: null, publisher: '', title: '', content: '', releasTime: '' };
};

onMounted(fetchNotices); // 获取公告列表
</script>

<style scoped>
@import '@/assets/css/table.css';
</style>