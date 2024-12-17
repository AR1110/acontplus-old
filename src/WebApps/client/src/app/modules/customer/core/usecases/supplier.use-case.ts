import { Injectable } from "@angular/core";
import {AnticipoRepository} from "@accounting/core/repositories/anticipo.repository";
import {CompanyCustomerRepository} from "@customer/core/repositories/company-customer.repository";
import {SupplierRepository} from "@customer/core/repositories/supplier.repository";


@Injectable({
  providedIn: 'root'
})

export class SupplierUseCase {
  constructor(private repo: SupplierRepository) { }

  search<T extends {textSearch: string}>(obj:T) {
    return this.repo.search(obj)
  }



}
