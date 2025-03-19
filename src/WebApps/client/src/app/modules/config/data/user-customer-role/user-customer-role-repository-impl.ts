import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable} from 'rxjs';
import {CONFIG_PATHS} from "@modules/config/enums/config.enums";
import {UserCustomerRepository} from "@modules/config/domain/repositories/user-customer.repository";
import {ListUserCustomerMapper} from "@modules/config/data/user-customer/list-user-customer.mapper";
import {ApiResponse} from '@core/models/api-response';
import {UserCustomerDataForm,
  UserCustomerParamsUpdate
} from '@modules/config/domain/models/user-customer/user-customer.model';
import {GetUserCustomerFormDataMapper} from "@modules/config/data/user-customer/get-user-customer-form-data.mapper";
import {UserCustomerRoleRepository} from "@modules/config/domain/repositories/user-customer-role.repository";
import { ListUserCustomerRoleMapper } from './list-user-customer-role.mapper';

@Injectable({
  providedIn: 'root',
})
export class UserCustomerRoleRepositoryImpl implements UserCustomerRoleRepository {
      dataForm(): Observable<UserCustomerDataForm> {

        const json = JSON.stringify(GetUserCustomerFormDataMapper.toJson());
        return this._http.get(`${this._url}?json=${json}`).pipe(
          map((response)=>GetUserCustomerFormDataMapper.fromJson(response))
        )
    }
      update(parameters: UserCustomerParamsUpdate): Observable<ApiResponse> {
        return this._http.put<ApiResponse>(`${this._url}${parameters.id}`, { data : parameters.data})
    }
      create<T>(parameters: T)  {
       return this._http.post<ApiResponse>(`${this._url}`, {data: parameters})
    }

    list<T>(parameters: T)  {
      return this._http
        .get(`${this._url}?json=${ListUserCustomerRoleMapper.toJson(parameters)}`)
        .pipe(
          map((response) => ListUserCustomerRoleMapper.fromJson(response))
        );
   }


  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER_ROLE}`;
  private _http = inject(HttpClient);
}
