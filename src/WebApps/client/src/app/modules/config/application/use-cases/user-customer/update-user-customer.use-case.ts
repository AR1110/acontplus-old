import {inject, Injectable} from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import { Observable } from 'rxjs';
import {ApiResponse} from "@core/models/api-response";
import {UserCustomerParamsUpdate} from "@modules/config/domain/models/user-customer/user-customer.model";
import {UserCustomerRepository} from "@modules/config/domain/repositories/user-customer.repository";

@Injectable({
  providedIn: 'root',
})
export class UpdateUserCustomerUseCase implements BaseUseCase<ApiResponse, UserCustomerParamsUpdate> {
  private repo = inject(UserCustomerRepository)
    execute(params: UserCustomerParamsUpdate): Observable<ApiResponse > {
       return this.repo.update(params)
    }

}
