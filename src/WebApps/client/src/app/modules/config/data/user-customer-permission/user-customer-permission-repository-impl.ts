import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import {CONFIG_PATHS} from "@modules/config/domain/enums/config.enums";
import {ApiResponse} from '@core/models/api-response';
import {
  UserCustomerPermissionRepository
} from "@modules/config/domain/repositories/user-customer-permission.repository";
import { ListUserCustomerPermissionMapper } from './list-user-customer-permission.mapper';
import {
  CreateUserCustomerPermissionMapper
} from "@modules/config/data/user-customer-permission/create-user-customer-permission.mapper";

@Injectable({
  providedIn: 'root',
})
export class UserCustomerPermissionRepositoryImpl implements UserCustomerPermissionRepository {

      update<T>(parameters: T){
    //    const data = CreateUserCustomerPermissionMapper.toJson(parameters)
        return this._http.put<ApiResponse>(`${this._url}`, { data: parameters })
    }
      create<T>(parameters: T)  {
        const data = CreateUserCustomerPermissionMapper.toJson(parameters)
       return this._http.post<ApiResponse>(`${this._url}`, {data})
    }

    list<T>(parameters: T)  {
        let json = JSON.stringify(
          ListUserCustomerPermissionMapper.toJson(parameters)
        )
      return this._http
        .get(`${this._url}?json=${json}`)
        .pipe(
          map((response) => ListUserCustomerPermissionMapper.fromJson(response))
        );
   }
  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER_PERMISSION}`;
  private _http = inject(HttpClient);
}
