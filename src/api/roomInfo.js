import http from "@/utils/http";
import { checkIfIdExists } from "./student.js";

// 学生用学号表示床位
let mockRoomInfos = [
    { dormRoomId: '257', dormBuildId: '13', floorNum: '2', maxCapacity: '4', currentCapacity: '4', firstBed: "22371001", secondBed: "22371002", thirdBed: "22371003", fourthBed: "樊孜昱" },
    { dormRoomId: '258', dormBuildId: '13', floorNum: '2', maxCapacity: '4', currentCapacity: '4', firstBed: "22371004", secondBed: "22371005", thirdBed: "22371006", fourthBed: "name7" },
    { dormRoomId: '259', dormBuildId: '13', floorNum: '2', maxCapacity: '4', currentCapacity: '4', firstBed: "name8", secondBed: "name9", thirdBed: "name10", fourthBed: "name11" },
    { dormRoomId: '260', dormBuildId: '13', floorNum: '2', maxCapacity: '4', currentCapacity: '4', firstBed: "name12", secondBed: "name13", thirdBed: "name14", fourthBed: "name15" },
    { dormRoomId: '261', dormBuildId: '13', floorNum: '2', maxCapacity: '4', currentCapacity: '4', firstBed: "name16", secondBed: "name17", thirdBed: "name18", fourthBed: "name19" },
    { dormRoomId: '262', dormBuildId: '13', floorNum: '2', maxCapacity: '4', currentCapacity: '4', firstBed: "name20", secondBed: "name21", thirdBed: "name22", fourthBed: "name23" },
    { dormRoomId: '263', dormBuildId: '13', floorNum: '2', maxCapacity: '4', currentCapacity: '4', firstBed: "name24", secondBed: "name25", thirdBed: "name26", fourthBed: "name27" },
    { dormRoomId: '264', dormBuildId: '13', floorNum: '2', maxCapacity: '4', currentCapacity: '4', firstBed: "name28", secondBed: "name29", thirdBed: "name30", fourthBed: "name31" },
    { dormRoomId: '265', dormBuildId: '13', floorNum: '2', maxCapacity: '4', currentCapacity: '4', firstBed: "name32", secondBed: "name33", thirdBed: "name34", fourthBed: "name35" },
    { dormRoomId: '266', dormBuildId: '13', floorNum: '2', maxCapacity: '4', currentCapacity: '4', firstBed: "name36", secondBed: "name37", thirdBed: "name38", fourthBed: "name39" },
    { dormRoomId: '267', dormBuildId: '13', floorNum: '2', maxCapacity: '4', currentCapacity: '4', firstBed: "name40", secondBed: "name41", thirdBed: "name42", fourthBed: "name43" },
    { dormRoomId: '268', dormBuildId: '13', floorNum: '2', maxCapacity: '4', currentCapacity: '4', firstBed: "name44", secondBed: "name45", thirdBed: "name46", fourthBed: "name47" },
    { dormRoomId: '269', dormBuildId: '13', floorNum: '2', maxCapacity: '4', currentCapacity: '4', firstBed: "name48", secondBed: "name49", thirdBed: "name50", fourthBed: "name51" },
];

const checkStuNum = (rule, value) => {
    console.log("输入的学号:", value);
    console.log("是否存在:", checkIfIdExists(value));
    if (checkIfIdExists(value)) {
        return Promise.resolve();
    } else {
        return Promise.reject("学号不存在");
    }
};

export const rules = {
    dormRoomId: [
        {required: true, message: "请输入房间号", trigger: "blur"},
        {pattern: /^[0-9]{3}$/, message: "范围：100-999", trigger: "blur"},
    ],
    floorNum: [
        {required: true, message: "请输入楼层数", trigger: "blur"},
        {pattern: /^[1-3]$/, message: "范围：1-3", trigger: "blur"},
    ],
    dormBuildId: [
        {required: true, message: "请输入楼宇号数", trigger: "blur"},
        {pattern: /^[1-4]$/, message: "范围：1-4", trigger: "blur"},
    ],
    maxCapacity: [
        {required: true, message: "请输入房间可住人数", trigger: "blur"},
        {pattern: /^[0-4]$/, message: "范围：0-4", trigger: "blur"},
    ],
    currentCapacity: [
        {required: true, message: "请输入当前已住人数", trigger: "blur"},
        {pattern: /^[0-4]$/, message: "范围：0-4", trigger: "blur"},
    ],
    firstBed: [{validator: checkStuNum, trigger: "blur"}],
    secondBed: [{validator: checkStuNum, trigger: "blur"}],
    thirdBed: [{validator: checkStuNum, trigger: "blur"}],
    fourthBed: [{validator: checkStuNum, trigger: "blur"}],
};

export const getDormRooms = () => {
    // return http({
    //     url: 'roomInfo/get-room-info',
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    return {
        data: [...mockRoomInfos]
    };
};

export const addDormRoom = (roomInfo) => {
    // return http({
    //     url: 'roomInfo/add-room-info',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: roomInfo
    // })
    mockRoomInfos.push(roomInfo); // 模拟添加
    console.log(mockRoomInfos);
    return { 
        success: true,
        message: '添加成功'
    };
};

export const updateDormRoom = (roomInfo) => {
    // return http({
    //     url: `roomInfo/update-room-info/${roomInfo.dormRoomId}`,
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: roomInfo
    // })
    const index = mockRoomInfos.findIndex(r => r.dormRoomId === roomInfo.dormRoomId);
    if (index !== -1) {
        mockRoomInfos[index] = roomInfo; // 模拟更新
    }
    console.log(mockRoomInfos);
    return { 
        success: true,
        message: '编辑成功'
    };
};

export const updateAllRoomInfos = (data) => {
    // return http({
    //     url: `roomInfo/update-all-room-infos`,
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: data
    // })
    mockRoomInfos = data;
    return { 
        success: true,
        message: '更新成功'
    };
};

export const deleteDormRoom = (dormRoomId) => {
    // return http({
    //     url: `roomInfo/delete-room-info/${dormRoomId}`,
    //     method: 'DELETE'
    // })
    mockRoomInfos = mockRoomInfos.filter(r => r.dormRoomId !== dormRoomId); // 模拟删除
    console.log(mockRoomInfos);
    return { 
        success: true,
        message: '删除成功'
    };
};

export const updateBed = (data) => {
    return new Promise((resolve, reject) => {
        const index = mockRoomInfos.findIndex(r => r.dormRoomId === data.dormRoomId);
        if (index !== -1) {
            mockRoomInfos[index] = data; // 模拟更新
            console.log(mockRoomInfos);
            resolve({ 
                code: "0", // 模拟成功状态码
                message: '更新成功'
            });
        } else {
            reject({
                code: "1", // 模拟失败状态码
                message: '更新失败'
            });
        }
    });
}
