import { Injectable } from "@angular/core";
import {SupplierRepository} from "@customer/domain/repositories/supplier.repository";


@Injectable({
  providedIn: 'root'
})

export class SupplierUseCase {
  constructor(private repo: SupplierRepository) { }

  search<T extends {textSearch: string}>(obj:T) {
    return this.repo.search(obj)
  }



}
