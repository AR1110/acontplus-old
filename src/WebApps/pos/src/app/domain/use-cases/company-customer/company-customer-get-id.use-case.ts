
import { Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import {CompanyCustomerRepository} from "@domain/repositories/company-customer.repository";

@Injectable({
  providedIn: 'root',
})
export class CompanyCustomerGetIdUseCase
  implements
    BaseUseCase<any, any>
{
  constructor(private repo: CompanyCustomerRepository) {}

  execute (id: number, noLoader?: boolean) {
    return this.repo.getId(id , noLoader );
  }
}
