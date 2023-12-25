import { client } from "$utils/axiosClient.js";
const url = "FactElect/Factura/";

async function get(params) {
  return await client.get(`${url}Get?json=${params}`).then(
    (response) => {
      if (response.status != 200) return null;
      return response.data;
    },
    (err) => {
      console.log(err);
      return null;
    }
  );
}

async function post(data) {
  return await client.post(`${url}Insert`, data).then(
    (responseAxios) => {
      if (responseAxios.status == 200)
        return {
          code: responseAxios.data.code,
          message: responseAxios.data.message,
        };
      else return { code: 0, message: responseAxios.status };
    },
    (err) => {
      return { code: 0, message: err.status };
    }
  );
}

async function put(id, data) {
  return await client.put(url + id, data).then(
    (responseAxios) => {
      if (responseAxios.status == 200)
        return {
          code: responseAxios.data.code,
          message: responseAxios.data.message,
        };
      else return { code: 0, message: responseAxios.status };
    },
    (err) => {
      return { code: 0, message: err.status };
    }
  );
}

export const FacturaService = {
  get,
  post,
  put,
};
