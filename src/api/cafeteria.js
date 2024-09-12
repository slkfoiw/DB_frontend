import http from "@/utils/http";

// 获取所有食堂的信息
export const getAllCafeterias = () => {
    return http({
        url: '/cafeteria/get-all-cafeterias',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

//获取某食堂的信息
export const getCafeteria = ({cafeteriaId}) => {
    return http({
        url: '/cafeteria/get-cafeteria',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            cafeteriaId: Number(cafeteriaId)
        }
    })
}

// 获取某食堂的全部柜台
export const getCountersOf = ({cafeteriaId}) => {
    return http({
        url: '/cafeteria/get-counters',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            cafeteriaId: Number(cafeteriaId)
        }
    })
}

// 获取某柜台的信息
export const getCounter = ({counterId}) => {
    return http({
        url: '/cafeteria/get-counter',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            counterId: Number(counterId)
        }
    })
}

//获取某柜台的全部菜肴
export const getDishes = ({counterId}) => {
    return http({
        url: '/cafeteria/counter/get-dishes',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            counterId: Number(counterId)
        }
    })
}

