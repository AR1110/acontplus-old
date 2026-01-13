import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { MealScheduleSettingRepository } from '@restaurant/domain/repositories/meal-schedule-setting.repository';
import {
  MealScheduleSetting,
  MealScheduleSettingCreate,
  MealScheduleSettingUpdate,
} from '@restaurant/domain/models/meal-schedule-setting';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { RESTAURANT_PATHS } from '@restaurant/restaurant-const';

@Injectable({
  providedIn: 'root',
})
export class MealScheduleSettingHttpRepository implements MealScheduleSettingRepository {
  private readonly url = `${PATHS_API.RESTAURANT}${RESTAURANT_PATHS.MEAL_SCHEDULE_SETTING}`;
  private readonly http = inject(HttpClient);

  getByEstablishmentId(establishmentId: number): Observable<MealScheduleSetting[]> {
    return this.http
      .get<MealScheduleSetting[]>(`${this.url}${establishmentId}`)
      .pipe(map((response) => response));
  }

  create(data: MealScheduleSettingCreate): Observable<MealScheduleSetting> {
    return this.http
      .post<MealScheduleSetting>(`${this.url}`, data)
      .pipe(map((response) => response));
  }

  update(id: number, data: MealScheduleSettingUpdate): Observable<MealScheduleSetting> {
    return this.http
      .put<MealScheduleSetting>(`${this.url}/${id}`, data)
      .pipe(map((response) => response));
  }

  delete(id: number): Observable<ApiResponseLegacy> {
    return this.http
      .delete<ApiResponseLegacy>(`${this.url}/${id}`)
      .pipe(map((response) => response));
  }
}
