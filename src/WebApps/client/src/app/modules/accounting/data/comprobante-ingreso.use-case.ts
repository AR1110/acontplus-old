import { Injectable, inject } from '@angular/core';
import { ComprobanteIngresoRepository } from '@accounting/data/repositories/comprobante-ingreso-repository';

@Injectable({
  providedIn: 'root',
})
export class ComprobanteIngresoUseCase {
  private repo = inject(ComprobanteIngresoRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getDataFilter() {
    return this.repo.getDataFilter();
  }

  getAll<T>(obj: T) {
    return this.repo.getAll(obj);
  }

  create<T>(data: T) {
    return this.repo.create(data);
  }

  // update<T>(id: number, infrastructure: T) {
  //   return this.repo.update(id, infrastructure)
  // }
  //
  // delete(id: number) {
  //   return this.repo.delete(id)
  // }
}
