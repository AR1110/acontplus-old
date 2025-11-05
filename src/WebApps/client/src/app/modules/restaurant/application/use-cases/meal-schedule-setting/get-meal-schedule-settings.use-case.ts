import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from '@core/base-use-case';
import { MealScheduleSettingRepository } from '@restaurant/domain/repositories/meal-schedule-setting.repository';
import { MealScheduleSettingResponse } from '@restaurant/domain/models/meal-schedule-setting.model';

export interface GetMealScheduleSettingsParams {
  establishmentId: number;
}

@Injectable({
  providedIn: 'root',
})
export class GetMealScheduleSettingsUseCase
  implements BaseUseCase<MealScheduleSettingResponse[], GetMealScheduleSettingsParams>
{
  private readonly repository = inject(MealScheduleSettingRepository);

  execute(params: GetMealScheduleSettingsParams): Observable<MealScheduleSettingResponse[]> {
    return this.repository.getByEstablishmentId(params.establishmentId);
  }
}
