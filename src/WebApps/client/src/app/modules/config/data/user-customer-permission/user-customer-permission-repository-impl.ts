import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { UserCustomerPermissionRepository } from '@modules/config/data/repositories/user-customer-permission.repository';
import { ListUserCustomerPermissionMapper } from './list-user-customer-permission.mapper';
import { CreateUserCustomerPermissionMapper } from '@modules/config/data/user-customer-permission/create-user-customer-permission.mapper';

@Injectable({
  providedIn: 'root',
})
export class UserCustomerPermissionRepositoryImpl implements UserCustomerPermissionRepository {
  update<T>(parameters: T) {
    //    const infrastructure = CreateUserCustomerPermissionMapper.toJson(parameters)
    return this._http.put<ApiResponseLegacy>(`${this._url}`, { data: parameters });
  }
  create<T>(parameters: T) {
    const data = CreateUserCustomerPermissionMapper.toJson(parameters);
    return this._http.post<ApiResponseLegacy>(`${this._url}`, { data });
  }

  list<T>(parameters: T) {
    const json = JSON.stringify(ListUserCustomerPermissionMapper.toJson(parameters));
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => ListUserCustomerPermissionMapper.fromJson(response)));
  }
  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER_PERMISSION}`;
  private _http = inject(HttpClient);
}
