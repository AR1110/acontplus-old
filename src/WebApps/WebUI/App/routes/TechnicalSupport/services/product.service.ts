import { client } from '$lib/utils/axiosClient';

const URL = 'TechnicalSupport/Product'

export const productService = {
    post(data) {
        return client.get(URL, data).then(response => {
            return response.data;
        })
    }
}