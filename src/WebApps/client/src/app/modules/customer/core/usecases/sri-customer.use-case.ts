import { Injectable } from "@angular/core";
import {AnticipoRepository} from "@accounting/core/repositories/anticipo.repository";
import {CompanyCustomerRepository} from "@customer/core/repositories/company-customer.repository";
import {SupplierRepository} from "@customer/core/repositories/supplier.repository";
import {CustomerRepository} from "@customer/core/repositories/customer.repository";
import {SriCustomerRepository} from "@customer/core/repositories/sri-customer.repository";


@Injectable({
  providedIn: 'root'
})

export class SriCustomerUseCase {
  constructor(private repo: SriCustomerRepository) { }

  search(codigoIdentificacion: string, id: string){
    return this.repo.search(codigoIdentificacion, id);
  }
  searchByRuc(obj:string) {
    return this.repo.searchByRuc(obj)
  }

  searchByCedula (obj:string) {
    return this.repo.searchByCedula(obj)
  }


}
