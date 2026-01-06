import { RESTAURANT_PATHS } from '@restaurant/restaurant-const';
import { PATHS_API } from '@core/constants/global.constants';
import { generateUuidv4 } from '@core/utils/generate-uuidv4';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.RECIPE}`;
  #http = inject(HttpClient);

  getByItem<T>(id: number) {
    return this.#http.get<ApiResponseLegacy>(`${this.#url}GetByItem/${id}`).pipe(
      map((response) => {
        if (response.code !== '1') {
          return { recipes: [] };
        }

        const { recipe } = JSON.parse(response.payload as string);

        return {
          recipes: (recipe || []).map((item: any) => {
            return {
              ...item,
              uuid: generateUuidv4(),
            };
          }),
        };
      }),
    );
  }
}
