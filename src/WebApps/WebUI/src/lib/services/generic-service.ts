import { client } from "../../lib/utils/axiosClient.js";

export const getApi = async (url: string, data: any): Promise<any> => {
    return await client.get(`${url}`, { data }).then((response) => {
        return response
    }).catch((error) => {
        console.log(error)
        return {
            status: error.status,
            data: error.response
        }
    })
}
export const postApi = async (url: string, data: any): Promise<any> => {
    return await client.post(`${url}`, data).then((response) => {
        return response
    }).catch((error) => {
        console.log(error)
        return {
            status: error.status,
            data: error.response
        }
    })
}

export const putApi = async (url: string, data: any): Promise<any> => {
    return await client.put(`${url}`, data).then((response) => {
        return response
    }).catch((error) => {
        console.log(error)
        return {
            status: error.status,
            data: error.response
        }
    })
}

export const deleteApi = async (url: string): Promise<any> => {
    return await client.delete(`${url}`).then((response) => {
        return response
    }).catch((error) => {
        console.log(error)
        return {
            status: error.status,
            data: error.response
        }
    })
}