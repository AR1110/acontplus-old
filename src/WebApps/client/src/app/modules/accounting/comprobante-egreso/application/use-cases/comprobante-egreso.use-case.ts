import { Injectable, inject } from '@angular/core';
import { ComprobanteEgresoRepository } from '@accounting/comprobante-egreso/domain/comprobante-egreso.repository';

@Injectable({
  providedIn: 'root',
})
export class ComprobanteEgresoUseCase {
  private repo = inject(ComprobanteEgresoRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getCuotasByIdCuentaPorPagar(idCuentaPorPagar: number) {
    return this.repo.getCuotasByCuentaPorPagarId(idCuentaPorPagar);
  }

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
