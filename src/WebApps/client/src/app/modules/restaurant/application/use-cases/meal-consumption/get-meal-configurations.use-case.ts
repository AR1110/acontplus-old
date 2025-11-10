import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MealConsumptionRepository } from '@restaurant/domain/repositories/meal-consumption-repository';
import { MealScheduleConfiguration } from '@restaurant/domain/models/meal-consumption';
import { PagedResult } from '@acontplus/core';

@Injectable({
  providedIn: 'root',
})
export class GetMealConfigurationsUseCase {
  private readonly repository = inject(MealConsumptionRepository);

  execute(): Observable<PagedResult<MealScheduleConfiguration>> {
    return this.repository.getConfigurations();
  }
}
