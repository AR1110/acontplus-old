import { client } from '@/lib/utils/axiosClient';

const URL = 'TechnicalSupport/Device/'

export const deviceService = {
    post(data) {
        return client.post(URL, data).then(response => {
            return response.data;
        })
    },
    put(id: number, data) {
        return client.put(`${URL}${id}`, data);
    }
}