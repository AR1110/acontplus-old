import axios, { AxiosRequestConfig, AxiosResponse } from "axios"; 
import { getToken } from "@/core/services"; 

//const urlPrd = "https://gateway.acontplus.com/"
//const urlPrd = 'https://gateway.acontplus.xyz/'
const urlPrd = 'http://18.224.78.45:5001/'
//const urlDev = "https://localhost:7112/gateway/"
const urlLocal = "https://localhost:7060/"
const instance = axios.create({
  //baseURL: import.meta.env.DEV ? "https://localhost:7112/gateway/" : "https://acontplus.xyz/restaurantgateway/",
  baseURL: import.meta.env.DEV ? urlLocal : urlPrd,
});

//   console.log("init Axios interceptor");
const updateHeader = (request: any) => {
  const token = "Bearer " + getToken();
  
  const newHeaders = {
    Authorization: token,
    "Content-Type": "application/json",
  };
  request.headers = newHeaders;

  return request;
};

// Interceptor para las solicitudfr
instance.interceptors.request.use((request) => {
    // Ignorar las solicitudes que contienen "assets" en la URL
    if (request.url?.includes("assets") || request.headers?.Authorization) {
      return request;
    } 
    return updateHeader(request);
  }
);
 
 
  // Interceptor para las respuestas
instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
    }
    // const redirect = () => {
    //   window.location.href = `/${PublicRoutes.LOGIN}`;
    // };
    // //No esta logueado a la aplicacion
    // if (error.response.status === 401) {
    //   console.log(error);
    //   // redirect();
    // }

    console.log(error)    
    // SnackbarUtilities.error(getValidationError(error.code)!);
    // SnackbarUtility.error(error.message);
    return Promise.reject(error);
  }
);
  

// const axios = <T>(cfg: AxiosRequestConfig): Promise<ApiResponse> =>
//   instance.request<any, T>(cfg);

const Http = async (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  return instance.request(config).then((response) => { 
    return response;
  });
};

export { Http };
