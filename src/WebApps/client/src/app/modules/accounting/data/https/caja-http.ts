import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';
import { HttpClient } from '@angular/common/http';
import {map, of} from 'rxjs';
import { CajaRepository } from '@accounting/data/repositories/caja-repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import {FormDataCajaMapper, GetIdCajaMapper, ListCajaMapper} from "@accounting/data/mappers/caja-mapper";

@Injectable({
  providedIn: 'root',
})
export class CajaHttp implements CajaRepository {
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CASHBOX}`;
  private _http = inject(HttpClient);

  getAll<T>(params: T) {
    const json = ListCajaMapper.toJson(params);
    /*return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((res) => ListCajaMapper.fromJson(res)));*/
    return of( {
      data: [
        {
          "idCaja": 627,
          "descripcion": "IVAN",
          "estado": true,
          "actividad": "CERRADA",
          "usuario": "PAZ CHAMBA IVAN FERNANDO",
          "turno": "DIURNO",
          "idTurno": 186,
          "idUsuario": 4,
          "totalRecords": 6
        },
        {
          "idCaja": 395,
          "descripcion": "CAJA DAVILA",
          "estado": true,
          "actividad": "APERTURADA",
          "usuario": "DAVILA RAMIREZ JHONNY ALEXANDER",
          "turno": "DIURNO",
          "idTurno": 186,
          "idUsuario": 9,
          "totalRecords": 6
        },
        {
          "idCaja": 368,
          "descripcion": "CAJA CHRISTIAN ZARATE",
          "estado": true,
          "actividad": "APERTURADA",
          "usuario": "ZARATE I\u00D1IGUEZ CHRISTIAN IVAN",
          "turno": "DIURNO",
          "idTurno": 186,
          "idUsuario": 10,
          "totalRecords": 6
        },
        {
          "idCaja": 277,
          "descripcion": "COMPRAS",
          "estado": true,
          "actividad": "APERTURADA",
          "usuario": "SABANDO ANGULO MIRIAN ISABEL",
          "turno": "DIURNO",
          "idTurno": 186,
          "idUsuario": 257,
          "totalRecords": 6
        },
        {
          "idCaja": 243,
          "descripcion": "CAJA SHEYLA SANMARTIN",
          "estado": true,
          "actividad": "CERRADA",
          "usuario": "SHEYLA DARIANA SANMARTIN URQUIZO",
          "turno": "DIURNO",
          "idTurno": 186,
          "idUsuario": 35,
          "totalRecords": 6
        },
        {
          "idCaja": 240,
          "descripcion": "CAJA  ACONTPLUS",
          "estado": true,
          "actividad": "CERRADA",
          "usuario": "ACONTPLUS WEB",
          "turno": "DIURNO",
          "idTurno": 186,
          "idUsuario": 231,
          "totalRecords": 6
        }
      ]
    }) as any
  }

  getId(id: number) {
    const json = GetIdCajaMapper.toJson(id);
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => GetIdCajaMapper.fromJson(response)));
  }

  getDataForm() {
    const json = FormDataCajaMapper.toJson();
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => FormDataCajaMapper.fromJson(response)));
  }

  create<T>(data: T) {
    return this._http.post<ApiResponseLegacy>(`${this._url}`, { data });
  }

  update<T>(id: number, data: T) {
    return this._http.put<ApiResponseLegacy>(`${this._url}${id}`, { data });
  }

  delete(id: number) {
    return this._http.delete<ApiResponseLegacy>(`${this._url}${id}`);
  }
}
