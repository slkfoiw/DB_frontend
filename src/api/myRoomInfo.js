import http from "@/utils/http";

// 获取当前用户房间信息
export const getRoomInfo = (studentId) => {
  console.log(studentId);
  return http({
    url: `/room/getMyRoom/${studentId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
  },
  });
};

// 获取当前用户房间人员学号
export const getRoomBedUserId = (studentId) => {
  return http({
      url: `/room/getRoomBedStudentId/${studentId}`,
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  });
};

// 获取指定公寓指定宿舍空床位编号
export const getEmptyBedId = ({dormId, roomId}) => {
  return http({
      url: `/room/getEmptyBedId/${dormId}/${roomId}`,
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  });
};