import { Injectable, inject } from '@angular/core';
import { ResumenContableRepository } from '@accounting/data/repositories/resumen-contable.repository';

@Injectable({
  providedIn: 'root',
})
export class ResumenContableUseCase {
  private repo = inject(ResumenContableRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}
  getDataFilter() {
    return this.repo.getDataFilter();
  }
}
