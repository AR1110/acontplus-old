import { Injectable, inject } from '@angular/core';
import { MassiveTaxRepository } from '@inventory/domain/repositories/massive-tax.repository';

@Injectable({
  providedIn: 'root',
})
export class MassiveTaxUseCase {
  private repo = inject(MassiveTaxRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getAll<T>(obj: T) {
    return this.repo.getAll(obj);
  }

  getDataForm() {
    return this.repo.getDataForm();
  }

  put<T>(data: T) {
    return this.repo.put(data);
  }

  getQuantityProductByTaxId<T>(obj: T) {
    return this.repo.getQuantityProductByTaxId(obj);
  }
}
