import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserRoleRepository } from '@modules/config/data/repositories/user-role.repository';

import { ApiResponseLegacy } from '@core/models/api-response-legacy';

@Injectable({
  providedIn: 'root',
})
export class UpdateAccessUserRoleUseCase implements BaseUseCase<ApiResponseLegacy, any> {
  private repo = inject(UserRoleRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any) {
    return this.repo.updateAccess(params);
  }
}
