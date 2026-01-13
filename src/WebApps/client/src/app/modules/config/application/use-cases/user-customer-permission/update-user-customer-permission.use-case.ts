import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserCustomerPermissionRepository } from '@modules/config/data/repositories/user-customer-permission.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserCustomerPermissionUseCase implements BaseUseCase<ApiResponseLegacy, any> {
  private repo = inject(UserCustomerPermissionRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any) {
    return this.repo.update(params);
  }
}
