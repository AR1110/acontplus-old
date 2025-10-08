import { Injectable } from '@angular/core';
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
  constructor(private repo: UserCustomerRoleRepository) {}

  execute(params: Partial<UserCustomerRole>): Observable<UserCustomerRoleAccessResponse> {
    return this.repo.listAccess(params);
  }
}
