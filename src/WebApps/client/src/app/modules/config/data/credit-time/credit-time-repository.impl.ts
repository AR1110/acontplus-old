import { inject, Injectable } from '@angular/core';
import { CreditTimeRepository } from '@modules/config/domain/repositories/credit-time.repository';
import { PATHS_API } from '@core/constants/global.constants';
import { CONFIG_PATHS } from '@modules/config/domain/enums/config.enums';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { map, Observable } from 'rxjs';
import { ListCreditTimeMapper } from '@modules/config/data/credit-time/list-credit-time.mapper';
import { CreditTimeList } from '@modules/config/domain/models/tiempo-credito.model';

@Injectable({
  providedIn: 'root',
})
export class CreditTimeRepositoryImpl implements CreditTimeRepository {
  delete(params: Partial<CreditTimeList>): Observable<ApiResponse> {
    return this._http.delete<ApiResponse>(`${this._url}${params.idTiempoCredito}`);
  }
  list(params: any): Observable<any> {
    const json = ListCreditTimeMapper.toJson(params);
    return this._http
      .get<ApiResponse>(`${this._url}?json=${json}`)
      .pipe(map(response => ListCreditTimeMapper.fromJson(response)));
  }
  create(params: any): Observable<ApiResponse> {
    return this._http.post<ApiResponse>(`${this._url}?json=${JSON.stringify(params)}`, '');
  }
  update(params: any): Observable<ApiResponse> {
    return this._http.put<ApiResponse>(
      `${this._url}${params.id}?json=${JSON.stringify(params)}`,
      '',
    );
  }

  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.TIEMPO_CREDITO}`;
  private _http = inject(HttpClient);
}
