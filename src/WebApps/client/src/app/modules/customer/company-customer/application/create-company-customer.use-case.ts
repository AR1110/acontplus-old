import { BaseUseCase } from '@core/base-use-case';
import { inject, Injectable } from '@angular/core';
import { CompanyCustomerRepository } from '@company-customer/domain/company-customer.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class CreateCompanyCustomerUseCase implements BaseUseCase<ApiResponseLegacy, any> {
  private repo = inject(CompanyCustomerRepository);

  execute(params: any) {
    return this.repo.post(params);
  }
}
