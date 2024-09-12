<!-- User.vue -->
<template>
  <div class="bg">
    <div id="logout">
      <ConfirmModal :exeName="'退出登录'"/>
    </div>
    <div class="userInfo" v-if="userInfo">
      <el-row :gutter="10">
        <el-col :span="12" style="width: 200px;">
          <el-avatar :size="200" :src="userInfo.avatar"></el-avatar>
        </el-col>
        <el-col :span="12" style="width: 250px!important;">
          <h2>
            {{ userInfo.username }}
            <span v-if="userInfo.gender === 'female'" class="gender-icon"><i class="fas fa-female"></i></span>
            <span v-if="userInfo.gender === 'male'" class="gender-icon"><i class="fas fa-male"></i></span>
            <span v-if="userInfo.gender === 'null'" class="gender-icon"><i class="fas fa-genderless"></i></span>
          </h2>
          <p class="in-one"><strong>邮箱：</strong>{{ userInfo.email }}</p>
          <p class="in-one"><strong>个性签名：</strong>{{ userInfo.introduction }}</p>
        </el-col>
      </el-row>
    </div>
    <div class="editUserInfo">
      <button @click="showEditModal = true" class="userBtn">编辑用户信息</button>
      <EditUserInfoModal
          :userInfo="userInfo"
          :showModal="showEditModal"
          @update:showModal="showEditModal = $event"
          @doUpdate="doUpdate"
      />
      <button @click="showChangePasswordModal = true" class="userBtn">修改密码</button>
      <ChangePasswordModal
          :showModal="showChangePasswordModal"
          @update:showModal="showChangePasswordModal = $event"
      />
    </div>
    <div class="checkBox" @change="Toggle">
      <el-radio-group v-model="radio" size="large" class="radio-group">
        <el-radio-button class="radio" label="吃过" :value="'吃过'" name="ate"/>
        <el-radio-button class="radio" label="收藏的菜肴" :value="'收藏的菜肴'" name="collectDishs"/>
        <el-radio-button class="radio" label="收藏的食堂" :value="'收藏的食堂'" name="collectCafeterias"/>
        <el-radio-button class="radio" label="收藏的柜台" :value="'收藏的柜台'" name="collectCounters"/>
        <el-radio-button class="radio" label="我的帖子" :value="'我的帖子'" name="post"/>
      </el-radio-group>
    </div>
    <div style="margin-top: 30px;" v-if="userInfo">
      <div v-if="radio === '收藏的菜肴'">
        <div v-if="userCollectDishes?.length === 0">
          <el-empty description="现在还没有收藏菜肴..."/>
        </div>
        <div v-infinite-scroll="load" :infinite-scroll-disabled="disabled" :infinite-scroll-delay="200"
             :infinite-scroll-distance="100"
             v-else>
          <div class="dishes-preview">
            <div v-for="collect in userCollectDishes" :key="collect.id">
              <Preview :name="'dish'" :preview="collect"/>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="radio === '收藏的柜台'">
        <div v-if="userCollectCounters?.length === 0">
          <el-empty description="现在还没有收藏柜台..."/>
        </div>
        <div v-infinite-scroll="load" :infinite-scroll-disabled="disabled" :infinite-scroll-delay="200"
             :infinite-scroll-distance="100"
             v-else>
          <div class="counters-preview">
            <div v-for="collect in userCollectCounters" :key="collect.id">
              <Preview :name="'counter'" :preview="collect"/>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="radio === '收藏的食堂'">
        <div v-if="userCollectCafeterias?.length === 0">
          <el-empty description="现在还没有收藏食堂..."/>
        </div>
        <div v-infinite-scroll="load" :infinite-scroll-disabled="disabled" :infinite-scroll-delay="200"
             :infinite-scroll-distance="100"
             v-else>
          <div class="cafeterias-preview">
            <div v-for="collect in userCollectCafeterias" :key="collect.id">
              <Preview :name="'cafeteria'" :preview="collect"/>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="radio === '吃过'">
        <div v-if="userAte?.length === 0">
          <el-empty description="现在还没有吃过..."/>
        </div>
        <div v-infinite-scroll="load" :infinite-scroll-disabled="disabled" :infinite-scroll-delay="200"
             :infinite-scroll-distance="100"
             v-else>
          <div class="dishes-preview">
            <div v-for="dish in userAte" :key="dish.id">
              <Preview :name="'dish'" :preview="dish"/>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="radio === '我的帖子'">
        <div v-if="userPost?.length === 0">
          <el-empty description="现在还没有我的帖子..."/>
        </div>
        <div v-infinite-scroll="load" :infinite-scroll-disabled="disabled" :infinite-scroll-delay="200"
             :infinite-scroll-distance="100"
             v-else>
          <div class="dishes-preview">
            <div v-for="post in userPost" :key="post.id">
              <Preview :name="'dish'" :preview="post"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="particles-js"></div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import Preview from "@/components/Preview.vue";
import {queryUserPost} from "@/api";
import EditUserInfoModal from '@/components/EditUserInfoModal.vue';
import ChangePasswordModal from '@/components/ChangePasswordModal.vue';
import {useUserStore} from "@/store/user";
import 'particles.js';

// 加载用户信息
const userStore = useUserStore();
const userInfo = ref(userStore.userInfo);
const userAte = ref([]);
const userCollectDishes = ref([]);
const userCollectCounters = ref([]);
const userCollectCafeterias = ref([]);
const userPost = ref([]);

const getUserInfo = async () => {
  document.title = userInfo.value.username + '的小蓝书';
};

// 主页切换标签
const radio = ref('吃过');
const disabled = ref(true); // 初始禁用滚动加载
const showEditModal = ref(false);
const showChangePasswordModal = ref(false);

const doUpdate = async () => {
  await useUserStore().updateUserBaseInfo()
};

const Toggle = async () => {
  const user_id = userInfo.value.userId;
  const offset = 0;
  const types = radio.value;

  if (types === '收藏的菜肴' && userCollectDishes.value.length === 0) {
    const post = await queryUserPost({user_id, types, offset});
    userCollectDishes.value = post.data.info;
  } else if (types === '收藏的柜台' && userCollectCounters.value.length === 0) {
    const post = await queryUserPost({user_id, types, offset});
    userCollectCounters.value = post.data.info;
  } else if (types === '收藏的食堂' && userCollectCafeterias.value.length === 0) {
    const post = await queryUserPost({user_id, types, offset});
    userCollectCafeterias.value = post.data.info;
  } else if (types === '吃过' && userAte.value.length === 0) {
    const post = await queryUserPost({user_id, types, offset});
    userAte.value = post.data.info;
  } else if (types === '我的帖子' && userPost.value.length === 0) {
    const post = await queryUserPost({user_id, types, offset});
    userPost.value = post.data.info;
  }
  disabled.value = false;
};

const load = async () => {
  disabled.value = true;
  const user_id = userInfo.value.id;
  const types = radio.value;

  if (types === '我的帖子') {
    const offset = userPost.value.length;
    const post = await queryUserPost({user_id, types, offset});
    if (post.data.info.length === 0) {
      disabled.value = true;
    } else {
      userPost.value = [...userPost.value, ...post.data.info];
      disabled.value = false;
    }
  } else if (types === '吃过') {
    const offset = userAte.value.length;
    const ate = await queryUserPost({user_id, types, offset});
    if (ate.data.info.length === 0) {
      disabled.value = true;
    } else {
      userAte.value = [...userAte.value, ...ate.data.info];
      disabled.value = false;
    }
  } else if (types === '收藏的菜肴') {
    const offset = userCollectDishes.value.length;
    const collect = await queryUserPost({user_id, types, offset});
    if (collect.data.info.length === 0) {
      disabled.value = true;
    } else {
      userCollectDishes.value = [...userCollectDishes.value, ...collect.data.info];
      disabled.value = false;
    }
  } else if (types === '收藏的柜台') {
    const offset = userCollectCounters.value.length;
    const collect = await queryUserPost({user_id, types, offset});
    if (collect.data.info.length === 0) {
      disabled.value = true;
    } else {
      userCollectCounters.value = [...userCollectCounters.value, ...collect.data.info];
      disabled.value = false;
    }
  } else if (types === '收藏的食堂') {
    const offset = userCollectCafeterias.value.length;
    const collect = await queryUserPost({user_id, types, offset});
    if (collect.data.info.length === 0) {
      disabled.value = true;
    } else {
      userCollectCafeterias.value = [...userCollectCafeterias.value, ...collect.data.info];
      disabled.value = false;
    }
  }
};

// onMounted 生命周期钩子
onMounted(async () => {
  await getUserInfo();
  await Toggle();
});

    onMounted(() => {
      const script = document.createElement('script');
      script.src = '/src/utils/particles.js';
      script.onload = () => {
        particlesJS.load('particles-js', '/particles.json', function () {
          console.log('particles.js loaded - callback');
        });
      };
      document.body.appendChild(script);
    });


</script>

<style scoped>
.bg {
  min-height: 100%;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 100%;
  position: relative;
}

#particles-js {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1000;
}

#logout {
  margin-top: 10px;
  margin-right: 10px;
  float: right;
}

.editUserInfo {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

h3 {
  margin: 0;
  padding: 10px;
  background-color: #4274b9;
  color: white;
  text-align: center;
}

.userInfo {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 20px;
}

.checkBox {
  margin-top: 30px;
}

.radio-group {
  display: flex;
  justify-content: center;
}

.gender-icon {
  margin-left: 10px;
  font-size: 0.8em; /* 调整字体大小 */
  color: #888; /* 调整颜色 */
}

.gender-icon i {
  margin-right: 5px;
}

.in-one {
  width: 240px;
}

.fa-female {
  color: pink;
}

.fa-male {
  color: blue;
}

.userBtn {
  margin: 10px;
}
</style>
