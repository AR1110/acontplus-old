import { Injectable } from "@angular/core";
import {ComprobanteEgresoRepository} from "@accounting/core/repositories/comprobante-egreso.repository";


@Injectable({
  providedIn: 'root'
})

export class GetComprobanteEgresoUsecase {
  constructor(private repo: ComprobanteEgresoRepository) {}

   getCuotasByIdCuentaPorPagar(idCuentaPorPagar:number) {
    return this.repo.getCuotasByIdCuentaPorPagar(idCuentaPorPagar);
   };
  getDataFormPago(idProveedor:number) {
    return this.repo.getDataFormPago(idProveedor);
  }
   post<T>(obj:T) {
    return this.repo.post<T>(obj);
   }
}
