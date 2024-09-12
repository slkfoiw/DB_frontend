<template>
    <div class="dish-item">
        <div class="dish-img">
            <img :src="dish.img" alt="窗口图片" />
        </div>
        <div class="dish-info">
            <p>{{ dish.name }}</p>
            <div class="info-footer">
                <div class="user-info">
                    <img :src="dish.user.avatar" alt="用户头像" class="user-avatar" />
                    <span class="user-name">{{ dish.user.username }}</span>
                </div>
                <div class="dish-ateCount">
                    <span>{{ dish.ateCount }} 吃过</span>
                </div>
                <div class="dish-collectCount">
                    <span>{{ dish.collectCount }} 收藏</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'DishPreview',
    props: {
        dish: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        return {};
    }
});
</script>


<style scoped>
.dish-item {
    width: 200px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dish-img img {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.dish-info {
    padding: 10px;
    background-color: #f9f9f9;
}

.dish-info p {
    margin: 0;
    font-size: 14px;
    color: #333;
}

.dish-collectCount, .dish-ateCount {
    text-align: right;
    font-size: 10px;
    color: #666;
}

.info-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-right: 5px;
}

.user-name {
  white-space: nowrap; /* 防止文本换行 */
  max-width: 50px;
  overflow: hidden; /* 隐藏超出容器的内容 */
  text-overflow: ellipsis; /* 显示省略号 */
  font-size: 14px;
  color: #333;
}

</style>