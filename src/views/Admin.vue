<template>
    <div class="stuList">
        <StuList />
    </div>
</template>

<script>
import StuList from '@/views/StuList.vue';

export default {
    name: 'Admin',
    components: {
        StuList
    }
}

</script>

<style>
.stuList {
    margin: 10px;
    padding: 0;
    border: 0;
    display: block;
    /* justify-content: center;
    align-items: center; */
    /* height: 100%; */
}
</style>