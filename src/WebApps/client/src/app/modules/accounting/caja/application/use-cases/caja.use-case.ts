import { Injectable, inject } from '@angular/core';
import { CajaRepository } from '../../domain/caja.repository';

@Injectable({
  providedIn: 'root',
})
export class CajaUseCase {
  private repo = inject(CajaRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getAll<T>(obj: T) {
    return this.repo.getAll(obj);
  }

  getId(idCaja: number) {
    return this.repo.getId(idCaja);
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
