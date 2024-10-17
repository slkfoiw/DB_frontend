<template>
  <div class="announcement-board">
    <el-row :gutter="20">
      <el-col :span="8" v-for="announcement in announcements" :key="announcement.id">
        <el-card shadow="always" @click="showDetail(announcement)">
          <h3>{{ announcement.title }}</h3>
          <p>{{ announcement.contentSnippet }}...</p>
          <p>Posted by: {{ announcement.author }}</p>
          <p>Date: {{ announcement.date }}</p>
          <el-tag v-if="announcement.isRead" type="success">Read</el-tag>
          <el-tag v-else type="info">Unread</el-tag>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="detailDialogVisible" title="公告" width="50%" :before-close="handleDialogClose">
      <h3>{{ currentAnnouncement.title }}</h3>
      <p>Posted by: {{ currentAnnouncement.author }}</p>
      <p>Date: {{ currentAnnouncement.date }}</p>
      <p class="content-text">内容: {{ currentAnnouncement.content }}</p>

      <el-button v-if="!currentAnnouncement.isRead" type="primary" @click="markAsRead(currentAnnouncement)">
        Mark as Read
      </el-button>
      <el-tag v-if="currentAnnouncement.isRead" type="success">Read</el-tag>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">Close</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchAnnouncements, markRead } from '@/api/announcementBoard';
import { useUserStore } from '@/store/user';

const announcements = ref([]);
const loading = ref(false);
const detailDialogVisible = ref(false);
const currentAnnouncement = ref({});

// 存储用户信息
const form = ref({
  userId: "",
  name: "",
});

const init = () => {
  const user = useUserStore().userInfo;
  form.userId = user.userId;
  form.name = user.username;
};

const fetchAnnouncementData = async () => {
  loading.value = true;
  const response = await fetchAnnouncements(form.userId);
  announcements.value = response.data.records.map((announcement) => ({
    ...announcement,
    contentSnippet: announcement.content.slice(0, 50), // Snippet for homepage card display
  }));
  loading.value = false;
};

const showDetail = (announcement) => {
  currentAnnouncement.value = announcement;
  detailDialogVisible.value = true;
};

const markAsRead = (announcement) => {
  const result = markRead(announcement.id, form.userId);
  if (result.success) {
    announcement.isRead = true;
    ElMessage({
      message: 'Marked as read!',
      type: 'success',
    });
  }
};

const handleDialogClose = () => {
  detailDialogVisible.value = false;
};

onMounted(() => {
    init();
    fetchAnnouncementData();
});</script>

<style scoped>
.announcement-board {
  padding: 20px;
}

.el-card {
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.dialog-footer {
  text-align: right;
}

.content-text {
  line-height: 1.6; /* 调整行间距，这里可以根据需要调整数值 */
}

</style>