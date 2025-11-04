import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserCustomerResponse } from '@modules/config/domain/models/user-customer/user-customer.model';
import { UserCustomerRepository } from '@modules/config/domain/repositories/user-customer.repository';

@Injectable({
  providedIn: 'root',
})
export class ListUserCustomerUseCase implements BaseUseCase<UserCustomerResponse, any> {
  private repo = inject(UserCustomerRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any) {
    return this.repo.list(params);
  }
}
