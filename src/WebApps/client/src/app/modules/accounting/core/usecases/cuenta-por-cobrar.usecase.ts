import { Injectable } from "@angular/core";
import {CuentaPorCobrarRepository} from "@accounting/core/repositories/cuenta-por-cobrar.repository";


@Injectable({
  providedIn: 'root'
})

export class CuentaPorCobrarUsecase {
  constructor(private repo: CuentaPorCobrarRepository) { }

  getAll<T>(obj:T) {
    return this.repo.getAll(obj)
  }


  getDataForm(idCuentaPorCobrar: number, idCliente: number){
    return this.repo.getDataForm(idCuentaPorCobrar, idCliente);
  }

  getDataFilter(){
    return this.repo.getDataFilter()
  }


  getCuotasById(idCuentaPorCobrar: number){
    return this.repo.getCuotasById(idCuentaPorCobrar)
  }


}
