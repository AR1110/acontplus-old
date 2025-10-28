import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserCustomerPermissionRepository } from '@modules/config/domain/repositories/user-customer-permission.repository';
import { ApiResponse } from '@core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class CreateUserCustomerPermissionUseCase implements BaseUseCase<ApiResponse, any> {
  constructor(private repo: UserCustomerPermissionRepository) {}

  execute(params: any) {
    return this.repo.create(params);
  }
}
