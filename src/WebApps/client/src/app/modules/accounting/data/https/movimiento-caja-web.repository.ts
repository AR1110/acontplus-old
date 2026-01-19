import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { MovimientoCajaRepository } from '@accounting/data/repositories/movimiento-caja.repository';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { ListMovimientoCajaMapper } from '@accounting/data/mappers/list-movimiento-caja.mapper';

@Injectable({
  providedIn: 'root',
})
export class MovimientoCajaWebRepository extends MovimientoCajaRepository {
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.MOVIMIENTO_CAJA}`;
  private _http = inject(HttpClient);

  constructor() {
    super();
  }

  getAll<T>(obj: T) {
    const json = ListMovimientoCajaMapper.toJson(obj);
    return this._http
      .get<ApiResponseLegacy>(`${this._url}Get?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(map((response) => ListMovimientoCajaMapper.fromJson(response)));
  }

  getDataFilter() {
    const json = JSON.stringify({ tipo: 3 });
    return this._http.get<ApiResponseLegacy>(`${this._url}Get?json=${json}`).pipe(
      map((response) => {
        if (response.code === '1') {
          const { establecimiento = [] } = JSON.parse(response.payload as string);
          return {
            establecimientos: establecimiento,
          };
        }
        return {
          establecimientos: [],
        };
      }),
    );
  }

  getDataForm() {
    const json = JSON.stringify({ tipo: 2 });
    return this._http.get<ApiResponseLegacy>(`${this._url}Get?json=${json}`).pipe(
      map((response) => {
        const result = {
          cajas: [],
          entidadesFinanciera: [],
          establecimientos: [],
          subEntidadesFinanciera: [],
          tiposDocumento: [],
        };
        if (response.code === '1') {
          const mainData = JSON.parse(response.payload as string);
          const {
            caja = [],
            entidadFinanciera,
            establecimiento,
            subEntidadFinanciera,
            tipoDocumento,
          } = mainData;
          result.cajas = (caja || []).map((c: any) => {
            return {
              idCaja: c.idCaja,
              descripcion: c.caja,
            };
          });
          result.entidadesFinanciera = entidadFinanciera;
          result.establecimientos = establecimiento;
          result.subEntidadesFinanciera = subEntidadFinanciera;
          result.tiposDocumento = tipoDocumento;
        }
        return result;
      }),
    );
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
