import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ListCajaMapper } from '@accounting/caja/infrastructure/mappers/list-caja.mapper';
import { CajaRepository } from '@accounting/caja/domain/caja.repository';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { FormDataCajaMapper } from '@accounting/caja/infrastructure/mappers/form-data-caja.mapper';
import { GetIdCajaMapper } from '@accounting/caja/infrastructure/mappers/get-id-caja.mapper';

@Injectable({
  providedIn: 'root',
})
export class CajaWebRepository implements CajaRepository {
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.CASHBOX}`;
  private _http = inject(HttpClient);

  getAll<T>(params: T) {
    const json = ListCajaMapper.toJson(params);
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((res) => ListCajaMapper.fromJson(res)));
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
