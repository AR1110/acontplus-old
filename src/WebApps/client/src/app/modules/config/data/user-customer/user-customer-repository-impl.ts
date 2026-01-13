import {
  UserCustomer,
  UserCustomerDataForm,
} from '@modules/config/data/models/user-customer/user-customer.model';
import { GetUserCustomerFormDataMapper } from '@modules/config/data/user-customer/get-user-customer-form-data.mapper';
import { UserCustomerRepository } from '@modules/config/data/repositories/user-customer.repository';
import { ListUserCustomerMapper } from '@modules/config/data/user-customer/list-user-customer.mapper';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserCustomerRepositoryImpl implements UserCustomerRepository {
  dataForm(): Observable<UserCustomerDataForm> {
    const json = JSON.stringify(GetUserCustomerFormDataMapper.toJson());
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => GetUserCustomerFormDataMapper.fromJson(response)));
  }
  update(data: UserCustomer): Observable<ApiResponseLegacy> {
    return this._http.put<ApiResponseLegacy>(`${this._url}${data.id}`, data);
  }
  create<T>(parameters: T) {
    return this._http.post<ApiResponseLegacy>(`${this._url}`, parameters);
  }

  list<T>(parameters: T) {
    return this._http
      .get(`${this._url}?json=${ListUserCustomerMapper.toJson(parameters)}`)
      .pipe(map((response) => ListUserCustomerMapper.fromJson(response)));
  }

  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER}`;
  private _http = inject(HttpClient);
}
