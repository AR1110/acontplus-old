import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from '@core/base-use-case';
import { MealScheduleSettingRepository } from '@restaurant/domain/repositories/meal-schedule-setting.repository';
import {
  MealScheduleSettingResponse,
  CreateMealScheduleSettingRequest,
} from '@restaurant/domain/models/meal-schedule-setting.model';

@Injectable({
  providedIn: 'root',
})
export class CreateMealScheduleSettingUseCase
  implements BaseUseCase<MealScheduleSettingResponse, CreateMealScheduleSettingRequest>
{
  private readonly repository = inject(MealScheduleSettingRepository);

  execute(params: CreateMealScheduleSettingRequest): Observable<MealScheduleSettingResponse> {
    return this.repository.create(params);
  }
}
