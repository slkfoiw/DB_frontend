import http from "@/utils/http";

// 获取当前用户房间信息
export const getRoomInfo = (studentId) => {
  // return http({
  //   url: `/room/getMyRoom/${studentId}`,
  //   method: 'GET'
  // });

  return {
    code: "0",
    msg: "sucess",
    data: {
      roomId: 257,
      dormId: 13,
      floor: 2,
      capacity: 4,
      peopleNum: 4,
      firstBed: "name1",
      secondBed: "name2",
      thirdBed: "name3",
      fourthBed: "樊孜昱",
    },
  };
};

// 获取当前用户房间人员学号
export const getRoomBedUserId = (studentId) => {
  // return http({
  //     url: `/room/getRoomBedStudentId/${studentId}`,
  //     method: 'GET',
  //     headers: {
  //         'Content-Type': 'application/json'
  //     }
  // });
  return {
      code: "0",
      msg: 'success',
      data: {
        dormId: 13,
        roomId: 257,
        firstBed: 4,
        secondBed: 3,
        thirdBed: 2,
        fourthBed: 22373474
      }
  }
};
