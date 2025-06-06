import {Injectable} from "@angular/core";
import {ComprobanteEgresoRepository} from "@accounting/domain/repositories/comprobante-egreso.repository";


@Injectable({
  providedIn: 'root'
})

export class ComprobanteEgresoUseCase {
  constructor(private repo: ComprobanteEgresoRepository) {
  }

  getCuotasByIdCuentaPorPagar(idCuentaPorPagar: number) {
    return this.repo.getCuotasByCuentaPorPagarId(idCuentaPorPagar);
  };

  getDataFormPago(idProveedor: number) {
    return this.repo.getFormaPagoData(idProveedor);
  }

  getDataFilter() {
    return this.repo.getFilterData();
  }

  post<T>(obj: T) {
    return this.repo.create<T>(obj);
  }
}
