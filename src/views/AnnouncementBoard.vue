<!-- AnnouncementBoard.vue -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-icon="ArrowRight" style="margin: 16px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告栏</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 公告栏卡片 -->
    <el-card style="margin: 15px; min-height: calc(120vh - 111px)">
      <div class="announcement-board">
        <el-row :gutter="20">
          <el-col :span="8" v-for="announcement in announcements" :key="announcement.id">
            <el-card class="announcement-card" shadow="always" @click="showDetail(announcement)">
              <h3 class="announcement-title">{{ announcement.title }}
                <el-tag
                :type="announcement.isRead ? 'success' : 'info'"
                effect="dark"
                class="read-status"
              >
                {{ announcement.isRead ? '已读' : '未读' }}
              </el-tag>
              </h3>
              <p class="announcement-snippet">{{ announcement.contentSnippet }}...</p>
              <div class="announcement-meta">
                <span>发布人: {{ announcement.author }}</span>
                <span>{{ announcement.date }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 公告详情对话框 -->
        <el-dialog
          v-model="detailDialogVisible"
          title="公告详情"
          width="50%"
          :before-close="handleDialogClose"
        >
          <AnnouncementDetail
            :announcement="currentAnnouncement"
            @mark-read="markAsRead"
          />
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { fetchAnnouncements, markRead } from '@/api/announcementBoard';
import { useUserStore } from '@/store/user';
import AnnouncementDetail from '@/components/AnnouncementDetail.vue'; // 新建组件

const announcements = ref([]);
const loading = ref(false);
const detailDialogVisible = ref(false);
const currentAnnouncement = ref(null);

const userStore = useUserStore();

// 初始化用户和数据
const init = () => {
  fetchAnnouncementData(userStore.userInfo.userId);
};

// 获取公告列表
const fetchAnnouncementData = async (userId) => {
  loading.value = true;
  const response = await fetchAnnouncements(userId);
  announcements.value = response.data.records.map((announcement) => ({
    ...announcement,
    contentSnippet: announcement.content.slice(0, 50),
  }));
  loading.value = false;
};

// 展示公告详情
const showDetail = (announcement) => {
  currentAnnouncement.value = announcement;
  detailDialogVisible.value = true;
};

// 标记已读
const markAsRead = async (announcement) => {
  const result = await markRead(announcement.id, userStore.userInfo.userId);
  if (result.data.success == 1) {
    announcement.isRead = true;
    const index = announcements.value.findIndex((item) => item.id === announcement.id);
    if (index !== -1) {
      announcements.value[index].isRead = true;
    }
    ElMessage.success('已标记为已读');
  } else {
    ElMessage.error('标记为已读失败，请稍后重试');
  }
};

// 关闭对话框
const handleDialogClose = () => {
  detailDialogVisible.value = false;
};

onMounted(init);
</script>


<style scoped>
.announcement-card {
  cursor: pointer;
  position: relative; /* 确保内部元素可以使用绝对定位 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.announcement-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}

/* 卡片标题部分，包含标题和标签 */
.card-header {
  position: relative; /* 为标签提供定位参考 */
  margin-bottom: 10px;
}

/* 卡片标题样式 */
.announcement-title {
  font-weight: bold;
  font-size: 1.2em;
  margin: 0;
  padding-right: 50px; /* 留出右侧空间避免文字被标签覆盖 */
  display: inline-block;
}

/* 标签固定在标题右上角 */
.read-status {
  position: absolute; /* 绝对定位在标题部分的右上角 */
  top: 3px;
  right: 3px;
  z-index: 1;
  font-size: 0.85em; /* 字体大小适中 */
  padding: 2px 6px; /* 内边距优化显示 */
}
</style>