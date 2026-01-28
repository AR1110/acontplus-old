import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserRoleResponse } from '@modules/config/data/models/user/user-role.model';
import { UserRoleRepository } from '@modules/config/data/repositories/user-role.repository';

@Injectable({
  providedIn: 'root',
})
export class ListUserRoleUseCase implements BaseUseCase<UserRoleResponse, any> {
  private repo = inject(UserRoleRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: any) {
    return this.repo.list(params);
  }
}
