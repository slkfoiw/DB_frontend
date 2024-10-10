<template>
    <div>
        <div class="stuList">
            <StuList />
        </div>
        <div class="dormManaList">
            <DormManaList />
        </div>
        <div class="noticeList">
            <NoticeList />
        </div>
        <div class="repairList">
            <RepairList />
        </div>
    </div>
</template>

<script>
import StuList from '@/views/StuInfo.vue';
import DormManaList from '@/views/DormManaInfo.vue';
import NoticeList from '@/views/NoticeList.vue';
import RepairList from '@/views/RepairList.vue';

export default {
    name: 'Admin',
    components: {
        StuList,
        DormManaList,
        NoticeList,
        RepairList
    }
}

</script>

<style>
.stuList, .dormManaList, .noticeList, .repairList {
    margin: 20px;
    padding: 10px;
    border: 2px solid #abacca;
    display: block;
    /* justify-content: center;
    align-items: center; */
}

</style>