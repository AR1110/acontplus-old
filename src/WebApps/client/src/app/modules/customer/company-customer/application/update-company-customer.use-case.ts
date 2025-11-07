import { BaseUseCase } from '@core/base-use-case';
import { inject, Injectable } from '@angular/core';
import { CompanyCustomerRepository } from '@company-customer/domain/company-customer.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { UpdateCompanyCustomerParamsDto } from '@company-customer/domain/dtos/company-customer.dto';

@Injectable({
  providedIn: 'root',
})
export class UpdateCompanyCustomerUseCase
  implements BaseUseCase<ApiResponseLegacy, UpdateCompanyCustomerParamsDto>
{
  private repo = inject(CompanyCustomerRepository);

  execute(params: UpdateCompanyCustomerParamsDto) {
    return this.repo.put(params);
  }
}
