
import { Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import {CompanyCustomerRepository} from "@domain/repositories/company-customer.repository";
import {ApiResponse} from "@domain/models/api-response";

@Injectable({
  providedIn: 'root',
})
export class CompanyCustomerPostUseCase<T>
  implements
    BaseUseCase<ApiResponse, T>
{
  constructor(private repo: CompanyCustomerRepository) {}

  execute  (obj: T) {
    return this.repo.post(obj);
  }
}
