import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/restaurant-const';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class PromotionMenuService {
  private url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.PROMOTION_MENU}`;
  private http = inject(HttpClient);
  constructor() {}

  getByPromotionId<T>(id: number, obj: T) {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });

    return this.http.get<ApiResponseLegacy>(`${this.url}GetById/${id}?json=${json}`).pipe(
      map((response) => {
        const result = {
          promotionMenus: [],
        };
        if (response.code === '1') {
          const mainData = JSON.parse(response.payload as string);
          console.log(mainData);
          const promotionMenus = mainData.promotionMenus || [];
          result.promotionMenus = promotionMenus;
        }
        return result;
      }),
    );
  }
}
