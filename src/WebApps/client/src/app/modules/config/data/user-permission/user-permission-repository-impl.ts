import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { UserPermissionRepository } from '@modules/config/data/repositories/user-permission.repository';
import { CreateUserPermissionMapper } from '@modules/config/data/user-permission/create-user-permission.mapper';
import { map } from 'rxjs';
import { ListUserPermissionMapper } from './list-user-permission.mapper';

@Injectable({
  providedIn: 'root',
})
export class UserPermissionRepositoryImpl implements UserPermissionRepository {
  update<T>(parameters: T) {
    //    const infrastructure = CreateUserPermissionMapper.toJson(parameters)
    return this._http.put<ApiResponseLegacy>(`${this._url}`, { data: parameters });
  }
  create<T>(parameters: T) {
    const data = CreateUserPermissionMapper.toJson(parameters);
    return this._http.post<ApiResponseLegacy>(`${this._url}`, { data });
  }

  list<T>(parameters: T) {
    const json = JSON.stringify(ListUserPermissionMapper.toJson(parameters));
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => ListUserPermissionMapper.fromJson(response)));
  }
  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_PERMISSION_CONFIG}`;
  private _http = inject(HttpClient);
}
