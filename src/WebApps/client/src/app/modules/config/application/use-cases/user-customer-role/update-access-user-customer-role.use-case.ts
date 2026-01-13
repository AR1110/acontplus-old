import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserCustomerRoleRepository } from '@modules/config/data/repositories/user-customer-role.repository';

import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class UpdateAccessUserCustomerRoleUseCase implements BaseUseCase<ApiResponseLegacy, any> {
  private repo = inject(UserCustomerRoleRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any) {
    return this.repo.updateAccess(params);
  }
}
