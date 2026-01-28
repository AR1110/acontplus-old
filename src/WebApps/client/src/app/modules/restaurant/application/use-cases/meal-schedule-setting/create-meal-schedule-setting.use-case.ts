import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from '@core/base-use-case';
import { MealScheduleSettingRepository } from '@restaurant/data/repositories/meal-schedule-setting.repository';
import {
  MealScheduleSetting,
  MealScheduleSettingCreate,
} from '@restaurant/data/models/meal-schedule-setting';

@Injectable({
  providedIn: 'root',
})
export class CreateMealScheduleSettingUseCase
  implements BaseUseCase<MealScheduleSetting, MealScheduleSettingCreate>
{
  private readonly repository = inject(MealScheduleSettingRepository);

  execute(params: MealScheduleSettingCreate): Observable<MealScheduleSetting> {
    return this.repository.create(params);
  }
}
