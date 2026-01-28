import { Injectable, inject } from '@angular/core';
import { MovimientoCajaRepository } from '@accounting/data/repositories/movimiento-caja.repository';

@Injectable({
  providedIn: 'root',
})
export class MovimientoCajaUseCase {
  private repo = inject(MovimientoCajaRepository);

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

  create<T>(data: T) {
    return this.repo.create(data);
  }

  update<T>(id: number, data: T) {
    return this.repo.update(id, data);
  }

  delete(id: number) {
    return this.repo.delete(id);
  }
}
