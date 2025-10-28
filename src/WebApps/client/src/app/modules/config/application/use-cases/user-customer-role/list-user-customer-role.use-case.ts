import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserCustomerRoleRepository } from '@modules/config/domain/repositories/user-customer-role.repository';
import { UserCustomerRoleResponse } from '@modules/config/domain/models/user-customer/user-customer-role.model';

@Injectable({
  providedIn: 'root',
})
export class ListUserCustomerRoleUseCase implements BaseUseCase<UserCustomerRoleResponse, any> {
  constructor(private repo: UserCustomerRoleRepository) {}

  execute(params: any) {
    return this.repo.list(params);
  }
}
