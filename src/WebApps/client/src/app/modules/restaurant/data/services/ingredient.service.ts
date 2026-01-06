import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { RESTAURANT_PATHS } from '@restaurant/restaurant-const';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map, Observable } from 'rxjs';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { Ingredient } from '@restaurant/domain/models/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  #url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.INGREDIENT}`;
  #http = inject(HttpClient);

  get<T>(params: T) {
    return this.#http.get<ApiResponseLegacy>(`${this.#url}?json=${JSON.stringify(params)}`).pipe(
      map((response) => {
        if (response.code !== '1') {
          return { ingredients: [], extents: [] };
        }

        const { ingredients, extents } = JSON.parse(response.payload as string);

        return {
          ingredients: ingredients || [],
          extents: extents || [],
        };
      }),
    );
  }

  put<T>(id: number, data: T) {
    return this.#http
      .put<ApiResponseLegacy>(`${this.#url}${id}`, data)
      .pipe(map((response) => response));
  }

  search<T extends { textSearch: string }>(data: T): Observable<Ingredient[]> {
    const query = {
      textSearch: data.textSearch,
      tipo: 2,
    };
    return this.#http
      .get<ApiResponseLegacy>(`${this.#url}?json=${JSON.stringify(query)}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          if (response.code === '1') {
            const { ingredients } =
              (response.payload && JSON.parse(response.payload as string)) || [];
            return ingredients || [];
          }
          return [];
        }),
      );
  }
}
