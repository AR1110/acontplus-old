import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SECURITY_API } from '../../constants/constants';
import { map } from 'rxjs';
import { ApiResponse } from 'acontplus-utils';
import {LicenseAccessMapper} from "@modules/seguridad/data/license-access/license-access.mapper";

@Injectable({
  providedIn: 'root',
})
export class LicenseAccessService {
  private http = inject(HttpClient);
  private url = `${SECURITY_API.LICENCIA_ACCESO}`;

  getDataForm() {
    const json = JSON.stringify({
      tipo: 2,
    });
    return this.http.get<ApiResponse>(`${this.url}?json=${json}`).pipe(
      map((response) => {
        const { licenses, roles } = JSON.parse(response.payload as string);


        return {
          licenses: licenses.map((item:any)=>({
            code: item.code,
            licenseType: item.licenseType,
            id: item.id
          })),
          roles: roles.map((item:any)=>({
            id: item.id,
            name: item.name,
            code: item.code,
          })),
        };
      }),
    );
  }

  delete(id: number) {
    return this.http
      .delete<ApiResponse>(`${this.url}${id}`)
      .pipe(map((response) => response));
  }

  list(params:any){
    const json = LicenseAccessMapper.toJson(params);
    return this.http
      .get<ApiResponse>(`${this.url}?json=${json}`)
      .pipe(map((response) => LicenseAccessMapper.fromJson(response)));
  }

  get<T>(params: T) {
    return this.http
      .get<ApiResponse>(`${this.url}?json=${JSON.stringify(params)}`)
      .pipe(map((response) => response));
  }

  post<T>(data: T) {
    return this.http
      .post<ApiResponse>(`${this.url}`, data)
      .pipe(map((response) => response));
  }

  put(id: number, data: any) {
    return this.http
      .put<ApiResponse>(`${this.url}${id}`, data)
      .pipe(map((response) => response));
  }
}
