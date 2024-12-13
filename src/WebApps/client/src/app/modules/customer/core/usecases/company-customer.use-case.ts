import { Injectable } from "@angular/core";
import {AnticipoRepository} from "@accounting/core/repositories/anticipo.repository";
import {CompanyCustomerRepository} from "@customer/core/repositories/company-customer.repository";


@Injectable({
  providedIn: 'root'
})

export class CompanyCustomerUseCase {
  constructor(private repo: CompanyCustomerRepository) { }

  getAll<T extends { pageIndex: number; pageSize: number }>(obj:T) {
    return this.repo.getAll(obj)
  }

  updateState(idCliente:number){
    return this.repo.updateState(idCliente);
  }

  checkExistence<T>(params: T){
    return this.repo.checkExistence(params)
  }

  getDataForm(){
    return this.repo.getDataForm();
  }

  getId(idCliente: number, loader?: boolean){
    return this.repo.getId(idCliente, loader);
  }

  put<T>(id: number, data: T){
    return this.repo.put(id, data);
  }

  post<T>( data: T){
    return this.repo.post(data);
  }

  search<T extends {textSearch: string}>(obj: T){
    return this.repo.search(obj);
  }

}
