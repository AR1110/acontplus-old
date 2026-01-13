import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { UserCustomerRoleRepository } from '@modules/config/data/repositories/user-customer-role.repository';
import { ListUserCustomerRoleMapper } from './list-user-customer-role.mapper';
import { UserCustomerRole } from '@modules/config/data/models/user-customer/user-customer-role.model';
import { ListAccessUserCustomerRoleMapper } from '@modules/config/data/user-customer-role/list-access-user-customer-role.mapper';

@Injectable({
  providedIn: 'root',
})
export class UserCustomerRoleRepositoryImpl implements UserCustomerRoleRepository {
  listAccess(params: Partial<UserCustomerRole>): Observable<any> {
    const json = ListAccessUserCustomerRoleMapper.toJson(params);
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => ListAccessUserCustomerRoleMapper.fromJson(response)));
  }
  updateAccess(parameters: any): Observable<ApiResponseLegacy> {
    return this._http.put<ApiResponseLegacy>(`${this._url}${parameters.userRoleId}`, {
      data: parameters.data,
    });
  }

  list<T>(parameters: T) {
    return this._http
      .get(`${this._url}?json=${ListUserCustomerRoleMapper.toJson(parameters)}`)
      .pipe(map((response) => ListUserCustomerRoleMapper.fromJson(response)));
  }

  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER_ROLE}`;
  private _http = inject(HttpClient);
}
