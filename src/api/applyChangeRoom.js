import http from '@/utils/http';

// 检查房间状态
export const checkRoomState = (roomId) => {
    // return http({
    //     url: `room/checkRoomState/${roomId}`,
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // });
    return {
            data: {
                code: "0",
                mes: 'success',
            }
    }
};

// 检查房间是否存在
export const checkRoomExist = (roomId) => {
    // return http({
    //     url: `room/checkRoomExist/${roomId}`,
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // });
    return {
            data: {
                code: "0",
                mes: 'success',
            }
    }
};

// 检查床位状态
export const checkBedState = (roomId, bedId) => {
    // return http({
    //     url: `room/checkBedState/${roomId}/${bedId}`,
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // });
    return {
            data: {
                code: "0",
                mes: 'success',
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
                    {index: 1, userId: 22373474, name: "樊孜昱", currentRoomId: 257, currentBedId: 4, towardsRoomId: 256, towardsBedId: 3, applyTime: "2021-07-01 12:00:00", state: "未处理", finishTime: "2021-07-02 12:00:00"},
                    {index: 2, userId: 22373473, name: "辛卓妍", currentRoomId: 256, currentBedId: 2, towardsRoomId: 257, towardsBedId: 4, applyTime: "2021-07-01 12:00:00", state: "驳回", finishTime: "2021-07-02 12:00:00"},
                    {index: 3, userId: 22373472, name: "李梦婷", currentRoomId: 256, currentBedId: 3, towardsRoomId: 257, towardsBedId: 4, applyTime: "2021-07-01 12:00:00", state: "通过", finishTime: "2021-07-02 12:00:00"},           
                ],
                total: 2,
                }
    }
    // records包括index userId name currentRoomId currentBedId targetRoomId towardsBedId applyTime state finishTime
};

// 获取当前用户的房间信息
export const getMyRoom = (username) => {
    // return http({
    //     url: `room/getMyRoom/${username}`,
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // });
    return {
            code: "0",
            mes: 'success',
            data: {
                dormRoomId: 257,
                firstBed: 4,
                secondBed: 3,
                thirdBed: 2,
                fourthBed: 22373474
            }
    }
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
            code: "0",
            mes: 'success'
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
            code: "0",
            mes: 'success'
    }
};

