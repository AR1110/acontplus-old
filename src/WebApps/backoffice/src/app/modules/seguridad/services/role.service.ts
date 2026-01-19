import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { SECURITY_API } from '@modules/seguridad/constants/constants';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpClient);
  private url = `${SECURITY_API.ROLE}`;

  delete(id: number) {
    return this.http
      .delete(`${this.url}${id}`)
      .pipe(map((response) => response));
  }
  get<T>(params: T) {
    return this.http
      .get<ApiResponse>(`${this.url}?json=${JSON.stringify(params)}`)
      .pipe(map((response) => response));
  }
  post<T>(data: T) {
    return this.http
      .post<ApiResponse>(`${this.url}`, data)
      .pipe(map((response) => response))
      .pipe(map((response) => response));
  }
  put(id: number, data: any) {
    return this.http
      .put<ApiResponse>(`${this.url}${id}`, data)
      .pipe(map((response) => response));
  }
}
