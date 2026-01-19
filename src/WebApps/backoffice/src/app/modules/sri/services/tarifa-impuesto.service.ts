import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SRI_PATHS_API } from '@modules/sri/constants/constants';
import { map } from 'rxjs';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class TarifaImpuestoService {
  private http = inject(HttpClient);
  private url = `${SRI_PATHS_API.TARIFA_IMPUESTO}`;

  get<T>(params: T) {
    return this.http
      .get<ApiResponse>(`${this.url}?json=${JSON.stringify(params)}`)
      .pipe(map((response) => response));
  }

  delete(id: number) {
    return this.http
      .delete(`${this.url}${id}`)
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
