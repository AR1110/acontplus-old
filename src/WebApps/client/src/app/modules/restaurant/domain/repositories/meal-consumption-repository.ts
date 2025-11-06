import { Observable } from 'rxjs';
import { PagedResult, PaginationParams } from '@acontplus/core';
import { MealConsumption } from '../models/meal-consumption';

export abstract class MealConsumptionRepository {
  abstract get(params: PaginationParams): Observable<PagedResult<MealConsumption>>;
}
