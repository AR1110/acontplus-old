import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/enums/restaurant.enum';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.MENU_ITEM}`;
  #http = inject(HttpClient);

  getByMenu<T>(id: number, params: T) {
    return this.#http
      .get<ApiResponse>(
        `${this.#url}GetById/${id}/?json=${JSON.stringify(params)}`,
      )
      .pipe(
        map((response) => {
          if (response.code !== '1') {
            return { menusItems: [], tarifas: [] };
          }

          const { menusItems, tarifas } = JSON.parse(
            response.payload as string,
          );

          return {
            menusItems: menusItems || [],
            tarifas: tarifas || [],
          };
        }),
      );
  }
}
