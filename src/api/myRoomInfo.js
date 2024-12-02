import http from "@/utils/http";

// 获取当前用户房间信息
export const getRoomInfo = (userid) => {
  // return http({
  //   url: `/room/getMyRoom/${userid}`,
  //   method: 'GET'
  // });

  return {
    data: {
      code: "0",
      msg: "sucess",
      info: {
        dormRoomId: 257,
        dormBuildId: 13,
        floorNum: 2,
        maxCapacity: 4,
        currentCapacity: 4,
        firstBed: "name1",
        secondBed: "name2",
        thirdBed: "name3",
        fourthBed: "樊孜昱",
      },
    }
  };
};

// 获取当前用户房间人员学号
export const getRoomBedUserId = (userid) => {
  // return http({
  //     url: `room/getRoomBeduserId/${userid}`,
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
        dormBuildId: 13,
        dormRoomId: 257,
        firstBed: 4,
        secondBed: 3,
        thirdBed: 2,
        fourthBed: 22373474
      }
    }
  }
};
