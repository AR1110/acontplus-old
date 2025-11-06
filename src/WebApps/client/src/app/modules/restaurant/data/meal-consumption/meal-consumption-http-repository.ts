import { MealConsumptionRepository } from '@restaurant/domain/repositories/meal-consumption-repository';
import { inject, Injectable } from '@angular/core';
import { PaginationParams, PagedResult } from '@acontplus/core';
import { MealConsumption } from '@modules/restaurant/domain/models/meal-consumption';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RESTAURANT_PATHS } from '@restaurant/domain/enums/restaurant.enum';

@Injectable({
  providedIn: 'root',
})
export class MealConsumptionHttpRepository implements MealConsumptionRepository {
  private readonly url = `${RESTAURANT_PATHS.MEAL_CONSUMPTION}`;
  private readonly http = inject(HttpClient);

  get(params: PaginationParams): Observable<PagedResult<MealConsumption>> {
    const queryParams = new URLSearchParams({
      pageIndex: params.pageIndex.toString(),
      pageSize: params.pageSize.toString(),
    });

    if (params.searchTerm) {
      queryParams.append('searchTerm', params.searchTerm);
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.sortDirection) {
      queryParams.append('sortDirection', params.sortDirection);
    }
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        queryParams.append(`filters[${key}]`, String(value));
      });
    }

    return this.http.get<PagedResult<MealConsumption>>(`${this.url}?${queryParams.toString()}`);
  }
}
