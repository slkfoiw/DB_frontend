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
