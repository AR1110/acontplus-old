import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from 'acontplus-utils';
import {SECURITY_API} from "@modules/seguridad/constants/constants";

@Injectable({
  providedIn: 'root',
})
export class ScheduleCompanyService {
  private readonly _http = inject(HttpClient);
  private readonly _url = `${SECURITY_API.SCHEDULE_COMPANY}`;

  delete(id: number) {
    return this._http
      .delete(`${this._url}${id}`)
      .pipe(map((response) => response));
  }

  get<T>(params: T) {
    return this._http
      .get<ApiResponse>(`${this._url}?json=${JSON.stringify(params)}`)
      .pipe(map((response) => response));
  }

  getById(id: number) {
    return this._http
      .get<ApiResponse>(`${this._url}${id}`)
      .pipe(map((response) => response));
  }

  post<T>(data: T) {
    return this._http
      .post<ApiResponse>(`${this._url}`, { data })
      .pipe(map((response) => response));
  }

  put(id: number, data: any) {
    return this._http
      .put<ApiResponse>(`${this._url}${id}`, data)
      .pipe(map((response) => response));
  }
}
