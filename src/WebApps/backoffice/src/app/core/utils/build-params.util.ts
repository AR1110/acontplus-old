import { HttpParams } from "@angular/common/http";



export function buildParams(params?: any): HttpParams {
  let httpParams = new HttpParams();
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });
  }
  return httpParams;
}
