import { CompanyCustomerRepository } from '@company-customer/domain/company-customer.repository';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CompanyCustomerUseCase {
  private repo = inject(CompanyCustomerRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getAll<T extends { pageIndex: number; pageSize: number }>(obj: T) {
    return this.repo.getAll(obj);
  }

  checkExistence<T>(params: T) {
    return this.repo.checkExistence(params);
  }

  getId(idCliente: number, loader?: boolean) {
    return this.repo.getId(idCliente, loader);
  }
  search<T extends { textSearch: string }>(obj: T) {
    return this.repo.search(obj);
  }
}
