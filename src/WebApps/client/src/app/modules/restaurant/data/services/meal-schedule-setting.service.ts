import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  MealScheduleSetting,
  MealScheduleSettingCreate,
  MealScheduleSettingUpdate,
} from '@restaurant/domain/models/meal-schedule-setting';

@Injectable({
  providedIn: 'root',
})
export class MealScheduleSettingService {
  #url = `${PATHS_API.RESTAURANT}/meal-schedule-settings`;
  #http = inject(HttpClient);

  getByEstablishmentId(
    establishmentId: number,
  ): Observable<ApiResponseLegacy<MealScheduleSetting[]>> {
    return this.#http
      .get<ApiResponseLegacy<MealScheduleSetting[]>>(`${this.#url}/${establishmentId}`)
      .pipe(map((response) => response));
  }

  create(data: MealScheduleSettingCreate): Observable<ApiResponseLegacy<MealScheduleSetting>> {
    return this.#http
      .post<ApiResponseLegacy<MealScheduleSetting>>(`${this.#url}`, data)
      .pipe(map((response) => response));
  }

  update(
    id: number,
    data: MealScheduleSettingUpdate,
  ): Observable<ApiResponseLegacy<MealScheduleSetting>> {
    return this.#http
      .put<ApiResponseLegacy<MealScheduleSetting>>(`${this.#url}/${id}`, data)
      .pipe(map((response) => response));
  }

  delete(id: number): Observable<ApiResponseLegacy> {
    return this.#http
      .delete<ApiResponseLegacy>(`${this.#url}/${id}`)
      .pipe(map((response) => response));
  }
}
