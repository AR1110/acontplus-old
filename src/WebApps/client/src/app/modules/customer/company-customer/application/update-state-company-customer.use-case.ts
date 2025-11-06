import { BaseUseCase } from '@core/base-use-case';
import { inject, Injectable } from '@angular/core';
import { CompanyCustomerRepository } from '@company-customer/domain/company-customer.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class UpdateStateCompanyCustomerUseCase implements BaseUseCase<ApiResponseLegacy, number> {
  private repo = inject(CompanyCustomerRepository);

  execute(id: number) {
    return this.repo.updateState(id);
  }
}
