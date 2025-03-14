
import { Injectable } from '@angular/core';
import {CompanyCustomerRepository} from "@domain/repositories/company-customer.repository";
import {BaseUseCase} from "@core/base-use-case";
import {ApiResponse} from "@domain/models/api-response";

@Injectable({
  providedIn: 'root',
})
export class CompanyCustomerSearchUseCase<T extends { textSearch: string }>   implements BaseUseCase<ApiResponse, T>  {
  constructor(private repo: CompanyCustomerRepository) {}
  execute  ( obj: T) {
    return this.repo.search( obj);
  }
}
