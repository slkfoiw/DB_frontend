<template>
  <div>
    <header>
      <CafeteriaHeader :selectedCafeteria="cafeteriaId"></CafeteriaHeader>
      <div class="subHeader">
        <h2>柜台名：{{ counter.name }}</h2>
        <div v-if="!hasCollectedCounter">
          <button class="userBtn" @click="collectCounter(counterId)">收藏该柜台</button>
        </div>
        <div v-else>
          <button class="userBtn" @click="noCollectCounter(counterId)">取消收藏</button>
        </div>
      </div>
    </header>

    <body>
      <div class="dishes-preview">
        <div v-for="dish in dishes" :key="dish.id">
          <Preview :name="'dish'" :preview="dish" />
        </div>
      </div>
    </body>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import CafeteriaHeader from '@/components/CafeteriaHeader.vue';
import Preview from '@/components/Preview.vue';
import { getCounter, getDishes, doCollectCounter, cancelCollectCounter } from '@/api';
import { useUserStore } from '@/store/user';
import {ElMessage} from "element-plus";

export default {
  name: 'Counter',
  components: {
    CafeteriaHeader,
    Preview,
  },
  setup() {
    const route = useRoute();
    const counter = ref({});
    const dishes = ref([]);
    const cafeteriaId = computed(() => Number(route.params.cafeteriaId)); // 从路由参数中获取 cafeteriaId
    const counterId = computed(() => Number(route.params.counterId)); // 从路由参数中获取 counterId

    const userStore = useUserStore();
    const hasCollectedCounter = computed(() => userStore.userCollectCounters.includes(counterId.value));

    const fetchCounterData = async (id) => {
      try {
        const response = await getCounter({counterId: id});
        counter.value = response.data;
      } catch (error) {
        console.error('获取柜台数据失败:', error);
      }
    };

    const fetchDishesData = async (id) => {
      try {
        const response = await getDishes({counterId: id});
        dishes.value = response.data.info;
      } catch (error) {
        console.error('获取菜肴数据失败:', error);
      }
    };

    onMounted(() => {
      fetchCounterData(counterId.value);
      fetchDishesData(counterId.value);
    });

    watch(counterId, (newId) => {
      fetchCounterData(newId);
      fetchDishesData(newId);
    });

    const collectCounter = async (id) => {
      try {
        await doCollectCounter({id: id});
        userStore.extendUserInfo('counter', id);
        ElMessage(
          {
            message: '收藏柜台成功',
            type: 'success'
          }
        )
      } catch (error) {
        console.error('收藏柜台失败:', error);
      }
    };

    const noCollectCounter = async (id) => {
      try {
        await cancelCollectCounter({id: id});
        userStore.removeUserInfo('counter', id);
        ElMessage(
          {
            message: '取消收藏柜台成功',
            type: 'success'
          }
        )
      } catch (error) {
        console.error('取消收藏柜台失败:', error);
      }
    };

    return {
      counter,
      dishes,
      cafeteriaId,
      counterId,
      hasCollectedCounter,
      collectCounter,
      noCollectCounter
    };
  },
};
</script>

<style scoped>
/* Your styles here */
</style>
