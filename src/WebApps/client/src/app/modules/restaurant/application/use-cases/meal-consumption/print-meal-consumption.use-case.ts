import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MealConsumptionRepository } from '@restaurant/data/repositories/meal-consumption-repository';
import { PrintConsumptionResponse } from '@restaurant/data/models/meal-consumption';

export interface PrintMealConsumptionRequest {
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class PrintMealConsumptionUseCase {
  private readonly repository = inject(MealConsumptionRepository);

  execute(request: PrintMealConsumptionRequest): Observable<PrintConsumptionResponse> {
    return this.repository.print(request.id);
  }
}
