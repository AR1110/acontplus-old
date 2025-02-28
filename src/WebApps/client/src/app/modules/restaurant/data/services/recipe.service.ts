import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/domain/enums/restaurant.enum';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.RECIPE}`;
  #http = inject(HttpClient);

  getByItem<T>(id: number) {
    return this.#http.get<ApiResponse>(`${this.#url}GetByItem/${id}`).pipe(
      map((response) => {
        if (response.code !== '1') {
          return { recipes: [] };
        }

        const { recipe } = JSON.parse(response.payload as string);

        return {
          recipes: recipe || [],
        };
      }),
    );
  }
}
