import {  Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import {UserCustomerRoleRepository} from "@modules/config/domain/repositories/user-customer-role.repository";

import {ApiResponse} from "@core/models/api-response";

@Injectable({
  providedIn: 'root',
})
export class UpdateAccessUserCustomerRoleUseCase implements BaseUseCase<ApiResponse, any>{
  constructor(private repo: UserCustomerRoleRepository) {
  }

  execute(params: any)  {
       return this.repo.updateAccess(params)
    }


}
