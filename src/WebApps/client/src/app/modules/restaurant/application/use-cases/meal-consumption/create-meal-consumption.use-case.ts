import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from '@core/base-use-case';
import { MealConsumptionRepository } from '@restaurant/domain/repositories/meal-consumption-repository';
import {
  MealConsumption,
  CreateMealConsumptionRequest,
} from '@restaurant/domain/models/meal-consumption';

@Injectable({
  providedIn: 'root',
})
export class CreateMealConsumptionUseCase
  implements BaseUseCase<MealConsumption, CreateMealConsumptionRequest>
{
  private readonly repository = inject(MealConsumptionRepository);

  execute(params: CreateMealConsumptionRequest): Observable<MealConsumption> {
    return this.repository.create(params);
  }
}
