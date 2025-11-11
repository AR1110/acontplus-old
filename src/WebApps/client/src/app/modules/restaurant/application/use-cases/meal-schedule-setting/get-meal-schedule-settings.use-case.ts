import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from '@core/base-use-case';
import { MealScheduleSettingRepository } from '@restaurant/domain/repositories/meal-schedule-setting.repository';
import { MealScheduleSetting } from '@restaurant/domain/models/meal-schedule-setting';

export interface GetMealScheduleSettingsParams {
  establishmentId: number;
}

@Injectable({
  providedIn: 'root',
})
export class GetMealScheduleSettingsUseCase
  implements BaseUseCase<MealScheduleSetting[], GetMealScheduleSettingsParams>
{
  private readonly repository = inject(MealScheduleSettingRepository);

  execute(params: GetMealScheduleSettingsParams): Observable<MealScheduleSetting[]> {
    return this.repository.getByEstablishmentId(params.establishmentId);
  }
}
