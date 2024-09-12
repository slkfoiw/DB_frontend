<!-- CafeteriaHeader.vue -->
<template>
  <div>
    <h3>所有食堂</h3>
    <ul>
      <li v-for="cafeteria in cafeterias" :key="cafeteria.id">
        <router-link
          :to="`/cafeteria/${cafeteria.id}`"
          :class="{ 'active': selectedCafeteria === cafeteria.id }">
          {{ cafeteria.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { getAllCafeterias } from '@/api';
import { ref, onMounted } from 'vue';

export default {
  name: 'CafeteriaHeader',
  props: {
    selectedCafeteria: Number
  },
  setup() {
    const cafeterias = ref([]);

    onMounted(async () => {
      const res = await getAllCafeterias();
      cafeterias.value = res.data.info;
    });

    return {
      cafeterias
    };
  }
};
</script>

<style scoped>
h3 {
  margin: 0;
  padding: 10px;
  background-color: #4274b9;
  color: white;
  text-align: center;
}

ul {
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
}

li {
  display: inline-block;
  margin-right: 0px;
  width: 20%;
  font-size: 18px;
  text-align: center;
}

a {
  display: block;
}

.active {
  background-color: #4274b9;
  color: white;
}

@media (hover: hover) {
  a:hover {
    background-color: rgb(251, 216, 174);
  }
}
</style>
