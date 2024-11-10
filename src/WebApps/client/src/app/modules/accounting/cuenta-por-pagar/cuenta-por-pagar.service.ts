
import { inject, Injectable } from '@angular/core';
import { CuentaPorPagarRepository } from './cuenta-por-pagar.repository';
import { CuentaPorPagarValidator } from './cuenta-por-pagar.validator';

@Injectable({
  providedIn: 'root'
})
export class CuentaPorPagarService {
  private readonly cuentaPorPagarRepo = inject(CuentaPorPagarRepository)

  getDataFilter(){
     return this.cuentaPorPagarRepo.getDataFilter()
  }

  getAll<T>(obj:T){
     return this.cuentaPorPagarRepo.getAll(obj)
  }

  getCuotasData(){
    return this.cuentaPorPagarRepo.getCuotasData()
  }
  getCuotasConfigByIdCuentaPorPagar(idCuentaPorPagar:number){
    return this.cuentaPorPagarRepo.getCuotasConfigByIdCuentaPorPagar(idCuentaPorPagar)
  }

  getHistorialMovimientoByIdCuentaPorPagar(idCuentaPorPagar:number){
     return this.cuentaPorPagarRepo.getHistorialMovimientoByIdCuentaPorPagar(idCuentaPorPagar)
  }

  generarCuota(obj:any){
    let [error, data] = CuentaPorPagarValidator.generarCuotaCamposValido(obj);
    if(error){
      throw new Error(error);
    }
    return this.cuentaPorPagarRepo.generarCuota(data)

  }



}
