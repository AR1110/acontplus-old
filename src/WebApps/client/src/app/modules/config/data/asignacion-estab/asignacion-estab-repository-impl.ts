import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable} from 'rxjs';
import {CONFIG_PATHS} from "@modules/config/enums/config.enums";
import {ApiResponse} from '@core/models/api-response';
import {UserCustomerDataForm,
  UserCustomerParamsUpdate
} from '@modules/config/domain/models/user-customer/user-customer.model';
import {GetUserCustomerFormDataMapper} from "@modules/config/data/user-customer/get-user-customer-form-data.mapper";

import {AsignacionEstabRepository} from "@modules/config/domain/repositories/asignacion-estab.repository";
import { ListAsignacionEstabMapper } from './list-asignacion-estab.mapper';

@Injectable({
  providedIn: 'root',
})
export class AsignacionEstabRepositoryImpl implements AsignacionEstabRepository {
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
        .get<ApiResponse>(`${this._url}?json=${ListAsignacionEstabMapper.toJson(parameters)}`)
        .pipe(
          map((response) => ListAsignacionEstabMapper.fromJson(response))
        );
   }

  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER_ROLE_ESTAB}`;
  private _http = inject(HttpClient);
}
