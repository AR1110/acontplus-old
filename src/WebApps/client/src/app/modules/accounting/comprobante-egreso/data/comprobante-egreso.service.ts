import { inject, Injectable } from "@angular/core";
import { ComprobanteEgresoRepository } from "@accounting/comprobante-egreso/data/comprobante-egreso.repository";
import {fetchLimitUtil} from "@shared/utils/fetch-limit.util";


@Injectable({
  providedIn: 'root'
})
export class ComprobanteEgresoService {

  private comprobanteEgresoRepository = inject(ComprobanteEgresoRepository);


  getCuotasByIdCuentaPorPagar(idCuentaPorPagar: number) {
    return this.comprobanteEgresoRepository.getCuotasByIdCuentaPorPagar(idCuentaPorPagar);
  }

  getDatForm(idProveedor: number) {
    return this.comprobanteEgresoRepository.getDataFormPago(idProveedor)
  }



  post = fetchLimitUtil(<T>(data: T) => this.comprobanteEgresoRepository.post(data));

}
