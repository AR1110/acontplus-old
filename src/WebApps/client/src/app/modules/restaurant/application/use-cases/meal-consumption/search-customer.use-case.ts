import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MealConsumptionRepository } from '@restaurant/data/repositories/meal-consumption-repository';
import {
  CustomerSearchResult,
  MealScheduleForCustomer,
} from '@restaurant/data/models/meal-consumption';

export interface SearchCustomerRequest {
  searchTerm: string;
}

export interface SearchCustomerResponse {
  customer: CustomerSearchResult | null;
  schedules: MealScheduleForCustomer[];
}

@Injectable({
  providedIn: 'root',
})
export class SearchCustomerUseCase {
  private readonly repository = inject(MealConsumptionRepository);

  execute(request: SearchCustomerRequest): Observable<SearchCustomerResponse> {
    return this.repository.searchCustomer(request.searchTerm);
  }
}
