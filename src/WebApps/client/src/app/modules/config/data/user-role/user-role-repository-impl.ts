import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { UserRole } from '@modules/config/data/models/user/user-role.model';
import { UserRoleRepository } from '@modules/config/data/repositories/user-role.repository';
import { ListAccessUserRoleMapper } from '@modules/config/data/user-role/list-access-user-role.mapper';
import { map, Observable } from 'rxjs';
import { ListUserRoleMapper } from './list-user-role.mapper';

@Injectable({
  providedIn: 'root',
})
export class UserRoleRepositoryImpl implements UserRoleRepository {
  listAccess(params: Partial<UserRole>): Observable<any> {
    const json = ListAccessUserRoleMapper.toJson(params);
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => ListAccessUserRoleMapper.fromJson(response)));
  }
  updateAccess(parameters: any): Observable<ApiResponseLegacy> {
    return this._http.put<ApiResponseLegacy>(`${this._url}${parameters.userRoleId}`, {
      data: parameters.data,
    });
  }

  list<T>(parameters: T) {
    return this._http
      .get(`${this._url}?json=${ListUserRoleMapper.toJson(parameters)}`)
      .pipe(map((response) => ListUserRoleMapper.fromJson(response)));
  }

  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_ROLE}`;
  private _http = inject(HttpClient);
}
