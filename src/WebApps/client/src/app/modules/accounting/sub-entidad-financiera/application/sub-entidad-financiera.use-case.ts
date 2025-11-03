import { Injectable, inject } from '@angular/core';
import { SubEntidadFinancieraRepository } from '@accounting/sub-entidad-financiera/domain/sub-entidad-financiera.repository';

@Injectable({
  providedIn: 'root',
})
export class SubEntidadFinancieraUseCase {
  private repo = inject(SubEntidadFinancieraRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getAll() {
    return this.repo.getAll();
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
