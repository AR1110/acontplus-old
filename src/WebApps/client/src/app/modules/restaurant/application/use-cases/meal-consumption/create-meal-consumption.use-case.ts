import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@acontplus/core';
import { MealConsumptionRepository } from '@restaurant/data/repositories/meal-consumption-repository';
import { MealConsumptionCreate } from '@restaurant/data/models/meal-consumption';

@Injectable({
  providedIn: 'root',
})
export class CreateMealConsumptionUseCase {
  private readonly repository = inject(MealConsumptionRepository);

  execute(params: MealConsumptionCreate): Observable<ApiResponse> {
    return this.repository.create(params);
  }
}
