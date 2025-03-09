
import { Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import { CompanyCustomerRead} from "@domain/models/company-customer.model";
import {CompanyCustomerRepository} from "@domain/repositories/company-customer.repository";

@Injectable({
  providedIn: 'root',
})
export class CompanyCustomerGetAllUseCase
  implements
    BaseUseCase<{
  data: CompanyCustomerRead[]
    }, any>
{
  constructor(private repo: CompanyCustomerRepository) {}

  execute<T>(obj: T) {
    return this.repo.getAll(obj);
  }
}
