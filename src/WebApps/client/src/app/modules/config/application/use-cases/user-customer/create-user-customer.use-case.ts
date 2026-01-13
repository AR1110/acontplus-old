import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { UserCustomerRepository } from '@modules/config/data/repositories/user-customer.repository';

@Injectable({
  providedIn: 'root',
})
export class CreateUserCustomerUseCase<T> implements BaseUseCase<ApiResponseLegacy, T> {
  private repo = inject(UserCustomerRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: T) {
    return this.repo.create(params);
  }
}
