import http from "@/utils/http";

const mockStudents = [
    { studentId: '22371001', stuName: '张三', apartmentNumber: '11', dormitoryNumber: '101', major: '计算机科学' },
    { studentId: '22371002', stuName: '李四', apartmentNumber: '11', dormitoryNumber: '102', major: '软件工程' },
    { studentId: '22371003', stuName: '王五', apartmentNumber: '11', dormitoryNumber: '201', major: '信息管理' },
    { studentId: '22371004', stuName: '赵六', apartmentNumber: '11', dormitoryNumber: '202', major: '网络工程' },
    { studentId: '22371005', stuName: '孙七', apartmentNumber: '11', dormitoryNumber: '301', major: '人工智能' },
    { studentId: '22371006', stuName: '周八', apartmentNumber: '11', dormitoryNumber: '302', major: '大数据' },
    { studentId: '22371007', stuName: '吴九', apartmentNumber: '11', dormitoryNumber: '401', major: '云计算' },
    { studentId: '22371008', stuName: '郑十', apartmentNumber: '11', dormitoryNumber: '402', major: '数据科学' },
    { studentId: '22371009', stuName: '钱十一', apartmentNumber: '13', dormitoryNumber: '501', major: '信息安全' },
    { studentId: '22371010', stuName: '李十二', apartmentNumber: '13', dormitoryNumber: '502', major: '系统工程' },
    { studentId: '22371011', stuName: '孙十三', apartmentNumber: '13', dormitoryNumber: '601', major: '软件测试' },
    { studentId: '22371012', stuName: '周十四', apartmentNumber: '13', dormitoryNumber: '602', major: '软件开发' },
  ];

export const getStudents = () => {
    // return http({
    //     url: 'student/get-students',
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // })
    return {
        data: mockStudents
    };
};

export const addStudent = (student) => {
    // return http({
    //     url: 'student/add-student',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: student
    // })
    mockStudents.push(student); // 模拟添加
    return { success: true };
};

export const updateStudent = (student) => {
    // return http({
    //     url: `student/update-student/${student.studentId}`,
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: student
    // })
    const index = mockStudents.findIndex(s => s.studentId === student.studentId);
    if (index !== -1) {
        mockStudents[index] = student; // 模拟更新
    }
    return { success: true };
};

export const deleteStudent = (studentId) => {
    // return http({
    //     url: `student/delete-student/${studentId}`,
    //     method: 'DELETE'
    // })
    const index = mockStudents.findIndex(s => s.studentId === studentId);
    if (index !== -1) {
        mockStudents.splice(index, 1); // 模拟删除
    }
    return { success: true };
};
