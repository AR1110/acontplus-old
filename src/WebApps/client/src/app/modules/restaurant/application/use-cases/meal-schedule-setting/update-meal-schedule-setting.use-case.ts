import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from '@core/base-use-case';
import { MealScheduleSettingRepository } from '@restaurant/domain/repositories/meal-schedule-setting.repository';
import {
  MealScheduleSettingResponse,
  UpdateMealScheduleSettingRequest,
} from '@restaurant/domain/models/meal-schedule-setting.model';

export interface UpdateMealScheduleSettingParams {
  id: number;
  data: UpdateMealScheduleSettingRequest;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateMealScheduleSettingUseCase
  implements BaseUseCase<MealScheduleSettingResponse, UpdateMealScheduleSettingParams>
{
  private readonly repository = inject(MealScheduleSettingRepository);

  execute(params: UpdateMealScheduleSettingParams): Observable<MealScheduleSettingResponse> {
    return this.repository.update(params.id, params.data);
  }
}
