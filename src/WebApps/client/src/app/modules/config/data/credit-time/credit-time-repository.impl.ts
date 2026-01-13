import { inject, Injectable } from '@angular/core';
import { CreditTimeRepository } from '@modules/config/data/repositories/credit-time.repository';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map, Observable } from 'rxjs';
import { ListCreditTimeMapper } from '@modules/config/data/credit-time/list-credit-time.mapper';
import { CreditTimeList } from '@modules/config/data/models/tiempo-credito.model';

@Injectable({
  providedIn: 'root',
})
export class CreditTimeRepositoryImpl implements CreditTimeRepository {
  delete(params: Partial<CreditTimeList>): Observable<ApiResponseLegacy> {
    return this._http.delete<ApiResponseLegacy>(`${this._url}${params.idTiempoCredito}`);
  }
  list(params: any): Observable<any> {
    const json = ListCreditTimeMapper.toJson(params);
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => ListCreditTimeMapper.fromJson(response)));
  }
  create(params: any): Observable<ApiResponseLegacy> {
    return this._http.post<ApiResponseLegacy>(`${this._url}?json=${JSON.stringify(params)}`, '');
  }
  update(params: any): Observable<ApiResponseLegacy> {
    return this._http.put<ApiResponseLegacy>(
      `${this._url}${params.id}?json=${JSON.stringify(params)}`,
      '',
    );
  }

  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.TIEMPO_CREDITO}`;
  private _http = inject(HttpClient);
}
