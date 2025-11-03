import { Injectable, inject } from '@angular/core';
import { SriCustomerRepository } from '@customer/domain/repositories/sri-customer.repository';

@Injectable({
  providedIn: 'root',
})
export class SriCustomerUseCase {
  private repo = inject(SriCustomerRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  search(codigoIdentificacion: string, id: string) {
    return this.repo.search(codigoIdentificacion, id);
  }
  searchByRuc(obj: string) {
    return this.repo.searchByRuc(obj);
  }

  searchByCedula(obj: string) {
    return this.repo.searchByCedula(obj);
  }
}
