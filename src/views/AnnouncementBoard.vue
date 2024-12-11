<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-icon="ArrowRight" style="margin: 16px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>公告栏</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 折叠面板公告栏 -->
    <el-card style="margin: 15px; min-height: calc(120vh - 111px)">
      <el-collapse v-model="activeNames">
        <el-collapse-item 
          v-for="announcement in announcements" 
          :key="announcement.id" 
          :name="announcement.id">
          <!-- 折叠面板标题 -->
          <template #title>
            <div class="announcement-header">
              <span class="announcement-title">{{ announcement.title }}</span>
              <el-tag style="margin-left: 5px;" :type="announcement.isRead ? 'success' : 'danger'" effect="dark" class="read-status">
                {{ announcement.isRead ? '已读' : '未读' }}
              </el-tag>
            </div>
          </template>

          <!-- 折叠面板内容 -->
          <div class="announcement-content">
            <p v-if="!activeNames.includes(announcement.id)">{{ announcement.contentSnippet }}...</p>
            <div v-else>
              <p>{{ announcement.content }}</p>
              <el-button 
                plain="true"
                size="mini" 
                font-size="small"
                @click.stop="markAsRead(announcement)"
                :disabled="announcement.isRead">
                标记为已读
              </el-button>
              <div class="announcement-meta">
                <el-icon><User /></el-icon>
                <span class="meta-author">发布人: {{ announcement.author }}</span>
                <el-icon><Clock /></el-icon>
                <span class="meta-date">{{ announcement.date }}</span>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

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
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchAnnouncements, markRead } from '@/api/announcementBoard';
import { useUserStore } from '@/store/user';
import { User, Clock } from '@element-plus/icons-vue';
import AnnouncementDetail from '@/components/AnnouncementDetail.vue';

const announcements = ref([]);
const activeNames = ref([]);
const detailDialogVisible = ref(false);
const currentAnnouncement = ref(null);

const userStore = useUserStore();

const init = () => {
  fetchAnnouncementData(userStore.userInfo.userId);
};

const fetchAnnouncementData = async (userId) => {
  const response = await fetchAnnouncements(userId);
  announcements.value = response.data.records.map((announcement) => ({
    ...announcement,
    contentSnippet: announcement.content.slice(0, 50),
  }));
};

const handleDialogClose = () => {
  detailDialogVisible.value = false;
};

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

onMounted(init);
</script>

<style scoped>
.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.announcement-title {
  font-size: 1.5em;
  font-weight: bold;
}

.announcement-content {
  padding: 10px 0;
  font-size: 1rem; /* 设置字体大小 */
  line-height: 1.5; /* 调整行高 */
  color: #333; /* 内容颜色 */
}


.announcement-meta {
  display: flex;
  align-items: center;
  margin-top: 10px;
  color: #666;
  font-size: 0.9em;
}

.meta-author, .meta-date {
  margin-left: 5px;
  margin-right: 15px;
  font-size: small;
}

.read-status {
  font-size: 0.85em;
  padding: 2px 8px;
}
</style>