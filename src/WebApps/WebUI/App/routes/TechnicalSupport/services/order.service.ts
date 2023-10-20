import { client } from '$lib/utils/axiosClient';

const URL = 'TechnicalSupport/Order'

export const orderService = {
    get() {
        return client.get(URL).then(response => {
            return response.data;
        })
    }
}