<template>
  <div>
    <head>
      <title>{{ cafeteria.name }}食堂</title>
    </head>
    <header>
      <CafeteriaHeader :selectedCafeteria="cafeteriaId"></CafeteriaHeader>
      <div class="subHeader">
        <h2>食堂名：{{ cafeteria.name }}</h2>
        <div v-if="!hasCollectedCafeteria">
          <button class="userBtn" @click="collectCafeteria(cafeteriaId)">收藏该食堂</button>
        </div>
        <div v-else>
          <button class="userBtn" @click="noCollectCafeteria(cafeteriaId)">取消收藏</button>
        </div>
      </div>
    </header>

    <body>
      <div class="counters-preview">
        <div v-for="counter in counters" :key="counter.id">
          <Preview :name="'counter'" :preview="counter" :cafeteriaId="cafeteriaId"/>
        </div>
      </div>
    </body>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import CafeteriaHeader from '@/components/CafeteriaHeader.vue';
import Preview from '@/components/Preview.vue';
import { useRoute } from 'vue-router';
import { getCafeteria, getCountersOf, doCollectCafeteria, cancelCollectCafeteria } from '@/api';
import { useUserStore } from '@/store/user';
import {ElMessage} from "element-plus";

export default {
  name: 'Cafeteria',
  components: {
    CafeteriaHeader,
    Preview
  },
  setup() {
    const route = useRoute();
    const cafeteria = ref({});
    const counters = ref([]);
    const cafeteriaId = computed(() => Number(route.params.cafeteriaId));

    const userStore = useUserStore();
    const hasCollectedCafeteria = computed(() => userStore.userCollectCafeterias.includes(cafeteriaId.value));

    const fetchCafeteriaData = async (id) => {
      try {
        const res = await getCafeteria({ cafeteriaId: id });
        cafeteria.value = res.data;

        const response = await getCountersOf({ cafeteriaId: id });
        counters.value = response.data.info;
      } catch (error) {
        console.error('获取柜台数据失败:', error);
      }
    };

    onMounted(() => {
      fetchCafeteriaData(cafeteriaId.value);
    });

    watch(cafeteriaId, (newId) => {
      fetchCafeteriaData(newId);
    });

    const collectCafeteria = async (id) => {
      try {
        await doCollectCafeteria({ id: id });
        userStore.extendUserInfo('cafeteria', id);
        ElMessage(
          {
            message: '收藏食堂成功',
            type: 'success'
          }
        )
      } catch (error) {
        console.error('收藏食堂失败:', error);
      }
    };

    const noCollectCafeteria = async (id) => {
      try {
        await cancelCollectCafeteria({ id: id });
        userStore.removeUserInfo('cafeteria', id);
        ElMessage(
          {
            message: '取消收藏食堂成功',
            type: 'success'
          }
        )
      } catch (error) {
        console.error('取消收藏食堂失败:', error);
      }
    };

    return {
      cafeteria,
      counters,
      cafeteriaId,
      hasCollectedCafeteria,
      collectCafeteria,
      noCollectCafeteria
    };
  }
};
</script>

<style scoped>
/* Your styles here */
</style>
