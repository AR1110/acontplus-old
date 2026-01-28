import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { SolicitudAutorizacionRepository } from '@modules/config/data/repositories/solicitud-autorizacion.repository';
import { ListSolicitudAutorizacionMapper } from '@modules/config/data/mappers/list-solicitud-autorizacion.mapper';
import {
  SolicitudAutorizacionDetalleList,
  SolicitudAutorizacionFilterResponse,
  SolicitudAutorizacionList,
  SolicitudAutorizacionUpdateParams,
} from '@modules/config/data/models/solicitud-autorizacion.model';
import { FilterSolicitudAutorizacionMapper } from '@modules/config/data/mappers/filter-solicitud-autorizacion.mapper';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ListSolicitudAutorizacionDetalleMapper } from '@modules/config/data/mappers/list-solicitud-autorizacion-detalle.mapper';

@Injectable({
  providedIn: 'root',
})
export class SolicitudAutorizacionHttp implements SolicitudAutorizacionRepository {
  update(parameters: SolicitudAutorizacionUpdateParams): Observable<ApiResponseLegacy> {
    return this._http.put<ApiResponseLegacy>(`${this._url}`, { data: parameters });
  }
  listDetalle(
    parameters: Partial<SolicitudAutorizacionList>,
  ): Observable<SolicitudAutorizacionDetalleList[]> {
    const json = ListSolicitudAutorizacionDetalleMapper.toJson(parameters);

    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => ListSolicitudAutorizacionDetalleMapper.fromJson(response)));
  }
  filter(): Observable<SolicitudAutorizacionFilterResponse> {
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${FilterSolicitudAutorizacionMapper.toJson()}`)
      .pipe(map((response) => FilterSolicitudAutorizacionMapper.fromJson(response)));
  }

  list<T>(parameters: T) {
    return this._http
      .get<ApiResponseLegacy>(
        `${this._url}?json=${ListSolicitudAutorizacionMapper.toJson(parameters)}`,
      )
      .pipe(map((response) => ListSolicitudAutorizacionMapper.fromJson(response)));
  }

  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.SOLICITUD_AUTORIZACION}`;
  private _http = inject(HttpClient);
}
