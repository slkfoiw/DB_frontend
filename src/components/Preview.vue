<template>
    <div v-if="name=='dish'">
        <router-link :to="`/dish/${preview.id}`">
            <DishPreview :dish="preview" />
        </router-link>
    </div>
    <div v-else-if="name=='counter'">
        <div v-if="cafeteriaId">
            <router-link :to="`/cafeteria/${cafeteriaId}/counter/${preview.id}`">
                <CounterPreview :counter="preview" />
            </router-link>
        </div>
        <div v-else>
            <router-link :to="`/counter/${preview.id}`">
                <CounterPreview :counter="preview" />
            </router-link>
        </div>
    </div>
    <div v-else-if="name=='cafeteria'">
        <router-link :to="`/cafeteria/${preview.id}`">
            <CafeteriaPreview :cafeteria="preview" />
        </router-link>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import DishPreview from "@/components/preview/DishPreview.vue";
import CounterPreview from "@/components/preview/CounterPreview.vue";
import CafeteriaPreview from "@/components/preview/CafeteriaPreview.vue";

export default defineComponent({
    name: 'Preview',
  components: {CafeteriaPreview, CounterPreview, DishPreview},
    props: {
        name: {
            type: String,
            required: true
        },
        preview: {
            type: Object,
            required: true
        },
        cafeteriaId: {
            type: String,
            required: false
        }
    },
    setup(props) {
        console.log("preview:", props.preview);
        return {};
    }
});
</script>

<style scoped>

</style>