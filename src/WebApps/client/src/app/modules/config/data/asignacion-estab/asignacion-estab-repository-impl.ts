import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { AsignacionEstabRepository } from '@modules/config/data/repositories/asignacion-estab.repository';
import { ListAsignacionEstabMapper } from './list-asignacion-estab.mapper';
import { AsignacionEstabList } from '@modules/config/data/models/user-customer/asignacion-estab.model';

@Injectable({
  providedIn: 'root',
})
export class AsignacionEstabRepositoryImpl implements AsignacionEstabRepository {
  update(parameters: Partial<AsignacionEstabList>): Observable<ApiResponseLegacy> {
    return this._http.put<ApiResponseLegacy>(`${this._url}${parameters.idEstab_Asig}`, {});
  }
  create<T>(parameters: T) {
    return this._http.post<ApiResponseLegacy>(`${this._url}`, { data: parameters });
  }

  list<T>(parameters: T) {
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${ListAsignacionEstabMapper.toJson(parameters)}`)
      .pipe(map((response) => ListAsignacionEstabMapper.fromJson(response)));
  }

  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER_ROLE_ESTAB}`;
  private _http = inject(HttpClient);
}
