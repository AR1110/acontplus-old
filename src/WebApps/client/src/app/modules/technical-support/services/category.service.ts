import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { map } from 'rxjs';
import { TECH_SUPPORT_PATHS } from '../constants/tech-support.constants';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.TECHSUPPORT}${TECH_SUPPORT_PATHS.CATEGORY}`;
  delete(id: number) {
    return this.http.delete(`${this.url}${id}`).pipe(map((response) => response));
  }
  get<T>(parameters: T) {
    return this.http
      .get<ApiResponse>(`${this.url}?json=${JSON.stringify(parameters)}`)
      .pipe(map((response) => response));
  }
  post(data: any) {
    return this.http.post(`${this.url}`, data).pipe(map((response) => response));
  }
  put(id: number, data: any) {
    return this.http.put(`${this.url}${id}`, data).pipe(map((response) => response));
  }
}
