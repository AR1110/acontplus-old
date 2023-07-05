export interface PayloadResponse {
  code: string;
  message: string;
  payload: any;
  title?: string;
}

// export interface AxiosResponse {
//   data: any
//   status: number;
//   statusText: string;

// }

export interface AxiosResponseApi {
  data: PayloadResponse | any;
  status: number;
  statusText: string;
}
