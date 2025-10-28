import { Injectable } from '@angular/core';
import { MassiveTaxRepository } from '@inventory/domain/repositories/massive-tax.repository';

@Injectable({
  providedIn: 'root',
})
export class MassiveTaxUseCase {
  constructor(private repo: MassiveTaxRepository) {}

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
