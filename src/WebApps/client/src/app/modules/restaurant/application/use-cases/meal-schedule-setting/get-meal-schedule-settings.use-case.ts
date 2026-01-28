import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from '@core/base-use-case';
import { MealScheduleSettingRepository } from '@restaurant/data/repositories/meal-schedule-setting.repository';
import { MealScheduleSetting } from '@restaurant/data/models/meal-schedule-setting';

@Injectable({
  providedIn: 'root',
})
export class GetMealScheduleSettingsUseCase implements BaseUseCase<MealScheduleSetting[], number> {
  private readonly repository = inject(MealScheduleSettingRepository);

  execute(establishmentId: number): Observable<MealScheduleSetting[]> {
    return this.repository.getByEstablishmentId(establishmentId);
  }
}
