import { UserCustomerRepository } from '@modules/config/domain/repositories/user-customer.repository';
import { UserCustomer } from '@modules/config/domain/models/user-customer/user-customer.model';
import { ApiResponse } from '@core/models/api-response';
import { inject, Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserCustomerUseCase implements BaseUseCase<ApiResponse, UserCustomer> {
  private repo = inject(UserCustomerRepository);
  execute(params: UserCustomer): Observable<ApiResponse> {
    return this.repo.update(params);
  }
}
