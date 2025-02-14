import { Injectable } from '@angular/core';
import { TransferenciaBodegaRepository } from '@inventory/domain/repositories/transferencia-bodega.repository';

@Injectable({
  providedIn: 'root',
})
export class TransferenciaBodegaUseCase {
  constructor(private repo: TransferenciaBodegaRepository) {}

  getAll<T>(obj: T) {
    return this.repo.getAll(obj);
  }

  getDataFilter() {
    return this.repo.getDataFilter();
  }

  post<T>(data: T) {
    return this.repo.post(data);
  }

  put<T>(id: number, data: T) {
    return this.repo.put(id, data);
  }

  updateStatus(id: number) {
    return this.repo.updateStatus(id);
  }
}
