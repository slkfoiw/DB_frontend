<script>
import { useRouter } from "vue-router";
import { useUserStore} from "@/store/user.js";
import {computed, onBeforeMount, onMounted, ref} from "vue";
import { Back, Plus } from '@element-plus/icons-vue'
import { ElMessage } from "element-plus";
import { getCurrentTime } from "@/utils/getTime";
import { uploadPost } from "@/api";
import { getAllCafeterias, getCountersOf } from "@/api/cafeteria";
import PostDetail from "@/components/PostDetail.vue";
import 'particles.js';


export default {
  name: "Upload",
  components: {
    Plus,
    Back,
    PostDetail
  },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const checkLogin = () => {
      if (!userStore.userInfo.username) {
        ElMessage({
          message: '请先登录',
          type: 'warning',
          duration: 2000,
        });
        router.replace('/login')
      }
    }

    onBeforeMount(() => {
      checkLogin()
      fetchCafeterias()
    })

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

    const fileList = ref([])
    const fileListUrl = computed(() => fileList.value.map(item => item.url))
    const title = ref('')
    const content = ref('')
    const dialogImageUrl = ref('')
    const dialogVisible = ref(false)
    const postData = ref({})
    const Post = ref({})
    const PostId = ref(0)
    const cafeterias = ref([]);
    const counters = ref([]);
    const selectedCafeteria = ref(null);
    const selectedCounter = ref(null);
    const dishName = ref('');
    const dishPrice = ref('');

    const handlePictureCardPreview = (uploadFile) => {
      dialogImageUrl.value = uploadFile.url
      dialogVisible.value = true
      return true
    }

    // 图片上传错误处理
    const onError = async (error) => {
      ElMessage({
        type: 'warning',
        message: '图片上传失败',
        duration: 3000
      })
      await router.replace('/')
    }

    // 图片上传变化处理
    const handleChange = (uploadFile, uploadFiles) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // 可接受的图片类型
      const maxSize = 5; // 最大文件大小，单位：MB
      if (!allowedTypes.includes(uploadFile.raw.type)) {
        ElMessage.error('请上传正确的图片文件!');
        upload.value.handleRemove(uploadFile);
        return false;
      } else if (uploadFile.raw.size / 1024 / 1024 > maxSize) {
        ElMessage.error(`文件大小最多${maxSize}MB!`);
        upload.value.handleRemove(uploadFile);
        return false;
      }

      return true;
    }
    const upload = ref(null)

    // 图片上传前处理
    const beforeUpload = (rawFile) => {
      Post.value.id = PostId.value
    }

    // 执行上传
    const doUploads = async () => {
      if (fileListUrl.value.length === 0) {
        ElMessage.warning(
          '请至少上传一张图片!'
        )
        return
      }
      if (title.value === '') {
        ElMessage.warning(
          '请输入标题'
        )
        return
      }
      if (!selectedCafeteria.value) {
        ElMessage.warning('请选择食堂');
        return;
      }
      if (!selectedCounter.value) {
        ElMessage.warning('请选择窗口');
        return;
      }
      if (dishName.value === '') {
        ElMessage.warning('请输入菜品名称');
        return;
      }
      if (dishPrice.value === '') {
        ElMessage.warning('请输入菜品价格');
        return;
      }
      const data = {
        title: title.value,
        content: content.value,
        user_id: userStore.userInfo.id,
        cafeteria_id: selectedCafeteria.value,
        counter_id: selectedCounter.value,
        dish_name: dishName.value,
        dish_price: dishPrice.value,
      }
      try {
        const response = await uploadPost(data);
        PostId.value = response.data.id
        upload.value.submit()
      } catch (error) {
        ElMessage.error('发布失败:', error);
        return;
      }
      ElMessage({ type: 'success', message: '发布成功，3秒后跳转到主页' })
      setTimeout(() => {
        router.replace('/')
      }, 3000)

    }

    // 获取所有食堂信息
    const fetchCafeterias = async () => {
      try {
        const response = await getAllCafeterias();
        cafeterias.value = response.data.info;
      } catch (error) {
        ElMessage.error('获取食堂信息失败');
      }
    };

    // 根据食堂ID获取所有窗口信息
    const fetchCounters = async (id) => {
      selectedCounter.value = null;
      try {
        const response = await getCountersOf({ cafeteriaId: id });
        counters.value = response.data.info;
      } catch (error) {
        ElMessage.error('获取柜台数据失败:', error);
      }
    };

    // 超过最大上传图片数处理
    const handleExceed = () => {
      ElMessage.warning(
        '最多可以添加9张图片哦!'
      )
    }

    // 制作预览页面
    const show = ref(false)
    const close = () => {
      show.value = false
    }
    const MakePrev = () => {
      if (fileListUrl.value.length === 0) {
        ElMessage.warning(
          '请至少上传一张图片!'
        )
        return
      }
      if (title.value === '') {
        ElMessage.warning(
          '请输入标题'
        )
        return
      }
      if (!selectedCafeteria.value) {
        ElMessage.warning('请选择食堂');
        return;
      }
      if (!selectedCounter.value) {
        ElMessage.warning('请选择窗口');
        return;
      }
      if (dishName.value === '') {
        ElMessage.warning('请输入菜品名称');
        return;
      }
      if (dishPrice.value === '') {
        ElMessage.warning('请输入菜品价格');
        return;
      }
      postData.value = {
        id: 1,
        title: title.value,
        content: content.value,
        user: userStore.userInfo,
        imgs: fileListUrl.value,
        createTime: getCurrentTime(),
        dish_name: dishName.value,
        dish_price: dishPrice.value,
      }
      show.value = true
    }
    const validatePrice = (value) => {
    const regex = /^\d*\.?\d*$/;
    if (!regex.test(value)) {
      ElMessage.warning('请输入有效的价格');
      dishPrice.value = dishPrice.value.slice(0, -1);
    }
  }
    const empty = []
    return {
      fileList,
      fileListUrl,
      title,
      content,
      dialogImageUrl,
      dialogVisible,
      postData,
      Post,
      PostId,
      handlePictureCardPreview,
      handleChange,
      onError,
      upload,
      beforeUpload,
      doUploads,
      handleExceed,
      show,
      close,
      MakePrev,
      empty,
      userStore,
      cafeterias,
      counters,
      selectedCafeteria,
      selectedCounter,
      fetchCounters,
      dishName,
      dishPrice,
      validatePrice
    }
  }
};
</script>

<template>
  <div class="bg">
    <el-row :gutter="0" class="content-row">
      <el-col :span="12">
        <div class="leftArea">
          <h1 style="text-align: center">上传图片</h1>
          <div class="img-container">
            <el-upload
                v-model:file-list="fileList"
                action="http://localhost:8000/post/upload/images"
                class="preview"
                ref="upload"
                list-type="picture-card" multiple
                :headers="userStore.headers"
                :limit="9"
                :on-preview="handlePictureCardPreview"
                :on-change="handleChange"
                :auto-upload="false"
                :on-exceed="handleExceed"
                :data="Post"
                :before-upload="beforeUpload"
                :on-error="onError">
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="rightArea">
          <h1 style="text-align: center">内容区</h1>
          <div class="content-container">
            <el-select v-model="selectedCafeteria" placeholder="请选择食堂"
              class="select" @change="fetchCounters">
              <el-option v-for="cafeteria in cafeterias" :key="cafeteria.id" :label="cafeteria.name"
                :value="cafeteria.id"></el-option>
            </el-select>

            <el-select v-model="selectedCounter" placeholder="请选择窗口"
              class="select">
              <el-option v-for="counter in counters" :key="counter.id" :label="counter.name"
                :value="counter.id"></el-option>
            </el-select>

            <el-input v-model="title" maxlength="20" placeholder="请输入标题" show-word-limit type="text"
              class="input" />

            <el-input v-model="dishName" maxlength="20" placeholder="请输入菜品名称" show-word-limit type="text"
              class="input" />

            <el-input v-model="dishPrice" type="number" placeholder="请输入菜品价格" @input="validatePrice"
              class="input" />

            <div style="margin: 20px 0"></div>
            <el-input v-model="content" maxlength="3000" placeholder="请输入内容" show-word-limit type="textarea"
              class="textarea" autosize />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="0" class="button-row">
      <el-button class="touchButton" round color="#4274b9" size="large"
        @click="doUploads">发布推文</el-button>
      <el-button class="touchButton" round color="#4274b9" size="large"
        @click="MakePrev">生成预览</el-button>
    </el-row>
    <el-dialog v-model="dialogVisible">
      <img :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
    <div id="particles-js"></div>
  </div>

  <div class="overlay" v-if="show">
    <button class="backPage" @click="close">
      <el-icon>
        <Back />
      </el-icon>
    </button>
    <post-detail :detail="postData" :comments="empty" :review="true" />
  </div>

</template>


<style scoped>

.content-row {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
}

.leftArea, .rightArea {
  margin: 25px;
  flex: 1;
}

.img-container, .content-container {
  border-radius: 20px;
  border: #2c3e50 1px solid;
  width: 100%;
  height: 400px;
  overflow: auto;
}


.select, .input, .textarea {
  margin-top: 20px;
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
}

.button-row {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 80%;
}

.touchButton {
  margin: 0 10px;
  color: white;
}


.overlay {
  position: fixed;
  top: 0;
  left: 10%;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.backPage {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all .3s;
  z-index: 9999;
}

#particles-js {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.bg {
  background-image: url('https://buaaxiaolanshu.oss-cn-beijing.aliyuncs.com/static/bg-login.svg');
  min-height: 100vh;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: -1;
}
</style>