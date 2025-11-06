import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
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
    establishmentId: number,
  ): Observable<ApiResponseLegacy<MealScheduleSettingResponse[]>> {
    return this.#http
      .get<ApiResponseLegacy<MealScheduleSettingResponse[]>>(`${this.#url}/${establishmentId}`)
      .pipe(map((response) => response));
  }

  create(
    data: CreateMealScheduleSettingRequest,
  ): Observable<ApiResponseLegacy<MealScheduleSettingResponse>> {
    return this.#http
      .post<ApiResponseLegacy<MealScheduleSettingResponse>>(`${this.#url}`, data)
      .pipe(map((response) => response));
  }

  update(
    id: number,
    data: UpdateMealScheduleSettingRequest,
  ): Observable<ApiResponseLegacy<MealScheduleSettingResponse>> {
    return this.#http
      .put<ApiResponseLegacy<MealScheduleSettingResponse>>(`${this.#url}/${id}`, data)
      .pipe(map((response) => response));
  }

  delete(id: number): Observable<ApiResponseLegacy> {
    return this.#http
      .delete<ApiResponseLegacy>(`${this.#url}/${id}`)
      .pipe(map((response) => response));
  }
}
