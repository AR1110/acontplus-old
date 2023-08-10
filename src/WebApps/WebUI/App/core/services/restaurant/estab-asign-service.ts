import { client } from "../../api/axiosClient";
let url = "Config/EstabAsig/";

async function get(params: any) {
   return await client.get(`${url}?json=${params}`).then((response) => {
       if (response.status === 200) {
           return response.data;
       } else {
           return null;
       }
   }).catch((err) => {
       return null;
   });
}

export const estabAsignService = {
    get
}