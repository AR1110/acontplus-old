import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/restaurant-const';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.MENU_ITEM}`;
  #http = inject(HttpClient);

  getByMenu<T>(id: number, params: T) {
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}GetById/${id}/?json=${JSON.stringify(params)}`)
      .pipe(
        map((response) => {
          if (response.code !== '1') {
            return { menuItems: [], tarifas: [] };
          }

          const { menuItems, tarifas } = JSON.parse(response.payload as string);

          return {
            menuItems: menuItems || [],
            tarifas: tarifas || [],
          };
        }),
      );
  }
}
