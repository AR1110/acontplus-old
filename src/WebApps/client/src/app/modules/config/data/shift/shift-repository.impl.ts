import { ListShiftResponse, ShiftList } from '@modules/config/data/models/shift.models';
import { ShiftRepository } from '@modules/config/data/repositories/shift.repository';
import { CONFIG_PATHS } from '@modules/config/config-const';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ListShiftMapper } from './list-shift.mapper';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShiftRepositoryImpl implements ShiftRepository {
  // * Paths and HttpClient
  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.SHIFT}`;
  private _http = inject(HttpClient);

  // * Repository Methods
  list(params: any): Observable<ListShiftResponse> {
    const JSON = ListShiftMapper.toJson(params);

    console.log('JSON', JSON);

    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${JSON}`)
      .pipe(map((response) => ListShiftMapper.fromJson(response)));
  }

  create(params: ShiftList): Observable<ApiResponseLegacy> {
    return this._http.post<ApiResponseLegacy>(`${this._url}?json=${JSON.stringify(params)}`, '');
  }
  update(params: ShiftList): Observable<ApiResponseLegacy> {
    return this._http.put<ApiResponseLegacy>(
      `${this._url}${params.idTurno}?json=${JSON.stringify(params)}`,
      '',
    );
  }

  delete(params: Partial<ShiftList>): Observable<ApiResponseLegacy> {
    return this._http.delete<ApiResponseLegacy>(`${this._url}${params.idTurno}`);
  }
}
