import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MealConsumptionRepository } from '@restaurant/data/repositories/meal-consumption-repository';
import { MealConsumptionCreateForOtherDateRequest } from '@restaurant/data/models/meal-consumption';
import { ApiResponse } from '@acontplus/core';

@Injectable({
  providedIn: 'root',
})
export class CreateMealConsumptionForOtherDateUseCase {
  private readonly repository = inject(MealConsumptionRepository);

  execute(request: MealConsumptionCreateForOtherDateRequest): Observable<ApiResponse> {
    return this.repository.createForOtherDate(request);
  }
}
