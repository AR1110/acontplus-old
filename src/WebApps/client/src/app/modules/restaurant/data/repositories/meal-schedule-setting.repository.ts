import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {
  MealScheduleSetting,
  MealScheduleSettingCreate,
  MealScheduleSettingUpdate,
} from '@restaurant/data/models/meal-schedule-setting';

export abstract class MealScheduleSettingRepository {
  abstract getByEstablishmentId(establishmentId: number): Observable<MealScheduleSetting[]>;

  abstract create(data: MealScheduleSettingCreate): Observable<MealScheduleSetting>;

  abstract update(id: number, data: MealScheduleSettingUpdate): Observable<MealScheduleSetting>;

  abstract delete(id: number): Observable<ApiResponseLegacy>;
}
