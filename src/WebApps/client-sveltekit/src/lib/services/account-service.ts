import { client } from '@/lib/utils/axiosClient.js';
let url = '/KjaiaAdmin/Courses/';

async function login() {
    return await client.get(url).then((response) => {
        if (response.status != 200) return null;
        return response.data;
    }, (err) => {
        return null;
    });
}


export const CourseService = {
    login, 
};
