import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from '@core/base-use-case';
import { MealScheduleSettingRepository } from '@restaurant/domain/repositories/meal-schedule-setting.repository';
import {
  MealScheduleSetting,
  MealScheduleSettingUpdate,
} from '@restaurant/domain/models/meal-schedule-setting';

export interface UpdateMealScheduleSettingParams {
  id: number;
  data: MealScheduleSettingUpdate;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateMealScheduleSettingUseCase
  implements BaseUseCase<MealScheduleSetting, UpdateMealScheduleSettingParams>
{
  private readonly repository = inject(MealScheduleSettingRepository);

  execute(params: UpdateMealScheduleSettingParams): Observable<MealScheduleSetting> {
    return this.repository.update(params.id, params.data);
  }
}
