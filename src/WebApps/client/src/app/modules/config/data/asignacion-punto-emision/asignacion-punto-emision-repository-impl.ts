import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CONFIG_PATHS } from '@modules/config/domain/enums/config.enums';
import { ApiResponse } from '@core/models/api-response';
import { AsignacionPuntoEmisionRepository } from '@modules/config/domain/repositories/asignacion-punto-emision.repository';
import { ListAsignacionPuntoEmisionMapper } from '@modules/config/data/asignacion-punto-emision/list-asignacion-punto-emision.mapper';
import { AsignacionPuntoEmisionList } from '@modules/config/domain/models/user-customer/asignacion-punto-emision.model';

@Injectable({
  providedIn: 'root',
})
export class AsignacionPuntoEmisionRepositoryImpl implements AsignacionPuntoEmisionRepository {
  update(parameters: Partial<AsignacionPuntoEmisionList>): Observable<ApiResponse> {
    return this._http.put<ApiResponse>(`${this._url}${parameters.idPtoEmi_Asig}`, {});
  }
  create<T>(parameters: T) {
    return this._http.post<ApiResponse>(`${this._url}`, { data: parameters });
  }

  list(parameters: Partial<AsignacionPuntoEmisionList>) {
    return this._http
      .get<ApiResponse>(`${this._url}?json=${ListAsignacionPuntoEmisionMapper.toJson(parameters)}`)
      .pipe(map((response) => ListAsignacionPuntoEmisionMapper.fromJson(response)));
  }

  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_CUSTOMER_ROLE_PUNTO_EMISION}`;
  private _http = inject(HttpClient);
}
