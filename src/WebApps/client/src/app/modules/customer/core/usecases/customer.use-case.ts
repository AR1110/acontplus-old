import { Injectable } from "@angular/core";
import {AnticipoRepository} from "@accounting/core/repositories/anticipo.repository";
import {CompanyCustomerRepository} from "@customer/core/repositories/company-customer.repository";
import {SupplierRepository} from "@customer/core/repositories/supplier.repository";
import {CustomerRepository} from "@customer/core/repositories/customer.repository";


@Injectable({
  providedIn: 'root'
})

export class CustomerUseCase {
  constructor(private repo: CustomerRepository) { }

  getAll<T>(obj:T) {
    return this.repo.getAll(obj)
  }


}
