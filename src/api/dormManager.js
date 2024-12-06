import http from "@/utils/http";

export const getDormManagers = ({pageNum, pageSize, search}) => {
    return http({
        url: '/manager/get-managers',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            pageNum,
            pageSize,
            search
        }
    })
};

export const addDormManager = (manager) => {
    return http({
        url: '/manager/add-dorm-manager',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: manager
    })
};

export const updateDormManager = ({oldManagerId, manager}) => {
    return http({
        url: `/manager/update-dorm-manager/${oldManagerId}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        data: manager
    })
};

export const updateAllDormManagers = (data) => {
    console.log('Calling updateAllDormManagers data:', data);
    return http({
        url: `/manager/update-all-dorm-managers`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    })
}

export const deleteDormManager = (managerId) => {
    return http({
        url: `/manager/delete-dorm-manager/${managerId}`,
        method: 'DELETE'
    })
};

export const checkIfIdExists = (managerId) => {
    return http({
        url: `/manager/check-if-id-exists/${managerId}`,
        method: 'GET'
    })
}