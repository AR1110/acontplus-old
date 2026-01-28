import { TableRepository } from '@restaurant/data/repositories/table.repository';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TableUseCase {
  private repo = inject(TableRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

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
