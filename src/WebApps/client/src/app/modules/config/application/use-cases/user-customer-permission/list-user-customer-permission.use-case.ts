import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserCustomerPermissionResponse } from '@modules/config/domain/models/user-customer/user-customer-permission.model';
import { UserCustomerPermissionRepository } from '@modules/config/domain/repositories/user-customer-permission.repository';

@Injectable({
  providedIn: 'root',
})
export class ListUserCustomerPermissionUseCase
  implements BaseUseCase<UserCustomerPermissionResponse, any>
{
  constructor(private repo: UserCustomerPermissionRepository) {}

  execute(params: any) {
    return this.repo.list(params);
  }
}
