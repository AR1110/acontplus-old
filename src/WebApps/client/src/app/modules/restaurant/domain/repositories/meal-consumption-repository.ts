import { Observable } from 'rxjs';
import { PagedResult, PaginationParams } from '@acontplus/core';
import {
  MealConsumption,
  CreateMealConsumptionRequest,
  UpdateMealConsumptionRequest,
  CancelMealConsumptionRequest,
} from '../models/meal-consumption';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export abstract class MealConsumptionRepository {
  abstract get(params: PaginationParams): Observable<PagedResult<MealConsumption>>;
  abstract create(data: CreateMealConsumptionRequest): Observable<MealConsumption>;
  abstract update(id: number, data: UpdateMealConsumptionRequest): Observable<MealConsumption>;
  abstract delete(id: number): Observable<ApiResponseLegacy>;
  abstract cancel(data: CancelMealConsumptionRequest): Observable<ApiResponseLegacy>;
}
