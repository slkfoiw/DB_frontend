<template>
    <div style="display: inline;">
        <button @click="showModal = true" class="userBtn">{{ exeName }}</button>
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <p>确定要{{ exeName }}吗？</p>
                <button @click="confirm" class="userBtn">确认</button>
                <button @click="showModal = false" class="userBtn">取消</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'; // 添加这一行
import { ref } from 'vue';
import { useUserStore } from '@/store/user';
import { deleteAccount } from '@/api';
import { ElMessage } from 'element-plus';

export default {
    props: {
        exeName: {
            type: String,
            required: true
        }
    },
    setup(props, { emit }) {
    const showModal = ref(false);
    const userStore = useUserStore();
    const router = useRouter(); // 添加这一行

    const confirm = async () => {
        if (props.exeName === '退出登录') {
            await userStore.userLogout();
        } else if (props.exeName === '注销账号') {
            await userStore.userLogout();
            await deleteAccount({});
        }
        emit('confirmed');

        ElMessage(
            {
                message: '已' + props.exeName,
                type: 'success',
                duration: 2000
            }
        )

        showModal.value = false;

        router.push('/home'); // 添加这一行
    };

    return {
        showModal,
        confirm
    };
}
};
</script>

<style scoped>
.modal {
    display: flex;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: #fefefe;
    padding: 20px;
    border: 1px solid #888;
    width: 30%;
    text-align: center;
}

.modal-content button {
    margin: 10px;
}
</style>