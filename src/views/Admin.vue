<template>
    <el-breadcrumb separator-icon="ArrowRight" style="margin: 16px">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <!-- 头部数据 -->
        <div>
            <el-row :gutter="20" class="topInfo">
                <el-col :span="6">
                    <el-button @click="selectAnalysis('student')" class="el-colDiv student-btn">
                        <span class="title">学生统计 </span><br />
                        <span class="digital">{{ studentNum }}人</span><br />
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-button @click="selectAnalysis('dormManager')" class="el-colDiv dorm-manager-btn">
                        <span class="title">宿管统计 </span><br />
                        <span class="digital">{{ dormManaNum }}人</span><br />
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-button @click="selectAnalysis('repair')" class="el-colDiv repair-btn">
                        <span class="title">报修统计 </span><br />
                        <span class="digital">{{ repairNum }}条</span><br />
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-button @click="selectAnalysis('spareRoom')" class="el-colDiv spare-room-btn">
                        <span class="title">空宿舍统计 </span><br />
                        <span class="digital">{{ spareRoomNum }}条</span><br />
                    </el-button>
                </el-col>
            </el-row>
        </div>

        <!-- 下部显示区域 -->
        <div style="display: flex; width: 100%; margin-top: 40px; align-items: center; justify-content: center;">
            <div :style="{ height: analysisHeight, width: '100%', marginBottom: '40px' }"> <!-- 动态高度 -->
                <span
                    style="font-size: 22px; display: block; margin-bottom: 10px; margin-left: 5px; font-weight: bold;">
                    {{ title }}
                </span>
                <component v-if="analysisOption" :is="analysisOption" />
                <div v-else style="text-align: center; color: #999;">请选择统计类型</div>
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import http from "@/utils/http";
import StuDataAnalysis from "@/components/StuDataAnalysis.vue";
import DormManaDataAnalysis from "@/components/DormManaDataAnalysis.vue"; // 宿管统计图表组件
import RepairDataAnalysis from "@/components/RepairDataAnalysis.vue"; // 报修统计图表组件
import SpareRoomDataAnalysis from "@/components/SpareRoomDataAnalysis.vue"; // 空宿舍统计图表组件
import { ElMessage } from 'element-plus';

const studentNum = ref("");
const dormManaNum = ref("");
const repairNum = ref("");
const spareRoomNum = ref("");
const title = ref("");
const analysisOption = ref("");
const analysisHeight = ref("588px"); // 默认高度

const getStuNum = async () => {
    try {
        const res = await http.get("/student/get-student-count");  // 从后端请求学生人数
        if (res.code === 0) {
            studentNum.value = res.data;
        } else {
            ElMessage.error(res.message);
        }
    } catch (error) {
        ElMessage.error("请求失败，请稍后重试");
    }
};

const getDormManaNum = async () => {
    try {
        const res = await http.get("/manager/get-manager-count");  // 从后端请求宿管人数
        if (res.code === 0) {
            dormManaNum.value = res.data;
        } else {
            ElMessage.error(res.message);
        }
    } catch (error) {
        ElMessage.error("请求失败，请稍后重试");
    }
};

const getRepairNum = async () => {
    try {
        const res = await http.get("/repair/get-repair-count");  // 从后端请求报修数量
        if (res.code === 0) {
            repairNum.value = res.data;
        } else {
            ElMessage.error(res.message);
        }
    } catch (error) {
        ElMessage.error("请求失败，请稍后重试");
    }
};

const getspareRoomNum = async () => {
    try {
        const res = await http.get("/room/get-spare-room-count");  // 从后端请求空宿舍数量
        if (res.code === 0) {
            spareRoomNum.value = res.data;
        } else {
            ElMessage.error(res.message);
        }
    } catch (error) {
        ElMessage.error("请求失败，请稍后重试");
    }
};

const selectAnalysis = (type) => {
    switch (type) {
        case 'student':
            title.value = '公寓人数分布统计';
            analysisOption.value = StuDataAnalysis;
            analysisHeight.value = "600px"; // 学生统计时默认高度
            break;
        case 'dormManager':
            title.value = '宿管人数分布统计';
            analysisOption.value = DormManaDataAnalysis;
            analysisHeight.value = "588px"; // 宿管统计时默认高度
            break;
        case 'repair':
            title.value = '报修类型统计分析';
            analysisOption.value = RepairDataAnalysis;
            analysisHeight.value = "900px"; // 报修统计时增加高度
            break;
        case 'spareRoom':
            title.value = '空宿舍统计分析';
            analysisOption.value = SpareRoomDataAnalysis;
            analysisHeight.value = "800px"; // 空宿舍统计时增加高度
            break;
        default:
            analysisOption.value = '';
            analysisHeight.value = "100px"; // 默认高度
    }
};

onMounted(async () => {
    await getStuNum();
    await getDormManaNum();
    await getRepairNum();
    await getspareRoomNum();
});
</script>

<style scoped>
@import '../assets/css/table.css';

.wv-lt-refresh {
    display: none;
}

.topInfo {
    margin: 0 auto;
}

.el-colDiv {
    display: block;
    margin: 20px auto;
    max-width: 340px;
    min-width: 200px;
    overflow: hidden;
    height: 115px;
    border-radius: 5px;
    padding-left: 15px;
    padding-top: 15px;
    position: relative;
    transition: 0.6s;
}

/* 按钮的渐变色 */
.student-btn {
    background-image: linear-gradient(to left, #FF6347, #FF4500);
    /* 红色渐变 */
    color: white;
}

.dorm-manager-btn {
    background-image: linear-gradient(to left, #4682B4, #5F9EA0);
    /* 蓝色渐变 */
    color: white;
}

.repair-btn {
    background-image: linear-gradient(to left, #32CD32, #228B22);
    /* 绿色渐变 */
    color: white;
}

.spare-room-btn {
    background-image: linear-gradient(to left, #FFD700, #FF8C00);
    /* 金色渐变 */
    color: white;
}

.el-colDiv:hover {
    background-position: right;
}

.nowDiv {
    width: 38px;
    height: 19px;
    position: absolute;
    right: 5%;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
}

.digital {
    font-size: 25px;
    line-height: normal;
    margin-left: 2px;
}

.title {
    font-size: 23px;
    font-weight: bold;
    font-family: '';
}

.last-span {
    font-size: 13px;
}

#ssv1-main-text {
    background-color: #1398ff;
}

#ssv2-main-text {
    background-color: #2e4057;
}

#ssv3-main-text {
    background-color: #ffb400;
}

#ssv4-main-text {
    background-color: #008789;
}
</style>
