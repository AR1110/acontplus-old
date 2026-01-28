import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { CONFIG_PATHS } from '@modules/config/enums/config.enum';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class LicenciaDetalleService {
  private http = inject(HttpClient);
  private url = CONFIG_PATHS.LICENCIA_DETALLE;

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

  post<T>(data: T) {
    return this.http
      .post<ApiResponse>(`${this.url}`, data)
      .pipe(map((response) => response));
  }

  put<T>(id: number, data: T) {
    return this.http
      .put<ApiResponse>(`${this.url}${id}`, data)
      .pipe(map((response) => response));
  }
}
