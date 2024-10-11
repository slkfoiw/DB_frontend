<template>
    <el-card>
        <!-- 头部数据 -->
        <div>
            <el-row :gutter="20" class="topInfo">
                <el-col :span="6">
                    <el-button @click="selectAnalysis('student')" class="el-colDiv">
                        <span class="title">学生统计</span><br />
                        <span class="digital">{{ studentNum }}人</span><br />
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-button @click="selectAnalysis('dormManager')" class="el-colDiv">
                        <span class="title">宿管统计</span><br />
                        <span class="digital">{{ dormManaNum }}人</span><br />
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-button @click="selectAnalysis('repair')" class="el-colDiv">
                        <span class="title">报修统计</span><br />
                        <span class="digital">{{ repairNum }}条</span><br />
                    </el-button>
                </el-col>
                <el-col :span="6">
                    <el-button @click="selectAnalysis('notice')" class="el-colDiv">
                        <span class="title">公告统计</span><br />
                        <span class="digital">{{ noticeNum }}条</span><br />
                    </el-button>
                </el-col>
            </el-row>
        </div>

        <!-- 下部显示区域 -->
        <div style="display: flex; width: 100%; margin-top: 40px; align-items: center; justify-content: center;">
            <div style="height: 588px">
                <span style="font-size: 22px; display: block; margin-bottom: 30px; margin-left: 10px;">
                    {{ title }}
                </span>
                <component :is="analysisOption" />
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
import NoticeDataAnalysis from "@/components/NoticeDataAnalysis.vue"; // 公告统计图表组件
import { ElMessage } from 'element-plus';

const studentNum = ref("");
const dormManaNum = ref("");
const repairNum = ref("");
const noticeNum = ref("");
const title = ref("");
const analysisOption = ref("");

const getStuNum = async () => {
    // const res = await http.get("/stu/stuNum");
    const res = {
        succuss: true,
        data: 12,
    }
    if (res.succuss) {
        studentNum.value = res.data;
    } else {
        ElMessage.error(res.message);
    }
};

const getDormManaNum = async () => {
    // const res = await http.get("/dormMana/get-dorm-mana-num");
    const res = {
        succuss: true,
        data: 12,
    }
    if (res.succuss) {
        dormManaNum.value = res.data;
    } else {
        ElMessage.error(res.message);
    }
};

const getRepairNum = async () => {
    // const res = await http.get("/repair/get-repair-num");
    const res = {
        succuss: true,
        data: 20,
    }
    if (res.succuss) {
        repairNum.value = res.data;
    } else {
        ElMessage.error(res.message);
    }
};

const getNoticeNum = async () => {
    // const res = await http.get("/notice/get-notice-num");
    const res = {
        succuss: true,
        data: 22,
    }
    if (res.succuss) {
        noticeNum.value = res.data;
    } else {
        ElMessage.error(res.message);
    }
};

const selectAnalysis = (type) => {
    // 根据不同类型选择对应的图标
    switch (type) {
        case 'student':
            title.value = '公寓人数分布统计';
            analysisOption.value = StuDataAnalysis;
            break;
        case 'dormManager':
            title.value = '宿管人数分布统计';
            analysisOption.value = DormManaDataAnalysis;
            break;
        case 'repair':
            title.value = '报修类型统计分析';
            analysisOption.value = RepairDataAnalysis;
            break;
        case 'notice':
            title.value = '公告类型统计分析';
            analysisOption.value = NoticeDataAnalysis;
            break;
        default:
            analysisOption.value = '';
    }
};

onMounted(() => {
    getStuNum();
    getDormManaNum();
    getRepairNum();
    getNoticeNum();
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
    background-color: black;
    color: white;
    padding-left: 15px;
    padding-top: 15px;
    position: relative;
    background-image: linear-gradient(to left, #FFC312, #EE5A24, #FFC312);
    background-size: 200%;
    transition: 0.6s;
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
    font-size: 18px;
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