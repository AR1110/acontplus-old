import { Injectable, inject } from '@angular/core';
import { SupportDetailRepository } from '@mechanical/domain/repositories/support-detail.repository';

@Injectable({
  providedIn: 'root',
})
export class SupportDetailUseCase {
  private repo = inject(SupportDetailRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getId(id: number, loader?: boolean) {
    return this.repo.getId(id, loader);
  }

  post<T>(data: T) {
    return this.repo.post(data);
  }
}
