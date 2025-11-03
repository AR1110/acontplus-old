import { Injectable, inject } from '@angular/core';
import { TagRepository } from '@inventory/domain/repositories/tag.repository';

@Injectable({
  providedIn: 'root',
})
export class TagUseCase {
  private repo = inject(TagRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

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
