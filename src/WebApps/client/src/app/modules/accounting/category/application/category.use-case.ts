import { Injectable } from '@angular/core';
import { CategoryRepository } from '@accounting/category/domain/category.repository';

@Injectable({
  providedIn: 'root',
})
export class CategoryUseCase {
  constructor(private repo: CategoryRepository) {}
  get<T>(params: T) {
    return this.repo.get(params);
  }
  delete(id: number) {
    return this.repo.delete(id);
  }
  post<T>(data: T) {
    return this.repo.post(data);
  }
  put<T>(id: number, data: T) {
    return this.repo.put(id, data);
  }
}
