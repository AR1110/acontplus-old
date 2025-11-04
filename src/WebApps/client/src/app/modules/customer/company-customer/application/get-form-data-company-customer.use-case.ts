import { FormDataCompanyCustomerResponse } from '@company-customer/domain/entities/company-customer.entity';
import { CompanyCustomerRepository } from '@company-customer/domain/company-customer.repository';
import { BaseUseCase } from '@core/base-use-case';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GetFormDataCompanyCustomerUseCase
  implements BaseUseCase<FormDataCompanyCustomerResponse, void>
{
  private repo = inject(CompanyCustomerRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
  execute() {
    return this.repo.getDataForm();
  }
}
