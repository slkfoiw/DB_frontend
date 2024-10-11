import http from "@/utils/http";

let mockStudents = [
    { studentId: '22371001', stuName: '张三', dormitoryNumber: '11', roomNumber: '101', major: '计算机科学' },
    { studentId: '22371002', stuName: '李四', dormitoryNumber: '11', roomNumber: '102', major: '软件工程' },
    { studentId: '22371003', stuName: '王五', dormitoryNumber: '11', roomNumber: '201', major: '信息管理' },
    { studentId: '22371004', stuName: '赵六', dormitoryNumber: '11', roomNumber: '202', major: '网络工程' },
    { studentId: '22371005', stuName: '孙七', dormitoryNumber: '11', roomNumber: '301', major: '人工智能' },
    { studentId: '22371006', stuName: '周八', dormitoryNumber: '11', roomNumber: '302', major: '大数据' },
    { studentId: '22371007', stuName: '吴九', dormitoryNumber: '11', roomNumber: '401', major: '云计算' },
    { studentId: '22371008', stuName: '郑十', dormitoryNumber: '11', roomNumber: '402', major: '数据科学' },
    { studentId: '22371009', stuName: '钱十一', dormitoryNumber: '13', roomNumber: '501', major: '信息安全' },
    { studentId: '22371010', stuName: '李十二', dormitoryNumber: '13', roomNumber: '502', major: '系统工程' },
    { studentId: '22371011', stuName: '孙十三', dormitoryNumber: '13', roomNumber: '601', major: '软件测试' },
    { studentId: '22371012', stuName: '周十四', dormitoryNumber: '13', roomNumber: '602', major: '软件开发' },
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
        data: [...mockStudents]
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
    return { 
        success: true,
        mesage: '添加成功' 
    };
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
    return { 
        success: true,
        message: '编辑成功'
    };
};

export const updateAllStudents = (data) => {
    // return http({
    //     url: `student/update-all-students`,
    //     method: 'PUT',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: data
    // })
    mockStudents = data;
    return { 
        success: true,
        message: '更新成功'
    };
}

export const deleteStudent = (studentId) => {
    // return http({
    //     url: `student/delete-student/${studentId}`,
    //     method: 'DELETE'
    // })
    const index = mockStudents.findIndex(s => s.studentId === studentId);
    if (index !== -1) {
        mockStudents.splice(index, 1); // 模拟删除
    }
    return { 
        success: true,
        message: '删除成功'
    };
};

export const checkIfIdExists = (stuentId) => {
    // return http({
    //     url: `dormManager/check-if-id-exits/${managerId}`,
    //     method: 'GET'
    // })
    return mockStudents.some(m => m.studentId === stuentId);
}
