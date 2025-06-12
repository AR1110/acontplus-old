import { Injectable } from "@angular/core";
import {CompanyCustomerRepository} from "@company-customer/domain/company-customer.repository";


@Injectable({
  providedIn: 'root'
})

export class CompanyCustomerUseCase {
  constructor(private repo: CompanyCustomerRepository) { }

  getAll<T extends { pageIndex: number; pageSize: number }>(obj:T) {
    return this.repo.getAll(obj)
  }

  checkExistence<T>(params: T){
    return this.repo.checkExistence(params)
  }

  getId(idCliente: number, loader?: boolean){
    return this.repo.getId(idCliente, loader);
  }
  search<T extends {textSearch: string}>(obj: T){
    return this.repo.search(obj);
  }

}
