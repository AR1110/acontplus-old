import { Injectable } from '@angular/core';
import { SupportDetailRepository } from '@mechanical/domain/repositories/support-detail.repository';

@Injectable({
  providedIn: 'root',
})
export class SupportDetailUseCase {
  constructor(private repo: SupportDetailRepository) {}

  getId(id: number, loader?: boolean) {
    return this.repo.getId(id, loader);
  }

  post<T>(data: T) {
    return this.repo.post(data);
  }
}
