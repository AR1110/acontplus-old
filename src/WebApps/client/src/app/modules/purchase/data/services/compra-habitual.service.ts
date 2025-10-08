import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { ApiResponse } from '@core/models/api-response';
import { PURCHASE_PATHS } from '@purchase/domain/enums/purchase.constants';
import { CompraHabitual } from '@purchase/domain/compra-habitual.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompraHabitualService {
  #url = `${PATHS_API.PURCHASE}${PURCHASE_PATHS.COMPRA_HABITUAL}`;
  #http = inject(HttpClient);

  delete<T>(obj: T) {
    const json = JSON.stringify(obj);
    return this.#http.delete<ApiResponse>(`${this.#url}Delete?json=${json}`);
  }

  get<T>(params: T) {
    return this.#http
      .get<ApiResponse>(`${this.#url}Get?json=${JSON.stringify(params)}`, {
        context: getNoLoader(),
      })
      .pipe(
        map(response => {
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
    return this.#http.post<ApiResponse>(`${this.#url}`, data);
  }
}
