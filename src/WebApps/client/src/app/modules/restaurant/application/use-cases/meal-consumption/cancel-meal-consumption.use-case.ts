import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from '@core/base-use-case';
import { MealConsumptionRepository } from '@restaurant/domain/repositories/meal-consumption-repository';
import { CancelMealConsumptionRequest } from '@restaurant/domain/models/meal-consumption';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class CancelMealConsumptionUseCase
  implements BaseUseCase<ApiResponseLegacy, CancelMealConsumptionRequest>
{
  private readonly repository = inject(MealConsumptionRepository);

  execute(params: CancelMealConsumptionRequest): Observable<ApiResponseLegacy> {
    return this.repository.cancel(params);
  }
}
