import { Injectable } from '@angular/core';
import { TagRepository } from '@inventory/domain/repositories/tag.repository';

@Injectable({
  providedIn: 'root',
})
export class TagUseCase {
  constructor(private repo: TagRepository) {}

  getAll<T>(obj: T) {
    return this.repo.getAll(obj);
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
