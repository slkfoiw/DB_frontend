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
                    {id: 1, studentId: 22373474, name: "樊孜昱", curDormId: 13, curRoomId: 257, curBedId: 4, toDormId: 13, toRoomId: 256, toBedId: 3, createDate: "2021-07-01 12:00:00", status: "未处理", finishDate: "2021-07-02 12:00:00"},
                    {id: 2, studentId: 22373473, name: "辛卓妍", curDormId: 13, curRoomId: 256, curBedId: 2, toDormId: 13, toRoomId: 257, toBedId: 4, createDate: "2021-07-01 12:00:00", status: "驳回", finishDate: "2021-07-02 12:00:00"},
                    {id: 3, studentId: 22373472, name: "李梦婷", curDormId: 13, curRoomId: 256, curBedId: 3, toDormId: 13, toRoomId: 257, toBedId: 4, createDate: "2021-07-01 12:00:00", status: "通过", finishDate: "2021-07-02 12:00:00"},           
                ],
                total: 3,
                }
    }
    // records包括id studentId name curRoomId curBedId targetRoomId toBedId createDate state finishDate
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

