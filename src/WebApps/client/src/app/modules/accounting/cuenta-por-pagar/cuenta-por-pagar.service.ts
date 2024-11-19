
import { inject, Injectable } from '@angular/core';
import { CuentaPorPagarValidator } from './cuenta-por-pagar.validator';
import { ToasterService } from '@core/services/toaster.service';
import { fetchLimitUtil } from '@shared/utils/fetch-limit.util';
import { CuentaPorPagarRepository } from './data/cuenta-por-pagar.repository';

@Injectable({
  providedIn: 'root'
})
export class CuentaPorPagarService {
  private readonly cuentaPorPagarRepo = inject(CuentaPorPagarRepository);
  private readonly tS = inject(ToasterService)

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
    let [error, data] = CuentaPorPagarValidator.validarCamposCuota(obj);
    if(error){
      throw new Error(error);
    }
    return this.cuentaPorPagarRepo.generarCuota(data)

  }

  validarCamposActualizarCuota<T>(obj:T){
    return CuentaPorPagarValidator.validarCamposActualizarCuota(obj as any);
  }

  actualizarCuotas = fetchLimitUtil(<T>(idCuentaPorPagar: number, obj:T) => this.cuentaPorPagarRepo.actualizarCuotas( idCuentaPorPagar, obj))

}
