import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  MealScheduleSettingResponse,
  CreateMealScheduleSettingRequest,
  UpdateMealScheduleSettingRequest,
} from '@restaurant/domain/models/meal-schedule-setting.model';

export abstract class MealScheduleSettingRepository {
  abstract getByEstablishmentId(establishmentId: number): Observable<MealScheduleSettingResponse[]>;

  abstract create(data: CreateMealScheduleSettingRequest): Observable<MealScheduleSettingResponse>;

  abstract update(
    id: number,
    data: UpdateMealScheduleSettingRequest,
  ): Observable<MealScheduleSettingResponse>;

  abstract delete(id: number): Observable<ApiResponseLegacy>;
}
