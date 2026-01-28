import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from '@core/base-use-case';
import { MealScheduleSettingRepository } from '@restaurant/data/repositories/meal-schedule-setting.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export interface DeleteMealScheduleSettingParams {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteMealScheduleSettingUseCase
  implements BaseUseCase<ApiResponseLegacy, DeleteMealScheduleSettingParams>
{
  private readonly repository = inject(MealScheduleSettingRepository);

  execute(params: DeleteMealScheduleSettingParams): Observable<ApiResponseLegacy> {
    return this.repository.delete(params.id);
  }
}
