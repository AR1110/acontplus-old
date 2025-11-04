import { Injectable, inject } from '@angular/core';
import { ControlCajaRepository } from '@accounting/caja/domain/control-caja.repository';

@Injectable({
  providedIn: 'root',
})
export class ControlCajaUseCase {
  private repo = inject(ControlCajaRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getAll<T>(obj: T) {
    return this.repo.getAll(obj);
  }

  getDataFilter() {
    return this.repo.getDataFilter();
  }

  getDataForm() {
    return this.repo.getDataForm();
  }

  getArqueoCaja(id: number) {
    return this.repo.getArqueoCaja(id);
  }

  getDataFormCashboxClose() {
    return this.repo.getDataFormCashboxClose();
  }

  post<T>(data: T) {
    return this.repo.post(data);
  }

  put<T>(id: number, data: T) {
    return this.repo.put(id, data);
  }
}
