
import { Injectable } from '@angular/core';
import {CompanyCustomerRepository} from "@domain/repositories/company-customer.repository";

@Injectable({
  providedIn: 'root',
})
export class CompanyCustomerPutUseCase   {
  constructor(private repo: CompanyCustomerRepository) {}
  execute <T> (id:number, obj: T) {
    return this.repo.put(id, obj);
  }
}
