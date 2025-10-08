import { FloorRepository } from '@restaurant/domain/repositories/floor.repository';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FloorUseCase {
  constructor(private repo: FloorRepository) {}

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
