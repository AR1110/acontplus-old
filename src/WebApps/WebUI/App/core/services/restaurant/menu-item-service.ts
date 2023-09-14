import { client } from "$core/api/axiosClient.js";
let url = "Restaurant/MenuItem/";

async function getById(id: number) {
   return await client.get(`${url}GetById/${id}`).then((response: any) => {
      if(response.status != 200) return null;
      return response.data;
   }).catch((error) => {
      return null;
   })
}

export const MenuItemService = {
   getById,
}