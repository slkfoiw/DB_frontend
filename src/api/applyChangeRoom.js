import http from '@/utils/http';
import { info } from 'sass';

// 检查房间状态
export const checkRoomState = (dormId, roomId) => {
    // return http({
    //     url: `room/checkRoomState/${dormId}/${roomId}`,
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // });
    return {
            data: {
                code: "0",
                msg: 'success',
            }
    }
};

// 检查房间是否存在
export const checkRoomExist = (dormId, roomId) => {
    // return http({
    //     url: `room/checkRoomExist/${dormId}/${roomId}`,
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // });
    return {
            data: {
                code: "0",
                msg: 'success',
            }
    }
};

// 检查床位状态
export const checkBedState = (dormId, roomId, bedId) => {
    // return http({
    //     url: `room/checkBedState/${dormId}/${roomId}/${bedId}`,
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // });
    return {
            data: {
                code: "0",
                msg: 'success',
            }
    }
};

// 获取调整房间数据
export const fetchAdjustRoomData = (params) => {
    // return http({
    //     url: '/adjustRoom/find',
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     params: {
    //         pageNum: params.pageNum,
    //         pageSize: params.pageSize,
    //         search: params.search
    //        }
    // });
    // params 包括：pageNum, pageSize, search
    return {
            data:{
                records: [
                    {index: 1, userId: 22373474, name: "樊孜昱", currentDormId: 13, currentRoomId: 257, currentBedId: 4, towardsDormId: 13, towardsRoomId: 256, towardsBedId: 3, applyTime: "2021-07-01 12:00:00", state: "未处理", finishTime: "2021-07-02 12:00:00"},
                    {index: 2, userId: 22373473, name: "辛卓妍", currentDormId: 13, currentRoomId: 256, currentBedId: 2, towardsDormId: 13, towardsRoomId: 257, towardsBedId: 4, applyTime: "2021-07-01 12:00:00", state: "驳回", finishTime: "2021-07-02 12:00:00"},
                    {index: 3, userId: 22373472, name: "李梦婷", currentDormId: 13, currentRoomId: 256, currentBedId: 3, towardsDormId: 13, towardsRoomId: 257, towardsBedId: 4, applyTime: "2021-07-01 12:00:00", state: "通过", finishTime: "2021-07-02 12:00:00"},           
                ],
                total: 3,
                }
    }
    // records包括index userId name currentRoomId currentBedId targetRoomId towardsBedId applyTime state finishTime
};

// 更新调整房间信息
export const updateAdjustRoom = (orderState, data) => {
    // return http({
    //     url: `adjustRoom/update/${orderState}`,
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: data
    // });
    return {
        data: {
            code: "0",
            msg: 'success'
        }
    }
};

// 添加调整房间信息
export const addAdjustRoom = (data) => {
    // return http({
    //     url: 'adjustRoom/add',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: data
    // });
    return {
        data: {
            code: "0",
            msg: 'success'
        }
    }
};

