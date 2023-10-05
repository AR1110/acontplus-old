import { client } from '$lib/utils/axiosClient';

const URL = 'TechnicalSupport/Category'

export const categoryService = {
    get() {
        return client.get(URL).then(response => {
            return response.data;
        })
    }
}