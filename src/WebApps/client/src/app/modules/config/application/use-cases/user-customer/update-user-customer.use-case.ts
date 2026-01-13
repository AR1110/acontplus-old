import { UserCustomerRepository } from '@modules/config/data/repositories/user-customer.repository';
import { UserCustomer } from '@modules/config/data/models/user-customer/user-customer.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { inject, Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserCustomerUseCase implements BaseUseCase<ApiResponseLegacy, UserCustomer> {
  private repo = inject(UserCustomerRepository);
  execute(params: UserCustomer): Observable<ApiResponseLegacy> {
    return this.repo.update(params);
  }
}
