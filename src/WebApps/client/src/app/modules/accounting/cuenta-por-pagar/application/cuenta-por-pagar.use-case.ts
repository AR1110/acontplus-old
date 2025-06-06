import { Injectable } from "@angular/core";
import {CuentaPorPagarRepository} from "@accounting/cuenta-por-pagar/domain/cuenta-por-pagar.repository";

@Injectable({
  providedIn: 'root'
})

export class CuentaPorPagarUseCase {
  constructor(private repo: CuentaPorPagarRepository) {}

  getDataFilter(){
    return this.repo.getDataFilter();
  }
  getAll<T>(obj:T) {
    console.log(obj)
    return this.repo.getAll(obj)
  }

  getCuotasData(){
    return this.repo.getCuotasData();
  }

  getCuotasConfigByIdCuentaPorPagar(idCuentaPorPagar: number){
    return this.repo.getCuotasConfigByIdCuentaPorPagar(idCuentaPorPagar);
  }

  getHistorialMovimientoByIdCuentaPorPagar(idCuentaPorPagar: number){

    return this.repo.getHistorialMovimientoByIdCuentaPorPagar(idCuentaPorPagar)
  }



  generarCuotas<T>(data: T){
    return this.repo.generarCuotas(data)
  }

  actualizarCuotas<T>(data: T){
    return this.repo.generarCuotas(data)
  }
}
