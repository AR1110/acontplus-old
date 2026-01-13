import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/restaurant-const';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.ITEM}`;
  #http = inject(HttpClient);

  delete(id: number) {
    return this.#http
      .delete<ApiResponseLegacy>(`${this.#url}${id}`)
      .pipe(map((response) => response));
  }

  get<T>(params: T) {
    return this.#http.get<ApiResponseLegacy>(`${this.#url}?json=${JSON.stringify(params)}`).pipe(
      map((response) => {
        if (response.code !== '1') {
          return { items: [] };
        }

        const { items } = JSON.parse(response.payload as string);

        return {
          items: items || [],
        };
      }),
    );
  }

  post<T>(data: T) {
    return this.#http
      .post<ApiResponseLegacy>(`${this.#url}`, data)
      .pipe(map((response) => response));
  }

  put<T>(id: number, data: T) {
    return this.#http
      .put<ApiResponseLegacy>(`${this.#url}${id}`, data)
      .pipe(map((response) => response));
  }

  search<T>(obj: T) {
    const json = JSON.stringify({
      ...obj,
      tipo: 1,
      pageIndex: 1,
      pageSize: 30,
    });
    return this.#http.get<ApiResponseLegacy>(`${this.#url}?json=${json}`).pipe(
      map((response) => {
        if (response.code === '1') {
          const { items } = (response.payload && JSON.parse(response.payload as string)) || [];
          return items || [];
        }
        return [];
      }),
    );
  }
}
