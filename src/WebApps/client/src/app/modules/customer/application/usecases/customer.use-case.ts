import { Injectable } from '@angular/core';
import { AnticipoRepository } from '@accounting/core/repositories/anticipo.repository';
import { CompanyCustomerRepository } from '@company-customer/domain/company-customer.repository';
import { SupplierRepository } from '@customer/domain/repositories/supplier.repository';
import { CustomerRepository } from '@customer/domain/repositories/customer.repository';

@Injectable({
  providedIn: 'root',
})
export class CustomerUseCase {
  constructor(private repo: CustomerRepository) {}

  getAll<T>(obj: T) {
    return this.repo.getAll(obj);
  }
}
