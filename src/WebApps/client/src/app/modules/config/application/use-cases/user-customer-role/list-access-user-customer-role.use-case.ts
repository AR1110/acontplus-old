import { Injectable, inject } from '@angular/core';
import { BaseUseCase } from '@core/base-use-case';
import { UserCustomerRoleRepository } from '@modules/config/domain/repositories/user-customer-role.repository';
import {
  UserCustomerRole,
  UserCustomerRoleAccessResponse,
} from '@modules/config/domain/models/user-customer/user-customer-role.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListAccessUserCustomerRoleUseCase
  implements BaseUseCase<UserCustomerRoleAccessResponse, Partial<UserCustomerRole>>
{
  private repo = inject(UserCustomerRoleRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  execute(params: Partial<UserCustomerRole>): Observable<UserCustomerRoleAccessResponse> {
    return this.repo.listAccess(params);
  }
}
