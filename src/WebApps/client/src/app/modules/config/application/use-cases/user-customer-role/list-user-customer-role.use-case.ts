import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserCustomerRoleRepository } from '@modules/config/domain/repositories/user-customer-role.repository';
import { UserCustomerRoleResponse } from '@modules/config/domain/models/user-customer/user-customer-role.model';

@Injectable({
  providedIn: 'root',
})
export class ListUserCustomerRoleUseCase implements BaseUseCase<UserCustomerRoleResponse, any> {
  private repo = inject(UserCustomerRoleRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any) {
    return this.repo.list(params);
  }
}
