type ApiResponseCode = "0" | "1";
export interface ApiResponse {
  code: ApiResponseCode;
  message: string;
  payload: any;
  title?: string;
}

// export interface AxiosResponse {
//   data: any
//   status: number;
//   statusText: string;

// }
