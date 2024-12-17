import { Injectable } from "@angular/core";
import {AnticipoRepository} from "@accounting/core/repositories/anticipo.repository";
import {ProductRepository} from "@inventory/core/repositories/product.repository";


@Injectable({
  providedIn: 'root'
})

export class ProductUsecase {
  constructor(private repo: ProductRepository) { }

  getAll<T>(obj:T) {
    return this.repo.getAll(obj)
  }

  getDataFilter(){
    return this.repo.getDataFilter()
  }


  getDataForm(){
    return this.repo.getDataForm();
  }


   search<T extends { textSearch: string, pageIndex?: number, pageSize?: number }>(obj:T){
    return this.repo.search(obj)
   }


  getForSale(id: number){
    return this.repo.getForSale(id)
  }

  checkNotificationStock<T extends {
    idArticulo: number
    cantidad: number
    idBodega: number
    idMedida: number
  }>(obj:T){
    return this.repo.checkNotificationStock(obj)
  }

  getDataReport(){
    return this.repo.getDataReport()
  }

  updateStatus(id: number){
    return this.repo.updateStatus(id)
  }





  // create<T>(data: T) {
  //   return this.repo.create(data)
  // }
  //
  // update<T>(id: number, data: T) {
  //   return this.repo.update(id, data)
  // }
  //
  // delete(id: number) {
  //   return this.repo.delete(id)
  // }

}
