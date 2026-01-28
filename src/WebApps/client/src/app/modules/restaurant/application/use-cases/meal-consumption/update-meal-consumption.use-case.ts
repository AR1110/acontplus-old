import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from '@core/base-use-case';
import { MealConsumptionRepository } from '@restaurant/data/repositories/meal-consumption-repository';
import { MealConsumption, MealConsumptionUpdate } from '@restaurant/data/models/meal-consumption';

export interface UpdateMealConsumptionParams {
  id: number;
  data: MealConsumptionUpdate;
}

@Injectable({
  providedIn: 'root',
})
export class UpdateMealConsumptionUseCase
  implements BaseUseCase<MealConsumption, UpdateMealConsumptionParams>
{
  private readonly repository = inject(MealConsumptionRepository);

  execute(params: UpdateMealConsumptionParams): Observable<MealConsumption> {
    return this.repository.update(params.id, params.data);
  }
}
