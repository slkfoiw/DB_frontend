import http from "@/utils/http";

// 登录
export const login = ({username, password}) => {
    return http({
        url: 'user/login/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            username,
            password
        }
    })
}

// 获取用户个人信息
export const getUserInfo = () => {
    // return http({
    //     url: 'user/getUserInfo',
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    // })
    return {
        data: userInfo
    }
}

export const refreshAccessToken = (refreshToken) => {
  return http.post('/user/refresh-token', {}, {
    headers: {
      Authorization: `Bearer ` + refreshToken.refreshToken,
    }
  });
};


// 注册
export const register = ({username, userId, name, password, email}) => {
    return http({
        url: 'user/register/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            username,
            userId,
            name,
            password,
            email
        }
    })
}

// 检测学工号是否已经被注册 或 学工号与姓名是否匹配
export const checkuserIdandName = ({userId, name}) => {
    return http({
        url: 'user/register/checkIdIsOnly/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            userId: userId,
            name: name
        }
    })
}

//登出
export const logout = () => {
    return http({
        url: 'user/logout/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    });
};

//注销账号
export const deleteAccount = ({}) => {
    return http({
        url: 'user/delete/',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
}

//更新用户信息（文本）
export const updateUserInfo = ({email, gender, introduction}) => {
    return http({
        url: '/user/change-info',
        method: 'PUT',
        data: {
            email: email,
            gender: gender,
            introduction: introduction,
        }
    });
}

//更新用户密码
export const updateUserPassword = ({oldPassword, newPassword}) => {
    return http({
        url: '/user/change-password',
        method: 'POST',
        data: {
            old_password: oldPassword,
            new_password: newPassword
        }
    })
}