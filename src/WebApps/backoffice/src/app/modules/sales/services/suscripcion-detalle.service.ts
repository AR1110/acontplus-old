import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SALES_PATH } from '../constants/sales-paths';
import { map } from 'rxjs';
import { ApiResponse } from 'acontplus-utils';

@Injectable({
  providedIn: 'root',
})
export class SuscripcionDetalleService {
  private http = inject(HttpClient);
  private url = SALES_PATH.SUBSCRIPTION_DETAIL;

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
}
