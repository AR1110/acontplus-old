import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '@modules/common/constants/common.constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class ReleaseService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_ENDPOINTS.RELEASE}`;

  delete(id: number) {
    return this.http
      .delete<ApiResponse>(`${this.url}${id}`)
      .pipe(map((response) => response));
  }

  get<T>(parameters: T) {
    return this.http
      .get<ApiResponse>(`${this.url}?json=${JSON.stringify(parameters)}`)
      .pipe(map((response) => response));
  }

  post(data: any) {
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
