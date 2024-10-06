<template>
    <div class="send-notice">
        <h1>发送公告</h1>
        <form @submit.prevent="sendNotice">
            <div class="form-group">
                <label for="title">标题:</label>
                <input type="text" v-model="notice.title" id="title" required />
            </div>
            <div class="form-group">
                <label for="content">内容:</label>
                <textarea v-model="notice.content" id="content" required></textarea>
            </div>
            <div class="form-group">
                <label for="recipient">接收对象:</label>
                <select v-model="notice.recipient" id="recipient" required>
                    <option value="全体">全体</option>
                    <option value="所有宿管">所有宿管</option>
                    <option value="所有学生">所有学生</option>
                </select>
            </div>
            <button type="submit">发送公告</button>
        </form>
        <div v-if="message" class="message">{{ message }}</div>
    </div>
</template>

<script>
import { ref } from 'vue';
import { sendNoticeApi } from '@/api/admin';
export default {
    setup() {
        const notice = ref({
            title: '',
            content: '',
            recipient: '全体',
            publisher: '管理员', // 发布人，可以根据实际情况设置
            date: new Date().toLocaleString(), // 发布时间
        });
        const message = ref('');

        const sendNotice = () => {
            // 这里可以调用API将公告发送到数据库

            sendNoticeApi(notice.value).then(response => {
              message.value = '公告发送成功！';
            }).catch(error => {
              message.value = '发送失败，请重试。';
            });

            // 重置表单
            resetForm();
        };

        const resetForm = () => {
            notice.value = {
                title: '',
                content: '',
                recipient: '全体',
                publisher: '管理员',
                date: new Date().toLocaleString(),
            };
        };

        return {
            notice,
            message,
            sendNotice,
        };
    },
};
</script>

<style scoped>
.send-notice {
    max-width: 500px; /* 增大最大宽度 */
    margin: 0 auto; /* 水平居中 */
    padding: 20px; /* 添加内边距 */
    background-color: #f9f9f9; /* 背景颜色 */
    border-radius: 10px; /* 圆角 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

h1 {
    text-align: center; /* 标题居中 */
    color: #333; /* 标题颜色 */
    margin-bottom: 20px; /* 标题底部间距 */
}

.form-group {
    margin-bottom: 20px; /* 组之间的间距 */
}

label {
    display: block; /* 标签块级显示 */
    margin-bottom: 5px; /* 标签底部间距 */
    font-weight: bold; /* 标签加粗 */
    color: #555; /* 标签颜色 */
}

input[type="text"],
textarea,
select {
    width: 100%; /* 宽度100% */
    padding: 10px; /* 内部填充 */
    border: 1px solid #ccc; /* 边框颜色 */
    border-radius: 5px; /* 圆角 */
    font-size: 16px; /* 字体大小 */
    transition: border-color 0.3s; /* 边框颜色过渡效果 */
}

input[type="text"]:focus,
textarea:focus,
select:focus {
    border-color: #007bff; /* 聚焦时边框颜色变化 */
    outline: none; /* 去掉默认outline */
}

button {
    width: 100%; /* 按钮宽度100% */
    padding: 10px; /* 内部填充 */
    background-color: #007bff; /* 按钮背景颜色 */
    color: white; /* 按钮文本颜色 */
    border: none; /* 去掉边框 */
    border-radius: 5px; /* 圆角 */
    font-size: 16px; /* 字体大小 */
    cursor: pointer; /* 鼠标指针变为手形 */
    transition: background-color 0.3s; /* 背景色过渡效果 */
}

button:hover {
    background-color: #0056b3; /* 悬停时背景色变化 */
}

.message {
    margin-top: 20px; /* 消息顶部间距 */
    color: green; /* 成功消息颜色 */
    text-align: center; /* 消息居中 */
    font-size: 16px; /* 字体大小 */
}
</style>
