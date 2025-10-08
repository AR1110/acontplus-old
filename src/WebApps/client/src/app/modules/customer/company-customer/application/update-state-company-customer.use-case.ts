import { BaseUseCase } from '@core/base-use-case';
import { inject, Injectable } from '@angular/core';
import { CompanyCustomerRepository } from '@company-customer/domain/company-customer.repository';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class UpdateStateCompanyCustomerUseCase implements BaseUseCase<ApiResponse, number> {
  private repo = inject(CompanyCustomerRepository);

  execute(id: number) {
    return this.repo.updateState(id);
  }
}
