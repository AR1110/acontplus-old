import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CONFIG_PATHS } from '@modules/config/domain/enums/config.enums';
import { ApiResponse } from '@core/models/api-response';
import { AsignacionBodegaRepository } from '@modules/config/domain/repositories/asignacion-bodega.repository';
import { ListAsignacionBodegaMapper } from '@modules/config/data/asignacion-bodega/list-asignacion-bodega.mapper';
import { AsignacionBodegaList } from '@modules/config/domain/models/user-customer/asignacion-bodega.model';

@Injectable({
  providedIn: 'root',
})
export class AsignacionBodegaRepositoryImpl implements AsignacionBodegaRepository {
  update(parameters: Partial<AsignacionBodegaList>): Observable<ApiResponse> {
    return this._http.put<ApiResponse>(`${this._url}${parameters.idBodeg_Asig}`, {});
  }
  create<T>(parameters: T) {
    return this._http.post<ApiResponse>(`${this._url}`, { data: parameters });
  }

  list(parameters: Partial<AsignacionBodegaList>) {
    return this._http
      .get<ApiResponse>(`${this._url}?json=${ListAsignacionBodegaMapper.toJson(parameters)}`)
      .pipe(map((response) => ListAsignacionBodegaMapper.fromJson(response)));
  }

  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER_ROLE_BODEGA}`;
  private _http = inject(HttpClient);
}
