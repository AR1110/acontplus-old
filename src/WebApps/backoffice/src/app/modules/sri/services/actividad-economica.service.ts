import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SRI_PATHS_API } from '@modules/sri/constants/constants';
import { ApiResponse } from 'acontplus-utils';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActividadEconomicaService {
  #http = inject(HttpClient);
  #url = `${SRI_PATHS_API.ACTIVIDAD_ECONOMICA}`;

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
            return { activities: [], tarifas: [] };
          }
          const { activities, tarifas } = JSON.parse(response.payload as string);
          return { activities: activities || [], tarifas: tarifas || [] };
        }),
      );
  }

  post<T>(data: T) {
    return this.#http
      .post<ApiResponse>(`${this.#url}`, data)
      .pipe(map((response) => response));
  }

  put<T>(id: number, data: T) {
    return this.#http
      .put<ApiResponse>(`${this.#url}${id}`, data)
      .pipe(map((response) => response));
  }
}
