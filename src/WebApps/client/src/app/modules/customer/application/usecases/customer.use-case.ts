import { inject, Injectable } from '@angular/core';
import { CustomerRepository } from '@customer/domain/repositories/customer.repository';

@Injectable({
  providedIn: 'root',
})
export class CustomerUseCase {
  private readonly repo = inject(CustomerRepository);

  getAll<T>(obj: T) {
    return this.repo.getAll(obj);
  }
}
