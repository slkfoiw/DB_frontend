<template>
  <div>
    <el-breadcrumb separator-icon="ArrowRight" style="margin: 16px">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的宿舍</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin: 15px; min-height: calc(100vh - 111px)">
      <div style="display: flex">
        <div style="margin-top: 55px">
          <div style="margin-left: 50px;margin-top: 20px">
            <!--      房间信息-->
            <el-descriptions :column="1" border style="width: 500px" title="房间信息">
              <el-descriptions-item>
                <template #label>
                  <div>
                    <el-icon>
                      <office-building />
                    </el-icon>
                    公寓号
                  </div>
                </template>
                <span class="rightSpan">{{ room.dormId }}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div>
                    <el-icon>
                      <Key />
                    </el-icon>
                    宿舍号
                  </div>
                </template>
                <span class="rightSpan">{{ room.roomId }}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div>
                    <el-icon>
                      <School />
                    </el-icon>
                    楼层
                  </div>
                </template>
                <span class="rightSpan">{{ room.floor }}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div>
                    <el-icon>
                      <chatRound />
                    </el-icon>
                    可住人数
                  </div>
                </template>
                <span class="rightSpan">{{ room.capacity }}</span>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div>
                    <el-icon>
                      <chatLineRound />
                    </el-icon>
                    已住人数
                  </div>
                </template>
                <span class="rightSpan">{{ room.peopleNum }}</span>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <!--      床位信息-->
          <div style="margin-left: 50px;margin-top: 40px">
            <el-descriptions :column="1" border style="width: 500px" title="床位信息">
              <el-descriptions-item>
                <template #label>
                  <div>
                    <el-icon>
                      <user />
                    </el-icon>
                    一号床位
                  </div>
                </template>
                <el-tag v-if="room.firstBed != null" :type="name === room.firstBed ? 'primary' : 'info'"
                  disable-transitions>{{
                    room.firstBed }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div>
                    <el-icon>
                      <user />
                    </el-icon>
                    二号床位
                  </div>
                </template>
                <el-tag v-if="room.secondBed != null" :type="name === room.secondBed ? 'primary' : 'info'"
                  disable-transitions>{{
                    room.secondBed }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div>
                    <el-icon>
                      <user />
                    </el-icon>
                    三号床位
                  </div>
                </template>
                <el-tag v-if="room.thirdBed != null" :type="name === room.thirdBed ? 'primary' : 'info'"
                  disable-transitions>{{
                  room.thirdBed }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div>
                    <el-icon>
                      <user />
                    </el-icon>
                    四号床位
                  </div>
                </template>
                <el-tag v-if="room.fourthBed != null" :type="name === room.fourthBed ? 'primary' : 'info'"
                  disable-transitions>{{
                  room.fourthBed }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getRoomInfo } from '@/api/myRoomInfo';
import { useUserStore } from '@/store/user';

// 存储用户信息
const form = ref({
  userId: "",
  name: "",
});

// 存储房间信息
const room = ref({
  roomId: "",
  dormId: "",
  floor: "",
  capacity: "",
  peopleNum: "",
  firstBed: "",
  secondBed: "",
  thirdBed: "",
  fourthBed: "",
});

// 存储用户名
const name = ref("");

// 初始化用户信息
const init = () => {
  const user = useUserStore().userInfo;
  form.userId = user.userId;
  form.name = user.name;
  name.value = user.name;
};

// 获取房间信息
const getInfo = async () => {
  try {
    const roomData = await getRoomInfo(form.userId);
    room.value = roomData.data.info;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  init();
  getInfo();
});
</script>

<style scoped>
.rightSpan {
  display: inline-block;
  width: 80px;
}
</style>