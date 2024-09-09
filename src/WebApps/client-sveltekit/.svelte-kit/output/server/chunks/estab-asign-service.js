import toastr from "toastr";
import { c as client } from "./axiosClient.js";
function toast({
  type,
  message,
  title = null,
  positionClass = null,
  timeOut = null,
  extendedTimeOut = null
}) {
  return toastr[type](message, title, {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: positionClass || "toast-bottom-center",
    preventDuplicates: true,
    timeOut: timeOut || 5e3,
    extendedTimeOut: extendedTimeOut || 1e3
  });
}
const url$1 = "Restaurant/ProductionAreas/";
async function get$1() {
  return await client.get(url$1).then((response) => {
    if (response.status != 200)
      return null;
    return response.data;
  }, (err) => {
    console.log(err);
    return null;
  });
}
async function post(data) {
  return await client.post(url$1, data).then((response) => {
    let { status, data: data2 } = response;
    return { status, data: data2 };
  }, (err) => {
    let { status, data: data2 } = err.response;
    return { status, data: data2 };
  });
}
async function put(id, data) {
  return await client.put(url$1 + id, data).then((response) => {
    let { status, data: data2 } = response;
    return { status, data: data2 };
  }, (err) => {
    let { status, data: data2 } = err.response;
    return { status, data: data2 };
  });
}
async function remove(id) {
  return await client.delete(url$1 + id).then((response) => {
    let { status, data } = response;
    return { status, data };
  }, (err) => {
    let { status, data } = err.response;
    return { status, data };
  });
}
const productionAreaService = {
  get: get$1,
  post,
  put,
  remove
};
function showLoader() {
  const div = "<div class='loading'><span class='spinner'></span></div>";
  const loaderCss = document.getElementById("loaderCss");
  if (loaderCss) {
    loaderCss.innerHTML = div;
    loaderCss.classList.add("positionLoading");
  }
}
function hideLoader() {
  const loading = document.querySelector(".loading");
  if (loading) {
    loading.remove();
  }
  const loaderCss = document.getElementById("loaderCss");
  if (loaderCss) {
    loaderCss.classList.remove("positionLoading");
  }
}
const url = "Config/EstabAsig/";
async function get(params) {
  return await client.get(`${url}?json=${params}`).then((response) => {
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  }).catch((err) => {
    console.log(err);
    return null;
  });
}
const estabAsignService = {
  get
};
export {
  estabAsignService as e,
  hideLoader as h,
  productionAreaService as p,
  showLoader as s,
  toast as t
};
