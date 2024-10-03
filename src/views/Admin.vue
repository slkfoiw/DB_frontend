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
import StuList from '@/components/StuList.vue';
import DormManaList from '@/components/DormManaList.vue';
import NoticeList from '@/components/NoticeList.vue';
import RepairList from '@/components/RepairList.vue';

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