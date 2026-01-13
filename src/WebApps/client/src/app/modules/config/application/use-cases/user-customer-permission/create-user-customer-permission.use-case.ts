import { Injectable } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserCustomerPermissionRepository } from '@modules/config/data/repositories/user-customer-permission.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class CreateUserCustomerPermissionUseCase implements BaseUseCase<ApiResponseLegacy, any> {
  constructor(private repo: UserCustomerPermissionRepository) {}

  execute(params: any) {
    return this.repo.create(params);
  }
}
