import { Injectable, inject } from '@angular/core';
import { InventarioModeloRepository } from '@inventory/domain/repositories/inventario-modelo.repository';

@Injectable({
  providedIn: 'root',
})
export class InventarioModeloUseCase {
  private repo = inject(InventarioModeloRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getAll<T>(obj: T) {
    return this.repo.getAll(obj);
  }

  updateStatus(idModelo: number) {
    return this.repo.updateStatus(idModelo);
  }
  post<T>(data: T) {
    return this.repo.post(data);
  }

  put<T>(id: number, data: T) {
    return this.repo.put(id, data);
  }
}
