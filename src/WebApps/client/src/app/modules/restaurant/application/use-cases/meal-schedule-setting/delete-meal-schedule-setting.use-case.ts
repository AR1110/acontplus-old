import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from '@core/base-use-case';
import { MealScheduleSettingRepository } from '@restaurant/domain/repositories/meal-schedule-setting.repository';
import { ApiResponse } from '@core/models/api-response';

export interface DeleteMealScheduleSettingParams {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteMealScheduleSettingUseCase
  implements BaseUseCase<ApiResponse, DeleteMealScheduleSettingParams>
{
  private readonly repository = inject(MealScheduleSettingRepository);

  execute(params: DeleteMealScheduleSettingParams): Observable<ApiResponse> {
    return this.repository.delete(params.id);
  }
}
