import { MealConsumptionRepository } from '@restaurant/data/repositories/meal-consumption-repository';
import { inject, Injectable } from '@angular/core';
import { PaginationParams, PagedResult, ApiResponse } from '@acontplus/core';
import {
  MealConsumption,
  MealConsumptionCreate,
  MealConsumptionUpdate,
  MealConsumptionCancel,
  MealConsumptionCreateForOtherDateRequest,
  PrintConsumptionResponse,
} from '@restaurant/data/models/meal-consumption';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RESTAURANT_PATHS } from '@restaurant/restaurant-const';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { SearchCustomerResponse } from '@restaurant/application/use-cases/meal-consumption/search-customer.use-case';
import { GetCancellationDetailsResponse } from '@restaurant/application/use-cases/meal-consumption/get-cancellation-details.use-case';
import { map } from 'rxjs/operators';
import { PATHS_API } from '@core/constants/global.constants';

@Injectable({
  providedIn: 'root',
})
export class MealConsumptionHttpRepository implements MealConsumptionRepository {
  private readonly url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.MEAL_CONSUMPTION}`;
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

  create(data: MealConsumptionCreate): Observable<ApiResponse> {
    const payload = {
      tipo: 1,
      mealScheduleSettingId: data.mealScheduleSettingId,
      idCliente: data.idCliente,
      onTime: data.onTime,
      cantidad: data.amount,
    };
    return this.http.post<ApiResponse>('/consumoTpv/Post', { json: JSON.stringify(payload) });
  }

  createForOtherDate(data: MealConsumptionCreateForOtherDateRequest): Observable<ApiResponse> {
    const payload = {
      tipo: 2,
      mealScheduleSettingId: data.mealScheduleSettingId,
      idCliente: data.idCliente,
      fechaConsumo: data.consumptionDate,
      cantidad: data.amount,
    };
    return this.http.post<ApiResponse>('/ConsumoTpv/Post', { json: JSON.stringify(payload) });
  }

  update(id: number, data: MealConsumptionUpdate): Observable<MealConsumption> {
    return this.http.put<MealConsumption>(`${this.url}${id}`, data);
  }

  delete(id: number): Observable<ApiResponseLegacy> {
    return this.http.delete<ApiResponseLegacy>(`${this.url}${id}`);
  }

  cancel(data: MealConsumptionCancel): Observable<ApiResponseLegacy> {
    return this.http.post<ApiResponseLegacy>(`${this.url}cancel/${data.id}`, {
      json: JSON.stringify(data),
    });
  }

  searchCustomer(searchTerm: string): Observable<SearchCustomerResponse> {
    const payload = {
      tipo: 3,
      txtSearch: searchTerm,
    };
    return this.http
      .get<ApiResponseLegacy>('/consumoTpv/Get', {
        params: { json: JSON.stringify(payload) },
      })
      .pipe(
        map((response) => {
          if (response.code === '1' && response.payload) {
            const data = JSON.parse(response.payload as string);
            return {
              customer: data[0]?.[0] ?? null,
              schedules: data[1] ?? [],
            };
          }
          return {
            customer: null,
            schedules: [],
          };
        }),
      );
  }

  print(id: number): Observable<PrintConsumptionResponse> {
    return this.http.post<PrintConsumptionResponse>('/ConsumoTpv/Print', null, {
      params: { id: id.toString() },
    });
  }

  getCancellationDetails(id: number): Observable<GetCancellationDetailsResponse> {
    const payload = {
      idConsumoTpv: id,
    };
    return this.http
      .get<ApiResponseLegacy>('/ConsumoAnuladoTpv/Get', {
        params: { json: JSON.stringify(payload) },
      })
      .pipe(
        map((response) => {
          if (response.code === '1' && response.payload) {
            const data = JSON.parse(response.payload as string);
            return {
              code: response.code,
              message: response.message,
              details: data[0] ?? null,
            };
          }
          return {
            code: response.code,
            message: response.message,
            details: null,
          };
        }),
      );
  }
}
