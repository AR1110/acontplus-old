import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { UserPermissionRepository } from '@modules/config/data/repositories/user-permission.repository';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserPermissionUseCase implements BaseUseCase<ApiResponseLegacy, any> {
  private repo = inject(UserPermissionRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any) {
    return this.repo.update(params);
  }
}
