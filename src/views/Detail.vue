<script>
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import PostDetail from "@/components/PostDetail.vue";
import { controlDetail } from "@/store/controlDetail";
import { useUserStore } from "@/store/user";
import { Close } from '@element-plus/icons-vue';
import { postDelete } from '@/api/index';
import { ElMessage } from 'element-plus';

export default {
  name: "Detail",
  components: {
    PostDetail,
    Close,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();
    const Detail = controlDetail();
    const detail = Detail.detail;
    const detailPublishUserId = computed(() => detail.value.user ? detail.value.user.id : null);
    // 评论内容
    const content = Detail.content;
    const getDetail = () => Detail.getDetail(route.params.dishId); // 使用正确的路由参数名
    const afterDoComment = (comment) => Detail.afterDoComment(comment);

    const closeDetail = () => {
      console.log(detail.value);
      router.back();
    };

    const deleteDetail = async () => {
      try {
        const response = await postDelete({ id: detail.value.id });
        ElMessage(
          {
            message: response.data.info,
            type: 'success',
            duration: 2000
          }
        )
        await router.push('/home');
      } catch (error) {
        ElMessage.error('删除帖子失败');
        console.error("Failed to delete post:", error);
      }
    };

    onMounted(() => getDetail());
    return { userStore, detail, detailPublishUserId, afterDoComment, content, closeDetail, deleteDetail };
  }
}
</script>

<template>
  <div class="box">
    <PostDetail :detail="detail" @afterDoComment="afterDoComment" v-if="detail.id" />
    <div class="close-button" @click="closeDetail">
      <el-icon>
        <Close />
      </el-icon>
    </div>
    <el-button v-if="detailPublishUserId === userStore.userInfo.userId" type="danger" @click="deleteDetail" class="delete-button">
      删除帖子
    </el-button>
  </div>
</template>

<style scoped>
.box {
  position: absolute;
  /* left: 50px;
  top: 5px; */
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 0.8rem;
  width: 1200px;
  height: 600px;
  z-index: 1000;
}

.close-button {
  color: #4274b9;
  position: absolute;
  /* top: 20px;
  left: 1190px; */
  left: 95%;
  top: 1%;

  cursor: pointer;
  transition: transform 0.3s ease-in-out;
  font-size: 2.5rem;
  z-index: 1000;
}

.close-button:hover {
  transform: rotate(90deg);
}

.close-button>svg {
  width: 25px;
  height: 25px;
  stroke-width: 2;
}

.delete-button {
  position: absolute;
  left: 91%;
  top: 12%;
  font-weight: bold;
  background-color: #4274b9;
  border-color: #4274b9;
  z-index: 1000;
}
</style>
