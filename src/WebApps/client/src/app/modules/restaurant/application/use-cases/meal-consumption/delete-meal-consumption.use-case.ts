import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from '@core/base-use-case';
import { MealConsumptionRepository } from '@restaurant/data/repositories/meal-consumption-repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export interface DeleteMealConsumptionParams {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class DeleteMealConsumptionUseCase
  implements BaseUseCase<ApiResponseLegacy, DeleteMealConsumptionParams>
{
  private readonly repository = inject(MealConsumptionRepository);

  execute(params: DeleteMealConsumptionParams): Observable<ApiResponseLegacy> {
    return this.repository.delete(params.id);
  }
}
