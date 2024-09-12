<template>
    <div class="cafeteria-item">
        <div class="cafeteria-image">
            <img :src="cafeteria.img" alt="窗口图片" />
        </div>
        <div class="cafeteria-text">
            <p>{{ cafeteria.name }}食堂</p>
            <div class="cafeteria-collectCount">
                <span>{{ cafeteria.collectCount }} 收藏</span>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CafeteriaPreview',
    props: {
        cafeteria: {
            type: Object,
            required: true
        }
    },
});
</script>


<style scoped>
.cafeteria-item {
    width: 200px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cafeteria-image img {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.cafeteria-text {
    padding: 10px;
    background-color: #f9f9f9;
}

.cafeteria-text p {
    margin: 0;
    font-size: 14px;
    color: #333;
}

.cafeteria-collectCount {
    text-align: right;
    font-size: 12px;
    color: #666;
}
</style>