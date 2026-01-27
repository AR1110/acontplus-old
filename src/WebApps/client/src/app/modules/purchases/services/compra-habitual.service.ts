import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { PURCHASE_PATHS } from '@purchases/purchases.const';
import { CompraHabitual } from '@purchases/data/models/compra-habitual.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompraHabitualService {
  #url = `${PATHS_API.PURCHASE}${PURCHASE_PATHS.COMPRA_HABITUAL}`;
  #http = inject(HttpClient);

  delete<T>(obj: T) {
    const json = JSON.stringify(obj);
    return this.#http.delete<ApiResponseLegacy>(`${this.#url}Delete?json=${json}`);
  }

  get<T>(params: T) {
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}Get?json=${JSON.stringify(params)}` )
      .pipe(
        map((response) => {
          if (response.code !== '1') {
            return { comprasHabituales: [] };
          }

          return {
            comprasHabituales: (JSON.parse(response.payload as string) as CompraHabitual[]) || [],
          };
        }),
      );
  }

  post<T>(data: T) {
    return this.#http.post<ApiResponseLegacy>(`${this.#url}`, data);
  }
}
