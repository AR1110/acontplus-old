import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getValidationError, SnackbarUtils } from "@/core/utils/";
import { ApiResponse, PublicRoutes } from "../models";
import { AuthService } from "@/core/services";
import { getRestaurantApiUrl } from "@/core/config/url.config";

const POSInstance = axios.create({
  baseURL: getRestaurantApiUrl(),
});

//   console.log("init Axios interceptor");
const updateHeader = (request: any) => {
  const token = "Bearer " + AuthService.getToken();
  const newHeaders = {
    Authorization: token,
    "Content-Type": "application/json",
  };
  request.headers = newHeaders;

  return request;
};

// Agrega el interceptor de solicitud a cada instancia de Axios
const addRequestInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (request) => {
      // Ignorar las solicitudes que contienen "assets" en la URL
      if (request.url?.includes("assets") || request.headers?.Authorization) {
        return request;
      }
      return updateHeader(request);
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );
};

// Agrega el interceptor de solicitud a cada instancia de Axios
const addResponseInterceptor = (instance: AxiosInstance) => {
  // Interceptor para las respuestas
  instance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
      return response;
    },
    (error) => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
      // const redirect = () => {
      //   window.location.href = `/${PublicRoutes.LOGIN}`;
      // };
      // //No esta logueado a la aplicacion
      // if (error.response.status === 401) {
      //   console.log(error);
      //   // redirect();
      // }

      // SnackbarUtils.error(getValidationError(error.code));
      return Promise.reject(error);
    }
  );
};

//Add Interceptor and response to POS
addRequestInterceptor(POSInstance);
addResponseInterceptor(POSInstance);

// const axios = <T>(cfg: AxiosRequestConfig): Promise<ApiResponse> =>
//   instance.request<any, T>(cfg);

const POSHttp = async (config: AxiosRequestConfig): Promise<ApiResponse> => {
  return POSInstance.request(config).then((response) => {
    return response.data;
  });
};

export { POSHttp };
