import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserRole, UserRoleAccessResponse } from '@modules/config/data/models/user/user-role.model';
import { UserRoleRepository } from '@modules/config/data/repositories/user-role.repository';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListAccessUserRoleUseCase implements BaseUseCase<
  UserRoleAccessResponse,
  Partial<UserRole>
> {
  private repo = inject(UserRoleRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: Partial<UserRole>): Observable<UserRoleAccessResponse> {
    return this.repo.listAccess(params);
  }
}
