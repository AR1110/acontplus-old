import { BaseUseCase } from '@core/base-use-case';
import { inject, Injectable } from '@angular/core';
import { CompanyCustomerRepository } from '@company-customer/domain/company-customer.repository';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class CreateCompanyCustomerUseCase implements BaseUseCase<ApiResponse, any> {
  private repo = inject(CompanyCustomerRepository);

  execute(params: any) {
    return this.repo.post(params);
  }
}
