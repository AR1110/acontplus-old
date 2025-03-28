import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { map, Observable} from 'rxjs';
import {CONFIG_PATHS} from "@modules/config/enums/config.enums";
import {SolicitudAutorizacionRepository} from "@modules/config/domain/repositories/solicitud-autorizacion.repository";
import {
  ListSolicitudAutorizacionMapper
} from "@modules/config/data/solicitud-autorizacion/list-solicitud-autorizacion.mapper";
import {SolicitudAutorizacionFilterResponse} from '@modules/config/domain/models/solicitud-autorizacion.model';
import {
  FilterSolicitudAutorizacionMapper
} from "@modules/config/data/solicitud-autorizacion/filter-solicitud-autorizacion.mapper";
import {ApiResponse} from "@core/models/api-response";

@Injectable({
  providedIn: 'root',
})
export class SolicitudAutorizacionRepositoryImpl implements SolicitudAutorizacionRepository {
      filter(): Observable<SolicitudAutorizacionFilterResponse> {
        return this._http
          .get<ApiResponse>(`${this._url}?json=${FilterSolicitudAutorizacionMapper.toJson()}`)
          .pipe(
            map((response) => FilterSolicitudAutorizacionMapper.fromJson(response))
          );

    }

    list<T>(parameters: T)  {
      return this._http
        .get<ApiResponse>(`${this._url}?json=${ListSolicitudAutorizacionMapper.toJson(parameters)}`)
        .pipe(
          map((response) => ListSolicitudAutorizacionMapper.fromJson(response))
        );
   }


  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.SOLICITUD_AUTORIZACION}`;
  private _http = inject(HttpClient);
}
