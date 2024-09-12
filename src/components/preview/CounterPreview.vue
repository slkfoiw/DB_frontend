<template>
    <div class="counter-item">
        <div class="counter-image">
            <img :src="counter.img" alt="窗口图片" />
        </div>
        <div class="counter-text">
            <p>{{ counter.name }}: {{ counter.floor }}层</p>
            <div class="counter-collectCount">
                <span>{{ counter.collectCount }} 收藏</span>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CounterPreview',
    props: {
        counter: {
            type: Object,
            required: true
        }
    },
});
</script>


<style scoped>
.counter-item {
    width: 200px;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.counter-image img {
    width: 100%;
    height: 150px;
    object-fit: cover;
}

.counter-text {
    padding: 10px;
    background-color: #f9f9f9;
}

.counter-text p {
    margin: 0;
    font-size: 14px;
    color: #333;
}

.counter-collectCount {
    text-align: right;
    font-size: 12px;
    color: #666;
}
</style>