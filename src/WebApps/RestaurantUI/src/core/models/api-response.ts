type ApiResponseCode = "0" | "1" | "2";
export interface ApiResponse {
  code: ApiResponseCode;
  message: string;
  payload: any;
  id?: string
  titleSms?: string;
}

// export interface AxiosResponse {
//   data: any
//   status: number;
//   statusText: string;

// }
