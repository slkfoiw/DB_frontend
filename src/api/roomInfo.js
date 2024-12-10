import http from "@/utils/http";

// 学生用学号表示床位
let mockRoomInfos = [
    { roomId: '257', dormId: '13', floor: '2', capacity: '4', peopleNum: '4', firstBed: "22371001", secondBed: "22371002", thirdBed: "22371003", fourthBed: "樊孜昱" },
    { roomId: '258', dormId: '13', floor: '2', capacity: '4', peopleNum: '4', firstBed: "22371004", secondBed: "22371005", thirdBed: "22371006", fourthBed: "name7" },
    { roomId: '259', dormId: '13', floor: '2', capacity: '4', peopleNum: '4', firstBed: "name8", secondBed: "name9", thirdBed: "name10", fourthBed: "name11" },
    { roomId: '260', dormId: '13', floor: '2', capacity: '4', peopleNum: '4', firstBed: "name12", secondBed: "name13", thirdBed: "name14", fourthBed: "name15" },
    { roomId: '261', dormId: '13', floor: '2', capacity: '4', peopleNum: '4', firstBed: "name16", secondBed: "name17", thirdBed: "name18", fourthBed: "name19" },
    { roomId: '262', dormId: '13', floor: '2', capacity: '4', peopleNum: '4', firstBed: "name20", secondBed: "name21", thirdBed: "name22", fourthBed: "name23" },
    { roomId: '263', dormId: '13', floor: '2', capacity: '4', peopleNum: '4', firstBed: "name24", secondBed: "name25", thirdBed: "name26", fourthBed: "name27" },
    { roomId: '264', dormId: '13', floor: '2', capacity: '4', peopleNum: '4', firstBed: "name28", secondBed: "name29", thirdBed: "name30", fourthBed: "name31" },
    { roomId: '265', dormId: '13', floor: '2', capacity: '4', peopleNum: '4', firstBed: "name32", secondBed: "name33", thirdBed: "name34", fourthBed: "name35" },
    { roomId: '266', dormId: '13', floor: '2', capacity: '4', peopleNum: '4', firstBed: "name36", secondBed: "name37", thirdBed: "name38", fourthBed: "name39" },
    { roomId: '267', dormId: '13', floor: '2', capacity: '4', peopleNum: '4', firstBed: "name40", secondBed: "name41", thirdBed: "name42", fourthBed: "name43" },
    { roomId: '268', dormId: '13', floor: '2', capacity: '4', peopleNum: '4', firstBed: "name44", secondBed: "name45", thirdBed: "name46", fourthBed: "name47" },
    { roomId: '269', dormId: '13', floor: '2', capacity: '4', peopleNum: '4', firstBed: "name48", secondBed: "name49", thirdBed: "name50", fourthBed: "name51" },
];

export const getDormRooms = ({pageNum, pageSize, search, sortField, sortOrder}) => {
    return http({
        url: '/room/get-rooms',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            pageNum,
            pageSize,
            search,
            sortField,
            sortOrder
        }
    })
};

export const addDormRoom = (room) => {
    return http({
        url: '/room/add-room',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: room
    })
};

export const updateDormRoom = (room) => {
    return http({
        url: `/room/update-room`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        data: room
    })
};

export const updateAllRoomInfos = (data) => {
    return http({
        url: `/room/update-all-rooms`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
};

export const deleteDormRoom = ({dormId, roomId}) => {
    return http({
        url: `/room/delete-room/${dormId}/${roomId}`,
        method: 'DELETE'
    })
};

export const updateBed = ({dormId, roomId, bedId, studentId}) => {
    return http({
        url: `/room/update-bed/${dormId}/${roomId}/${bedId}/${studentId}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

export const deleteStuFromBed = ({dormId, roomId, bedId}) => {
    return http({
        url: `/room/delete-student-from-bed/${dormId}/${roomId}/${bedId}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
}