<template>
    <div class="notice-list-container">
      <h2>公告信息列表</h2>
  
      <!-- 搜索框 -->
      <div class="search">
        <input v-model="searchQuery" placeholder="搜索发布人或公告内容" />
      </div>
  
      <!-- 排序按钮 -->
      <div class="sort-buttons">
        <button @click="sortByDate('asc')">按时间升序</button>
        <button @click="sortByDate('desc')">按时间降序</button>
        <button @click="openModal()">添加公告</button>
      </div>
  
      <!-- 表格显示公告信息 -->
      <table>
        <thead>
          <tr>
            <th>公告ID</th>
            <th>发布时间</th>
            <th>发布人</th>
            <th>公告主题</th>
            <th>公告内容</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(notice, index) in currentNotices" :key="notice.id">
            <td>{{ notice.id }}</td>
            <td>{{ new Date(notice.date).toLocaleString() }}</td>
            <td>{{ notice.publisher }}</td>
            <td>{{ notice.title }}</td>
            <td>{{ notice.content }}</td>
            <td>
              <button @click="openModal(notice)">编辑</button>
              <button @click="deleteNotice(notice.id)">删除</button>
            </td>
          </tr>
          <!-- 添加空行补足不足的行数 -->
          <tr v-for="n in emptyRows" :key="n">
            <td colspan="6" style="height: 40px;"></td>
          </tr>
        </tbody>
      </table>
  
      <!-- 翻页控件 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
        <span>第 {{ currentPage }} 页</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
      </div>
  
      <!-- 弹窗（添加/编辑公告信息） -->
      <div v-if="isModalVisible" class="modal">
        <div class="modal-content">
          <h3>{{ isEdit ? '编辑公告' : '添加公告' }}</h3>
          <form @submit.prevent="saveNotice">
            <div>
              <label for="publisher">发布人:</label>
              <input v-model="form.publisher" type="text" id="publisher" required :readonly="isEdit" />
            </div>
            <div>
              <label for="title">公告主题:</label>
              <input v-model="form.title" type="text" id="title" required />
            </div>
            <div>
              <label for="content">公告内容:</label>
              <textarea v-model="form.content" id="content" required></textarea>
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
  import { addNotice, getNotices, updateNotice, deleteNotice } from '@/api/admin'; // 替换为实际 API
import { getUserInfo } from '@/api/user';
  
  export default {
    name: 'NoticeList',
    setup() {
      const notices = ref([]);
      const form = ref({ id: null, publisher: '', title: '', content: '', date: '' });
      const isEdit = ref(false);
      const isModalVisible = ref(false);
      const searchQuery = ref('');
      const currentPage = ref(1);
      const itemsPerPage = ref(5);
      const totalPages = computed(() => Math.ceil(filteredNotices.value.length / itemsPerPage.value));
      
      // 假设获取当前登录用户的名字的函数
      const getCurrentUserName = async() => {
        const userInfo = await getUserInfo();
        const userName = userInfo.data.name;
        return userName; // 这里应该替换为实际获取用户名的逻辑
      };
  
      // 获取公告列表
      const fetchNotices = async () => {
        const response = await getNotices();
        notices.value = response.data; // 假设 API 返回的数据
      };
  
      const filteredNotices = computed(() => {
        return notices.value.filter(notice => {
          return (
            notice.publisher.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            notice.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            notice.title.toLowerCase().includes(searchQuery.value.toLowerCase())
          );
        });
      });
  
      const currentNotices = computed(() => {
        const start = (currentPage.value - 1) * itemsPerPage.value;
        return filteredNotices.value.slice(start, start + itemsPerPage.value);
      });
  
      const emptyRows = computed(() => {
        return itemsPerPage.value - currentNotices.value.length;
      });
  
      const sortByDate = (order) => {
        if (order === 'asc') {
          notices.value.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else {
          notices.value.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
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
  
      const openModal = (notice = null) => {
        if (notice) {
          form.value = { ...notice }; // 复制公告信息
          isEdit.value = true;
        } else {
          resetForm();
          form.value.publisher = getCurrentUserName(); // 添加时设置发布人为当前登录用户
          isEdit.value = false;
        }
        isModalVisible.value = true;
      };
  
      const closeModal = () => {
        isModalVisible.value = false;
      };
  
      const saveNotice = async () => {
        if (isEdit.value) {
          await updateNotice(form.value);
        } else {
          await addNotice(form.value);
        }
        await fetchNotices(); // 刷新公告列表
        closeModal();
      };
  
      const deleteNotice = async (id) => {
        await deleteNotice(id);
        await fetchNotices();
      };
  
      const resetForm = () => {
        form.value = { id: null, publisher: '', title: '', content: '', date: '' };
      };
  
      onMounted(fetchNotices); // 获取公告列表
  
      return {
        notices,
        form,
        isEdit,
        isModalVisible,
        searchQuery,
        currentPage,
        itemsPerPage,
        totalPages,
        filteredNotices,
        currentNotices,
        emptyRows,
        sortByDate,
        nextPage,
        prevPage,
        openModal,
        closeModal,
        saveNotice,
        deleteNotice,
      };
    }
  };
  </script>
  
  <style scoped>
  @import '@/assets/css/table.css';
  
  .notice-list-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
  </style>
  