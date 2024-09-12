import http from "@/utils/http";

// 获取食堂相关api
export { getAllCafeterias, getCafeteria, getCountersOf, getCounter, getDishes } from './cafeteria';
//获取用户登录注册相关api
export { login, getUserActionInfo, refreshAccessToken, register, logout, deleteAccount, updateUserAvatar, updateUserInfo, updateUserPassword } from './user';

// 主评
export const doComment = ({ data }) => {
    return http({
        url: 'comment/main',
        method: 'POST',
        data: data
    })
}

// 回复主评
export const doReplyComment = ({ data }) => {
    return http({
        url: 'comment/reply',
        method: 'POST',
        data: data
    })
}

// 用户收藏帖子
export const doCollectDish = ({ id }) => {
    return http({
        url: 'user/collect-post',
        method: 'POST',
        data: {
            'post_id': id
        }
    })
}

// 用户收藏的柜台
export const doCollectCounter = ({ id }) => {
    return http({
        url: 'user/collect-counter',
        method: 'POST',
        data: { id }
    })
}

// 用户收藏的食堂
export const doCollectCafeteria = ({ id }) => {
    return http({
        url: 'user/collect-cafeteria',
        method: 'POST',
        data: { id }
    })
}

//用户取消收藏帖子
export const cancelCollectDish = ({ id }) => {
    return http({
        url: 'user/uncollect-post',
        method: 'DELETE',
        data: {
            'post_id': id
        }
    })
}

//用户取消收藏的柜台
export const cancelCollectCounter = ({ id }) => {
    return http({
        url: 'user/uncollect-counter',
        method: 'DELETE',
        data: { id }
    })
}

//用户取消收藏的食堂
export const cancelCollectCafeteria = ({ id }) => {
    return http({
        url: 'user/uncollect-cafeteria',
        method: 'DELETE',
        data: { id }
    })
}

//用户吃过菜品
export const doAte = ({ id }) => {
    return http({
        url: 'user/ate',
        method: 'POST',
        data: {
            'post_id': id
        }
    })
}

//用户取消吃过菜品
export const cancelAte = ({ id }) => {
    return http({
        url: 'user/no-ate',
        method: 'DELETE',
        data: {
            'post_id': id
        }
    })
}

export const getComment = ({ id, offset }) => {
    return http({
        url: '/comment/get-main',
        method: 'POST',
        data: {
            'id': id,
            'offset': offset
        }
    })
}

export const loadReplies = ({ id, offset }) => {
    return http({
        url: '/comment/get-reply',
        method: 'POST',
        data: {
            'id': id,
            'offset': offset
        }
    })
}

// 帖子详情
export const postDetail = ({ id }) => {
    return http({
        url: '/post/detail',
        method: 'GET',
        params: {
            id: id
        }
    })
}

export const queryPost = ({ offset }) => {
    return http({
        url: '/post/recommend',
        method: 'GET',
        params: { offset }
    });
};

export const queryPostBySearch = ({ offset, query }) => {
    return http({
        url: '/post/search',
        method: 'GET',
        params: { offset, query }
    });
};

export const controlUserCollectOrLike = ({ post_id, operator, type }) => {
    return http({
        url: '/post/control/',
        method: 'POST',
        data: {
            post_id,
            type,
            operator
        }
    })
}


//查询用户收藏或吃过
export const queryUserPost = ({user_id, types, offset}) => {
    if (types === '收藏的菜肴') {
        return http({
            url: '/user/get-collect-dishes-list',
            method: 'GET',
            params: {
                offset
            }
        })
    } else if (types === '收藏的柜台') {
        return http({
            url: '/user/get-collect-counters-list',
            method: 'GET',
            params: {
                offset
            }
        })
    } else if (types === '收藏的食堂') {
        return http({
            url: '/user/get-collect-cafeterias-list',
            method: 'GET',
            params: {
                offset
            }
        })
    } else if (types === '吃过') {
        return http({
            url: '/user/get-ate-list',
            method: 'GET',
            params: {
                offset
            }
        })
    } else if (types === '我的帖子') {
        return http({
            url: '/user/get-post-list',
            method: 'GET',
            params: {
                offset
            }
        })
    }
}

export const uploadPost = (data) => {
    return http({
        url: 'post/upload/info',
        method: 'POST',
        data: {
            'counter_id': data.counter_id,
            'dish_name': data.dish_name,
            'dish_price': data.dish_price,
            'post_title': data.title,
            'post_content': data.content,
        }
    })
}

export const postDelete = ({ id }) => {
    return http({
        url: 'post/delete',
        method: 'POST',
        data: {
            id
        }
    })
}