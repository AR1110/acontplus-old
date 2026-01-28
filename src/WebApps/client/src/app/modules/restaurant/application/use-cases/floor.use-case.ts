import { FloorRepository } from '@restaurant/data/repositories/floor.repository';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FloorUseCase {
  private repo = inject(FloorRepository);

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
