import http from "@/utils/http";

// 获取当前用户房间信息
export const getRoomInfo = (userId) => {
  // return http({
  //   url: `/room/getMyRoom/${userId}`,
  //   method: 'GET'
  // });

  return {
    data: {
      code: "0",
      msg: "sucess",
      info: {
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
    }
  };
};

// 获取当前用户房间人员学号
export const getRoomBedUserId = (userId) => {
  // return http({
  //     url: `room/getRoomBeduserId/${userId}`,
  //     method: 'GET',
  //     headers: {
  //         'Content-Type': 'application/json'
  //     }
  // });
  return {
    data: {
      code: "0",
      mes: 'success',
      info: {
        dormId: 13,
        roomId: 257,
        firstBed: 4,
        secondBed: 3,
        thirdBed: 2,
        fourthBed: 22373474
      }
    }
  }
};
