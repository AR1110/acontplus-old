import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { ACCOUNTING_PATHS } from '@accounting/shared/enums/accounting.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map } from 'rxjs';
import { AnticipoRepository } from '@accounting/data/repositories/anticipo.repository';
import { ListAnticipoMapper } from '@accounting/data/mappers/list-anticipo.mapper';

@Injectable({
  providedIn: 'root',
})
export class AnticipoWebRepository implements AnticipoRepository {
  private _url = `${PATHS_API.ACCOUNTING}${ACCOUNTING_PATHS.ANTICIPO}`;
  private _http = inject(HttpClient);

  getAll<T>(obj: T) {
    const json = ListAnticipoMapper.toJson(obj);
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => ListAnticipoMapper.fromJson(response)));
  }

  getDataFilter() {
    const json = JSON.stringify({ tipo: 3 });
    return this._http.get<ApiResponseLegacy>(`${this._url}?json=${json}`).pipe(
      map((response) => {
        if (response.code === '1') {
          const mainData = JSON.parse(response.payload as string);
          const { establecimiento } = mainData;
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
    return this._http.get<ApiResponseLegacy>(`${this._url}?json=${json}`).pipe(
      map((response) => {
        let entidadesFinanciera = [],
          establecimientos = [],
          subEntidadesFinanciera = [];
        if (response.code === '1') {
          const mainData = JSON.parse(response.payload as string);
          const { entidadFinanciera, establecimiento, subEntidadFinanciera } = mainData;

          entidadesFinanciera = entidadFinanciera;
          establecimientos = establecimiento;
          subEntidadesFinanciera = subEntidadFinanciera;
        }
        return {
          entidadesFinanciera,
          establecimientos,
          subEntidadesFinanciera,
        };
      }),
    );
  }

  delete(id: number) {
    return this._http.delete<ApiResponseLegacy>(`${this._url}${id}`);
  }

  create(data: any) {
    return this._http.post<ApiResponseLegacy>(`${this._url}`, { data });
  }

  update<T>(id: number, data: T) {
    return this._http.put<ApiResponseLegacy>(`${this._url}${id}`, data);
  }
}
