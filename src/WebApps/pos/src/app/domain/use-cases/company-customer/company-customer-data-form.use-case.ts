
import { Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import {CompanyCustomerDataForm} from "@domain/models/company-customer.model";
import {CompanyCustomerRepository} from "@domain/repositories/company-customer.repository";

@Injectable({
  providedIn: 'root',
})
export class CompanyCustomerDataFormUseCase
  implements
    BaseUseCase<CompanyCustomerDataForm, void>
{
  constructor(private repo: CompanyCustomerRepository) {}

  execute() {
    return this.repo.dataForm();
  }
}
