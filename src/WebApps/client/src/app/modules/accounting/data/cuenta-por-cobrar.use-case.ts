import { Injectable, inject } from '@angular/core';
import { CuentaPorCobrarRepository } from '@accounting/data/repositories/cuenta-por-cobrar.repository';

@Injectable({
  providedIn: 'root',
})
export class CuentaPorCobrarUseCase {
  private repo = inject(CuentaPorCobrarRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getAll<T>(obj: T) {
    return this.repo.getAll(obj);
  }

  getDataForm(idCuentaPorCobrar: number, idCliente: number) {
    return this.repo.getDataForm(idCuentaPorCobrar, idCliente);
  }

  getDataFilter() {
    return this.repo.getDataFilter();
  }

  getCuotasById(idCuentaPorCobrar: number) {
    return this.repo.getCuotasById(idCuentaPorCobrar);
  }
}
