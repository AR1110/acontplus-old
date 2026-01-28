import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/restaurant-const';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.MENU}`;
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
          return { menus: [], menuTypes: [] };
        }

        const { menus, menuTypes } = JSON.parse(response.payload as string);

        return {
          menus: menus || [],
          menuTypes: menuTypes || [],
        };
      }),
    );
  }

  search<T extends { textSearch: string }>(obj: T) {
    const json = JSON.stringify({
      ...obj,
    });
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}?json=${json}` )
      .pipe(
        map((response) => {
          const result = {
            menus: [] as any[],
          };
          if (response.code === '1') {
            const mainData = JSON.parse(response.payload as string);
            result.menus = mainData.menus || [];
          }
          return result;
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
}
