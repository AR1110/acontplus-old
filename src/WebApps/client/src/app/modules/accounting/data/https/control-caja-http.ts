import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map } from 'rxjs';
import { ControlCajaRepository } from '@accounting/data/repositories/control-caja.repository';
import { FilterDataControlCajaMapper } from '@accounting/data/mappers/filter-data-control-caja.mapper';
import { ListControlCajaMapper } from '@accounting/data/mappers/list-control-caja.mapper';
import { FormDataControlCajaMapper } from '@accounting/data/mappers/form-data-control-caja.mapper';
import { ArqueoControlCajaMapper } from '@accounting/data/mappers/arqueo-control-caja.mapper';

@Injectable({
  providedIn: 'root',
})
export class ControlCajaHttp implements ControlCajaRepository {
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CONTROL_CAJA}`;
  private _http = inject(HttpClient);

  getAll<T>(params: T) {
    const json = ListControlCajaMapper.toJson(params);
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => ListControlCajaMapper.fromJson(response)));
  }

  getDataFilter() {
    const json = FilterDataControlCajaMapper.toJson();
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => FilterDataControlCajaMapper.fromJson(response)));
  }

  getDataForm() {
    const json = FormDataControlCajaMapper.toJson();
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => FormDataControlCajaMapper.fromJson(response)));
  }

  getArqueoCaja(id: number) {
    const json = ArqueoControlCajaMapper.toJson(id);
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => ArqueoControlCajaMapper.fromJson(response)));
  }

  getDataFormCashboxClose() {
    const json = JSON.stringify({ tipo: 3 });
    return this._http.get<ApiResponseLegacy>(`${this._url}?json=${json}`).pipe(
      map((response) => {
        let data = [] as any[];
        if (response.code === '1') {
          data = JSON.parse(response.payload as string).monedas || [];
        }
        return {
          data,
        };
      }),
    );
  }

  post<T>(data: T) {
    return this._http.post<ApiResponseLegacy>(`${this._url}`, { data });
  }

  put<T>(id: number, data: T) {
    return this._http.put<ApiResponseLegacy>(`${this._url}${id}`, { data });
  }
}
