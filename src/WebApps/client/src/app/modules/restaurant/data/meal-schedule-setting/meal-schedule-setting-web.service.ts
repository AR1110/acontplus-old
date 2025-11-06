import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { MealScheduleSettingRepository } from '@restaurant/domain/repositories/meal-schedule-setting.repository';
import {
  MealScheduleSettingResponse,
  CreateMealScheduleSettingRequest,
  UpdateMealScheduleSettingRequest,
} from '@restaurant/domain/models/meal-schedule-setting.model';
import { MealScheduleSettingService } from '@restaurant/data/services/meal-schedule-setting.service';
import { MealScheduleSettingMapper } from '@restaurant/data/meal-schedule-setting/meal-schedule-setting.mapper';

@Injectable({
  providedIn: 'root',
})
export class MealScheduleSettingWebService implements MealScheduleSettingRepository {
  #service = inject(MealScheduleSettingService);

  getByEstablishmentId(establishmentId: number): Observable<MealScheduleSettingResponse[]> {
    return this.#service
      .getByEstablishmentId(establishmentId)
      .pipe(map((response) => MealScheduleSettingMapper.fromApiResponse(response)));
  }

  create(data: CreateMealScheduleSettingRequest): Observable<MealScheduleSettingResponse> {
    return this.#service.create(data).pipe(
      map((response) => {
        const result = MealScheduleSettingMapper.fromApiSingleResponse(response);
        if (!result) {
          throw new Error('Failed to create meal schedule setting');
        }
        return result;
      }),
    );
  }

  update(
    id: number,
    data: UpdateMealScheduleSettingRequest,
  ): Observable<MealScheduleSettingResponse> {
    return this.#service.update(id, data).pipe(
      map((response) => {
        const result = MealScheduleSettingMapper.fromApiSingleResponse(response);
        if (!result) {
          throw new Error('Failed to update meal schedule setting');
        }
        return result;
      }),
    );
  }

  delete(id: number): Observable<ApiResponseLegacy> {
    return this.#service.delete(id);
  }
}
