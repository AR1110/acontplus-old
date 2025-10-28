import { TableRepository } from '@restaurant/domain/repositories/table.repository';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TableUseCase {
  constructor(private repo: TableRepository) {}

  remove(id: number) {
    return this.repo.remove(id);
  }

  post<T>(data: T) {
    return this.repo.post(data);
  }

  put<T>(id: number, data: T) {
    return this.repo.put(id, data);
  }
}
