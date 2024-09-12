<!-- ChangePasswordModal.vue -->
<template>
  <div v-if="showModal" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h3 class="modal-title">修改密码</h3>
      <form @submit.prevent="submitForm">
        <div class="edit-item">
          <label for="oldPassword" class="form-label">旧密码:</label>
          <input type="password" id="oldPassword" v-model="formData.oldPassword" class="form-input" />
        </div>
        <div class="edit-item">
          <label for="newPassword" class="form-label">新密码:</label>
          <input type="password" id="newPassword" v-model="formData.newPassword" class="form-input" />
        </div>
        <div class="edit-item">
          <label for="confirmPassword" class="form-label">确认新密码:</label>
          <input type="password" id="confirmPassword" v-model="formData.confirmPassword" class="form-input" />
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
import { updateUserPassword } from '@/api/user.js'
import { ElMessage } from "element-plus";


const props = defineProps({
    showModal: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['update:showModal'])

const formData = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})

watch(() => props.showModal, (newVal) => {
    if (!newVal) {
        formData.value = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    }
})

const submitForm = async () => {
    if (formData.value.newPassword !== formData.value.confirmPassword) {
        ElMessage(
            {
                message: '两次输入的新密码不一致',
                type: 'error',
                duration: 2000
            }
        )
        return
    }

    try {
        const response = await updateUserPassword({
            oldPassword: formData.value.oldPassword,
            newPassword: formData.value.newPassword
        });

        if (!response.success) {
            alert('更新密码失败，请稍后重试。')
            return
        }

        ElMessage(
            {
                message: '密码更新成功',
                type: 'success',
                duration: 2000
            }
        )

        closeModal();
    } catch (error) {
        console.error('更新密码失败:', error);
        ElMessage(
            {
                message: '更新密码失败，原密码错误',
                type: 'error',
                duration: 2000
            }
        )
        closeModal()
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

.form-input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #007bff;
  outline: none;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
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
