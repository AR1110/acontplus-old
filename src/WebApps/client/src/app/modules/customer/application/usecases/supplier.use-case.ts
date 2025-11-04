import { Injectable, inject } from '@angular/core';
import { SupplierRepository } from '@customer/domain/repositories/supplier.repository';

@Injectable({
  providedIn: 'root',
})
export class SupplierUseCase {
  private repo = inject(SupplierRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  search<T extends { textSearch: string }>(obj: T) {
    return this.repo.search(obj);
  }
}
