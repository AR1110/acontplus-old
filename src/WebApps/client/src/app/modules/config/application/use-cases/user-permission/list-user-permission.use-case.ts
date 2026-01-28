import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserPermissionResponse } from '@modules/config/data/models/user/user-permission.model';
import { UserPermissionRepository } from '@modules/config/data/repositories/user-permission.repository';

@Injectable({
  providedIn: 'root',
})
export class ListUserPermissionUseCase implements BaseUseCase<UserPermissionResponse, any> {
  private repo = inject(UserPermissionRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any) {
    return this.repo.list(params);
  }
}
