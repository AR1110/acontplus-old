import { client } from "@/lib/utils/axiosClient.js";
let url = "Restaurant/MenuItem/";

async function getById(id: number, data: object) {
  return await client
    .get(`${url}GetById/${id}?json=${JSON.stringify(data)}`)
    .then((response: any) => {
      if (response.status != 200) return null;
      return response.data;
    })
    .catch((error) => {
      return null;
    });
}

export const MenuItemService = {
  getById,
};
