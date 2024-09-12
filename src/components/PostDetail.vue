<script>
import { ChatRound, Edit } from '@element-plus/icons-vue';
import { defineComponent, onMounted, ref, defineEmits } from "vue";
import { doComment, doReplyComment, doCollectDish, cancelCollectDish, doAte, cancelAte, loadReplies, getComment } from "@/api/index";
import { ElMessage, ElButton, ElInput } from "element-plus";
import { useUserStore } from "@/store/user";
import infiniteScroll from 'vue-infinite-scroll'; // Import the infinite-scroll directive

export default defineComponent({
  name: 'PostDetail',
  components: {
    ChatRound,
    Edit,
    ElMessage,
    ElButton,
    ElInput,
  },
  props: {
    detail: {
      type: Object,
      required: true,
    },
    review: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const comments = ref([]);
    const userStore = useUserStore();

    const checkCollect = (id) => {
      return userStore.userCollectDishes.includes(id);
    };
    const checkEat = (id) => {
      return userStore.userAte.includes(id);
    };

    const doSomething = async (type, detail) => {
      const dish_id = detail.id;

      if (type === 'ate') {
        const operator = checkEat(dish_id);
        const response = operator ? await cancelAte({id: dish_id}) : await doAte({id: dish_id});
        const res = response.data;
        if (operator) {
          userStore.removeUserInfo(type, dish_id);
          detail.ateCount--;
          ElMessage({ type: 'success', message: res.info });
        } else {
          userStore.extendUserInfo(type, dish_id);
          detail.ateCount++;
          ElMessage({ type: 'success', message: res.info });
        }
      } else if (type === 'collect') {
        const operator = checkCollect(dish_id);
        const response = operator ? await cancelCollectDish({id: dish_id}) : await doCollectDish({id: dish_id});
        const res = response.data;
        if (operator) {
          detail.collectCount--;
          userStore.removeUserInfo('dish', dish_id);
          ElMessage({ type: 'success', message: res.info });
        } else {
          detail.collectCount++;
          userStore.extendUserInfo('dish', dish_id);
          ElMessage({ type: 'success', message: res.info });
        }
      }
    };

    const content = ref('');
    const to = ref(0);
    const commentInput = ref(null);

    const sendComment = async (post, to) => {
      if (to === 0 || to === '0') {
        const data = {
          post_id: post.id,
          content: content.value
        };
        const response = await doComment({ data });
        const res = response.data;
        ElMessage({ type: 'success', message: res.info });
      } else {
        const data = {
          post_id: post.id,
          content: content.value,
          parent_comment_id: to
        };
        const response = await doReplyComment({ data });
        const res = response.data;
        ElMessage({ type: 'success', message: res.info });
      }
      content.value = '';
      comments.value = [];
      emit('afterDoComment');

      loadComments();
    };

    const commentMain = item => {
      to.value = item.id;
      const toPeople = item.user.username;
      commentInput.value.input.placeholder = `回复${toPeople}: `;
    };

    const loadReply = async (item) => {
      if (!Array.isArray(item.replies)) {
        item.replies = [];
      }
      const offset = item.replies.length;
      const id = item.id;
      const response = await loadReplies({ id, offset });
      const res = response.data;
      item.replies = [...item.replies, ...res.info];
      item.replyCount -= res.count;
    };

    const clearReply = () => {
      commentInput.value.input.placeholder = `说点什么....`;
      to.value = 0;
    };

    const disabled = ref(true);

    const loadComments = async () => {
      disabled.value = true;
      const offset = comments.value.length;
      const id = props.detail.id;
      const response1 = await getComment({ id, offset });
      const data = response1.data.info;
      if (data.length !== 0) {
        disabled.value = false;
        comments.value = [...comments.value, ...data];
      } else {
        disabled.value = true;
      }
    };

    onMounted(() => loadComments());

    return {
      comments,
      userStore,
      checkCollect,
      checkEat,
      doSomething,
      content,
      to,
      commentInput,
      sendComment,
      commentMain,
      loadReply,
      clearReply,
      disabled,
      loadComments
    };
  },
  directives: {
    infiniteScroll
  }
});
</script>



<template>
  <div class="box" v-if="detail.id">
    <div style="border-radius: 0.8rem;background-color:#fff;">
      <el-row :gutter="50">
        <!-- 图片区 -->
        <el-col :span="50">
          <div class="banner">
            <el-carousel height="620px">
              <el-carousel-item v-for="item in detail.imgs" :key="item">
                <img class="image" :src="item" alt="" />
              </el-carousel-item>
            </el-carousel>
          </div>
        </el-col>
        <!-- 图片区结束 -->
        <!-- 卡牌详情区 -->
        <el-col :span="50">
          <div class="info" style="width: 500px;margin-top: 10px;">
            <!-- 卡片头部 -->
            <el-row style="align-items: center;width: 500px;">
              <a>
                <el-avatar :src="detail.user.avatar" size="large" />
              </a>
              <div class="username">{{ detail.user.username }}</div>
            </el-row>
            <!-- 卡片头部结束 -->
            <div class="main-content">
              <!-- 卡片内容 -->
              <el-row >
                <h2>{{ detail.title }}</h2>
              </el-row>
              <el-row>
                <div class="content">{{ detail.content }}</div>
              </el-row>
              <el-row>
                <time class="time" style="margin-top: 10px;">{{ detail.createTime }}</time>
              </el-row>
              <!-- 卡片内容结束 -->
              <hr />
              <!-- 评论区 -->
              <div class="comments" v-if="comments" v-infinite-scroll="loadComments" :infinite-scroll-disabled="disabled">
                <el-empty description="现在还没有评论" v-if="comments.length === 0" />
                <div v-else class="commentBox">
                  <div class="commentTitle" style="margin-bottom: 5px;">共{{ detail.commentCount }}条评论</div>
                  <div v-for="item in comments" :key="item.id">
                    <el-row :gutter="20">
                      <el-col :span="2.5">
                        <a>
                          <el-avatar :src="item.user.avatar" :size="30"></el-avatar>
                        </a>
                      </el-col>
                      <el-col :span="20" style="font-size: 14px">
                        <div style="color:#33333399;">{{ item.user.username }}</div>
                        <div style="color:#333333;margin-top: 2px;margin-bottom: 5px;">{{ item.content }}</div>
                        <time class="time">{{ item.createTime }}</time>
                        <el-icon style="float: right;font-size: medium" @click="commentMain(item)">
                          <ChatRound />
                        </el-icon>
                      </el-col>
                      <el-col style="margin-top: 5px;">
                        <div v-for="reply in item.replies" :key="reply.id" style="margin-left: 30px">
                          <!-- 渲染子评论的内容 -->
                          <el-row :gutter="20">
                            <el-col :span="2.5">
                              <a>
                                <el-avatar :src="reply.user.avatar" :size="25"></el-avatar>
                              </a>
                            </el-col>
                            <el-col :span="20" style="font-size: 12px">
                              <div style="color:#33333399;">{{ reply.user.username }}</div>
                              <div style="color:#333333;margin-top: 2px;margin-bottom: 10px;">{{ reply.content }}</div>
                              <time class="time">{{ reply.createTime }}</time>
                            </el-col>
                          </el-row>
                        </div>
                        <div class="more" @click="loadReply(item)" v-if="item.replyCount > 0">展开{{
                          item.replyCount
                        }}条回复
                        </div>
                      </el-col>
                    </el-row>
                    <el-divider />
                  </div>
                </div>
              </div>
            </div>
            <el-divider :style="{ margin: '20px 0px' }"/>
          </div>
          <div class="bottomArea">
            <div class="buttonArea">
              <el-row>
                <el-button link class="warp" @click="doSomething('ate', detail)" :disabled="review">
                  <font-awesome-icon :icon="['fas', 'utensils']"
                    :style="{ color: checkEat(detail.id) ? '#f16a3d' : '#cecccc', width: '25px', height: '25px' }" />
                  <el-text size="large" tag="b" type="info">{{ detail.ateCount }}</el-text>
                </el-button>
                <el-button link class="warp" @click="doSomething('collect', detail)" :disabled="review">
                  <svg x="1689148085763" class="icon" viewBox="0 0 1024 1024" version="1.1" style="margin-bottom: 4px;"
                    xmlns="http://www.w3.org/2000/svg" p-id="4912" width="25" height="25">
                    <path
                      d="M512.009505 25.054894l158.199417 320.580987 353.791078 51.421464L767.995248 646.579761l60.432101 352.365345-316.417844-166.354615-316.436854 166.354615 60.432101-352.365345L0 397.057345l353.791078-51.421464z"
                      :fill="!checkCollect(detail.id) ? '#cecccc' : '#f1d63d'" p-id="4913"></path>
                  </svg>
                  <el-text size="large" tag="b" type="info">{{ detail.collectCount }}</el-text>
                </el-button>
                <el-button link class="warp" @click="clearReply">
                  <svg x="1689148939874" class="icon" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="6375" width="25" height="25">
                    <path
                      d="M512 0C226.742857 0 0 197.485714 0 446.171429c0 138.971429 73.142857 270.628571 190.171429 351.085714L190.171429 1024l226.742857-138.971429c29.257143 7.314286 65.828571 7.314286 95.085714 7.314286 285.257143 0 512-197.485714 512-446.171429C1024 197.485714 797.257143 0 512 0zM256 512C219.428571 512 190.171429 482.742857 190.171429 446.171429S219.428571 380.342857 256 380.342857c36.571429 0 65.828571 29.257143 65.828571 65.828571S292.571429 512 256 512zM512 512C475.428571 512 446.171429 482.742857 446.171429 446.171429S475.428571 380.342857 512 380.342857c36.571429 0 65.828571 29.257143 65.828571 65.828571S548.571429 512 512 512zM768 512C731.428571 512 702.171429 482.742857 702.171429 446.171429s29.257143-65.828571 65.828571-65.828571c36.571429 0 65.828571 29.257143 65.828571 65.828571S804.571429 512 768 512z"
                      p-id="6376" fill="#cecccc"></path>
                  </svg>
                  <el-text size="large" tag="b" type="info">{{ detail.commentCount }}</el-text>
                </el-button>
              </el-row>
            </div>
            <el-input v-model="content" class="comment-input my" type="text" placeholder="说点什么..." ref="commentInput"
              @keyup.enter="sendComment(detail, to)" clearable style="margin-top: 5px" :disabled="review">
              <template #prefix>
                <el-icon>
                  <Edit />
                </el-icon>
              </template>
            </el-input>
          </div>
        </el-col>
        <!-- 卡牌详情区结束 -->
      </el-row>
    </div>
  </div>
</template>


<style scoped>
.content {
  margin: 0;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  color: #333;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.more {
  margin-left: 32px;
  margin-top: 16px;
  line-height: 18px;
  color: #13386c;
  cursor: pointer;
}

.commentTitle {
  font-size: 14px;
  line-height: 18px;
  color: #666;
}

.box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 0.8rem;
  width: 1200px;
  height: 620px;
  margin-top: -8px;
  box-shadow: -16px 28px 28px -3px rgba(0, 0, 0, 0.1), 0px 10px 61px -8px rgba(0, 0, 0, 0.1);
}

.banner {
  width: 600px;
  border-radius: 0.8rem;
}

.username {
  margin-left: 15px;
}


.image {
  width: 600px;
  height: 620px;
  border-radius: 0.8rem 0 0 0.8rem;
  object-fit: cover;
}

.main-content::-webkit-scrollbar {
  width: 0.1em;
  /* 设置滚动条宽度为0.1em */
  background-color: transparent;
  /* 设置滚动条背景颜色为透明 */
}

.main-content {
  height: 420px;
  overflow-y: scroll;
}

.time {
  font-size: 12px;
  color: #999;
}

.bottomArea {
  position: absolute;
}

.buttonArea {
  position: relative;
  width: 500px;
  height: 35px;
  bottom: 1em;
}

.warp {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.comment-input {
  position: relative;
  bottom: 1.5em;
  width: 500px;
}
</style>