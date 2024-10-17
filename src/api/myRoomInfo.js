import http from "@/utils/http";

export const getRoomInfo = (userId) => {
    // return http({
    //   url: `/room/getMyRoom/${userId}`,
    //   method: 'GET'
    // });
  
    return {
      code: "0",
      data: {
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
      msg: "Successfully fetched room info",
    };
  };
  
