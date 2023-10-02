import { client } from '$lib/utils/axiosClient';

const URL = 'TechSpec/'

export const techSpecService = {

    get: (obj: object) => {
        return client.get(`${URL}${JSON.stringify(obj)}`).then(response => {
            console.log(response)
        })
    },

    post: () => {

    },

    put: () => {

    },



}
