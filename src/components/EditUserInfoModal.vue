<!-- EditUserInfoModal.vue -->
<template>
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h3 class="modal-title">编辑用户信息</h3>
      <form @submit.prevent="submitForm">
        <div class="edit-item">
          <label for="avatar" class="form-label">头像:</label>
          <img :src="formData.avatarPreview || userInfo.avatar" alt="avatar" class="avatar" @click="changeAvatar" />
          <input type="file" id="avatar" @change="handleAvatarChange" class="form-input" ref="avatarInput" style="display: none;" />
        </div>
        <div class="edit-item">
          <label for="username" class="form-label">用户名:</label>
          <input type="text" id="username" v-model="formData.username" class="form-input"/>
        </div>
        <div class="edit-item">
          <label for="email" class="form-label">邮箱:</label>
          <input type="email" id="email" v-model="formData.email" class="form-input" />
        </div>
        <div class="edit-item">
          <label for="gender" class="form-label">性别:</label>
          <select id="gender" v-model="formData.gender" class="form-select">
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="null">不展示性别</option>
          </select>
        </div>
        <div class="edit-item">
          <label for="introduction" class="form-label">个人介绍:</label>
          <input type="text" id="introduction" v-model="formData.introduction" class="form-input" />
        </div>
        <div class="form-buttons">
          <button type="submit" class="btn btn-primary">保存</button>
          <button type="button" @click="closeModal" class="btn btn-secondary">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { updateUserInfo, updateUserAvatar } from '@/api/user.js'
import { ElMessage } from "element-plus";

const props = defineProps({
    userInfo: {
        type: Object,
        required: true
    },
    showModal: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['update:showModal', 'doUpdate'])

const formData = ref({
    avatar: null,
    avatarPreview: null,
    username: props.userInfo.username,
    email: props.userInfo.email,
    gender: props.userInfo.gender,
    introduction: props.userInfo.introduction
})

watch(() => props.showModal, (newVal) => {
    if (newVal) {
        // 填充用户信息
        formData.value = {
            avatar: null,
            avatarPreview: null,
            username: props.userInfo.username,
            email: props.userInfo.email,
            gender: props.userInfo.gender,
            introduction: props.userInfo.introduction
        }
    }
})

const handleAvatarChange = (event) => {
    const file = event.target.files[0]
    formData.value.avatar = file
    formData.value.avatarPreview = URL.createObjectURL(file)
}

const changeAvatar = () => {
    const avatarInput = document.getElementById('avatar')
    avatarInput.click()
}

const submitForm = async () => {
  try {
        // 更新用户信息（文本）
        const userInfoResponse = await updateUserInfo({
            username: formData.value.username,
            email: formData.value.email,
            gender: formData.value.gender,
            introduction: formData.value.introduction
        });

        if (!userInfoResponse.success) {
            ElMessage({
                message: '更新用户信息失败，请稍后重试。',
                type: 'error',
                duration: 2000
            });
            return;
        }


        // 更新用户头像（如果用户上传了新头像）
        if (formData.value.avatar) {
          const allowedTypes = ['image/jpeg', 'image/png']; // 可接受的图片类型
          const maxSize = 2; // 最大文件大小，单位：MB
          const file = formData.value.avatar;

          if (!allowedTypes.includes(file.type)) {
            ElMessage(
              {
                message: '请上传正确的图片文件!',
                type: 'warning',
                duration: 2000
              }
            );
            return;
          }

          if (file.size / 1024 / 1024 > maxSize) {
            ElMessage(
              {
                message: `文件大小最多${maxSize}MB!`,
                type: 'warning',
                duration: 2000
              }
            );
            return;
          }

          const avatarResponse = await updateUserAvatar(formData.value.avatar);

          if (!avatarResponse.success) {
            ElMessage({
              message: '更新头像失败，请稍后重试。',
                type: 'error',
                duration: 2000
            });
            return;
          }
        }

        ElMessage({
            message: '更新成功',
            type: 'success',
            duration: 2000
        });

        emit('doUpdate');
        closeModal();

    } catch (error) {
        console.error('更新失败:', error);
        ElMessage({
            message: '更新失败：请检查用户名格式，或者用户名或邮箱已存在',
            type: 'error',
            duration: 2000
        });
    }
}

const closeModal = () => {
    emit('update:showModal', false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #ffffff;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh; /* 设置最大高度 */
  overflow-y: auto; /* 启用垂直滚动 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.edit-item {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  border-color: #007bff;
  outline: none;
}

.form-select {
  background: #fff;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
  margin-bottom: 15px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
