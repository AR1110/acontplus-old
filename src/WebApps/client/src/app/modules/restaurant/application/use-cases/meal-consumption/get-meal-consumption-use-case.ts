import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseUseCase } from '@core/base-use-case';
import { PagedResult, PaginationParams } from '@acontplus/core';
import { MealConsumptionRepository } from '@restaurant/data/repositories/meal-consumption-repository';
import { MealConsumption } from '@restaurant/data/models/meal-consumption';

@Injectable({
  providedIn: 'root',
})
export class GetMealConsumptionUseCase
  implements BaseUseCase<PagedResult<MealConsumption>, PaginationParams>
{
  private readonly repository = inject(MealConsumptionRepository);

  execute(params: PaginationParams): Observable<PagedResult<MealConsumption>> {
    return this.repository.get(params);
  }
}
