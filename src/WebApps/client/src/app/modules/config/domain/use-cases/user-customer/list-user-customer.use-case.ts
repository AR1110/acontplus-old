import {  Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import {UserCustomerResponse} from "@modules/config/domain/models/user-customer/user-customer.model";
import {UserCustomerRepository} from "@modules/config/domain/repositories/user-customer.repository";

@Injectable({
  providedIn: 'root',
})
export class ListUserCustomerUseCase implements BaseUseCase<UserCustomerResponse, any> {
  constructor(private repo:UserCustomerRepository) {
  }

  execute(params: any)  {
     return this.repo.list(params)
    }



}
