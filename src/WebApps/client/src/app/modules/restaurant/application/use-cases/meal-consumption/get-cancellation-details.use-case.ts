import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MealConsumptionRepository } from '@restaurant/data/repositories/meal-consumption-repository';
import { CancellationDetails } from '@restaurant/data/models/meal-consumption';

export interface GetCancellationDetailsRequest {
  id: number;
}

export interface GetCancellationDetailsResponse {
  code: string;
  message: string;
  details: CancellationDetails | null;
}

@Injectable({
  providedIn: 'root',
})
export class GetCancellationDetailsUseCase {
  private readonly repository = inject(MealConsumptionRepository);

  execute(request: GetCancellationDetailsRequest): Observable<GetCancellationDetailsResponse> {
    return this.repository.getCancellationDetails(request.id);
  }
}
