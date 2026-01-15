import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from '@core/base-use-case';
import { MealConsumptionRepository } from '@restaurant/data/repositories/meal-consumption-repository';
import { MealConsumptionCancel } from '@restaurant/data/models/meal-consumption';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class CancelMealConsumptionUseCase
  implements BaseUseCase<ApiResponseLegacy, MealConsumptionCancel>
{
  private readonly repository = inject(MealConsumptionRepository);

  execute(params: MealConsumptionCancel): Observable<ApiResponseLegacy> {
    return this.repository.cancel(params);
  }
}
