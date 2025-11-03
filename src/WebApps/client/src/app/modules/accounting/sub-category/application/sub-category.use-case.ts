import { Injectable, inject } from '@angular/core';
import { SubCategoryRepository } from '@accounting/sub-category/domain/sub-category.repository';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryUseCase {
  private repo = inject(SubCategoryRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getAll<T>(obj: T) {
    return this.repo.getAll(obj);
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
