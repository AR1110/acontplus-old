import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/domain/enums/restaurant.enum';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { map } from 'rxjs';
import { getNoLoader } from '@core/interceptors/loader.interceptor';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.MENU}`;
  #http = inject(HttpClient);

  delete(id: number) {
    return this.#http.delete<ApiResponse>(`${this.#url}${id}`).pipe(map((response) => response));
  }

  get<T>(params: T) {
    return this.#http.get<ApiResponse>(`${this.#url}?json=${JSON.stringify(params)}`).pipe(
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
      .get<ApiResponse>(`${this.#url}?json=${json}`, {
        context: getNoLoader(),
      })
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
    return this.#http.post<ApiResponse>(`${this.#url}`, data).pipe(map((response) => response));
  }

  put<T>(id: number, data: T) {
    return this.#http.put<ApiResponse>(`${this.#url}${id}`, data).pipe(map((response) => response));
  }
}
