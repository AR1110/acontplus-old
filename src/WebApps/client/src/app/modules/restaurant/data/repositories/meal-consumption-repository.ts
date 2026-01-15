import { Observable } from 'rxjs';
import { PagedResult, PaginationParams, ApiResponse } from '@acontplus/core';
import {
  MealConsumption,
  MealConsumptionCreate,
  MealConsumptionUpdate,
  MealConsumptionCancel,
  MealConsumptionCreateForOtherDateRequest,
  PrintConsumptionResponse,
} from '@restaurant/data/models/meal-consumption';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { SearchCustomerResponse } from '@restaurant/application/use-cases/meal-consumption/search-customer.use-case';
import { GetCancellationDetailsResponse } from '@restaurant/application/use-cases/meal-consumption/get-cancellation-details.use-case';

export abstract class MealConsumptionRepository {
  abstract get(params: PaginationParams): Observable<PagedResult<MealConsumption>>;
  abstract create(data: MealConsumptionCreate): Observable<ApiResponse>;
  abstract createForOtherDate(
    data: MealConsumptionCreateForOtherDateRequest,
  ): Observable<ApiResponse>;
  abstract update(id: number, data: MealConsumptionUpdate): Observable<MealConsumption>;
  abstract delete(id: number): Observable<ApiResponseLegacy>;
  abstract cancel(data: MealConsumptionCancel): Observable<ApiResponseLegacy>;
  abstract searchCustomer(searchTerm: string): Observable<SearchCustomerResponse>;
  abstract print(id: number): Observable<PrintConsumptionResponse>;
  abstract getCancellationDetails(id: number): Observable<GetCancellationDetailsResponse>;
}
