import { client } from "$utils/axiosClient.js";
let url = "Restaurant/Item/";

async function get(json: string, cancelToken?: any) {
  // .get(url + "?json=" + json, { cancelToken: cancelToken })
  return await client.get(url + "?json=" + json, { cancelToken: cancelToken }).then(
    (res) => {
      if (res.status != 200) return null;
      return res.data;
    },
    (err) => {
      return null;
    }
  );
}

async function post(data: any) {
  return await client.post(url, data).then(
    (res) => {
      let { status, data } = res;
      return { status, data };
    },
    (err) => {
      let { status, data } = err.response;
      return { status, data };
    }
  );
}

async function put(id: number, data: any) {
  return await client.put(url + id, data).then(
    (res) => {
      let { status, data } = res;
      return { status, data };
    },
    (err) => {
      let { status, data } = err.response;
      return { status, data };
    }
  );
}

async function remove(id: number) {
  return await client.delete(url + id).then(
    (res) => {
      let { status, data } = res;
      return { status, data };
    },
    (err) => {
      let { status, data } = err.response;
      return { status, data };
    }
  );
}

export const itemService = {
  get,
  post,
  put,
  remove,
};
