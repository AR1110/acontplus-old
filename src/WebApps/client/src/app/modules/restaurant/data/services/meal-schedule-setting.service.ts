import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponse } from '@core/models/api-response';
import {
  MealScheduleSettingResponse,
  CreateMealScheduleSettingRequest,
  UpdateMealScheduleSettingRequest,
} from '@restaurant/domain/models/meal-schedule-setting.model';

@Injectable({
  providedIn: 'root',
})
export class MealScheduleSettingService {
  #url = `${PATHS_API.RESTAURANT}/meal-schedule-settings`;
  #http = inject(HttpClient);

  getByEstablishmentId(
    establishmentId: number
  ): Observable<ApiResponse<MealScheduleSettingResponse[]>> {
    return this.#http
      .get<ApiResponse<MealScheduleSettingResponse[]>>(`${this.#url}/${establishmentId}`)
      .pipe(map((response) => response));
  }

  create(
    data: CreateMealScheduleSettingRequest
  ): Observable<ApiResponse<MealScheduleSettingResponse>> {
    return this.#http
      .post<ApiResponse<MealScheduleSettingResponse>>(`${this.#url}`, data)
      .pipe(map((response) => response));
  }

  update(
    id: number,
    data: UpdateMealScheduleSettingRequest
  ): Observable<ApiResponse<MealScheduleSettingResponse>> {
    return this.#http
      .put<ApiResponse<MealScheduleSettingResponse>>(`${this.#url}/${id}`, data)
      .pipe(map((response) => response));
  }

  delete(id: number): Observable<ApiResponse> {
    return this.#http
      .delete<ApiResponse>(`${this.#url}/${id}`)
      .pipe(map((response) => response));
  }
}
