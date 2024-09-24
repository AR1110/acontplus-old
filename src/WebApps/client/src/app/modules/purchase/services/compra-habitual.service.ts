import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { PURCHASE_PATHS } from '@purchase/constants/purchase.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { map } from 'rxjs';
import { CompraHabitual } from '@purchase/models/compra-habitual.model';

@Injectable({
  providedIn: 'root',
})
export class CompraHabitualService {
  #url = `${PATHS_API.PURCHASE}${PURCHASE_PATHS.COMPRA_HABITUAL}`;
  #http = inject(HttpClient);

  delete(id: number) {
    return this.#http
      .delete<ApiResponse>(`${this.#url}${id}`)
      .pipe(map((response) => response));
  }

  get<T>(params: T) {
    return this.#http
      .get<ApiResponse>(`${this.#url}?json=${JSON.stringify(params)}`)
      .pipe(
        map((response) => {
          if (response.code !== '1') {
            return { comprasHabituales: [] };
          }

          return {
            comprasHabituales:
              (JSON.parse(response.payload as string) as CompraHabitual[]) ||
              [],
          };
        }),
      );
  }

  post<T>(data: T) {
    return this.#http
      .post<ApiResponse>(`${this.#url}`, data)
      .pipe(map((response) => response));
  }
}
