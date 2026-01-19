import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { User, UserDataForm } from '@modules/config/data/models/user/user.model';
import { UserRepository } from '@modules/config/data/repositories/user.repository';
import { GetUserFormDataMapper } from '@modules/config/data/user/get-user-form-data.mapper';
import { ListUserMapper } from '@modules/config/data/user/list-user.mapper';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserRepositoryImpl implements UserRepository {
  dataForm(): Observable<UserDataForm> {
    const json = JSON.stringify(GetUserFormDataMapper.toJson());
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => GetUserFormDataMapper.fromJson(response)));
  }
  update(data: User): Observable<ApiResponseLegacy> {
    return this._http.put<ApiResponseLegacy>(`${this._url}${data.id}`, data);
  }
  create<T>(parameters: T) {
    return this._http.post<ApiResponseLegacy>(`${this._url}`, parameters);
  }

  list<T>(parameters: T) {
    return this._http
      .get(`${this._url}?json=${ListUserMapper.toJson(parameters)}`)
      .pipe(map((response) => ListUserMapper.fromJson(response)));
  }

  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER}`;
  private _http = inject(HttpClient);
}
