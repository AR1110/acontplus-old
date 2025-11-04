import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserCustomerPermissionResponse } from '@modules/config/domain/models/user-customer/user-customer-permission.model';
import { UserCustomerPermissionRepository } from '@modules/config/domain/repositories/user-customer-permission.repository';

@Injectable({
  providedIn: 'root',
})
export class ListUserCustomerPermissionUseCase
  implements BaseUseCase<UserCustomerPermissionResponse, any>
{
  private repo = inject(UserCustomerPermissionRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any) {
    return this.repo.list(params);
  }
}
