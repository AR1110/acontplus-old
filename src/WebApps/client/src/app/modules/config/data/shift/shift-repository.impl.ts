import { ListShiftResponse, ShiftList } from '@modules/config/domain/models/shift.models';
import { ShiftRepository } from '@modules/config/domain/repositories/shift.repository';
import { CONFIG_PATHS } from '@modules/config/domain/enums/config.enums';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponse } from '@core/models/api-response';
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
      .get<ApiResponse>(`${this._url}?json=${JSON}`)
      .pipe(map(response => ListShiftMapper.fromJson(response)));
  }

  create(params: ShiftList): Observable<ApiResponse> {
    return this._http.post<ApiResponse>(`${this._url}?json=${JSON.stringify(params)}`, '');
  }
  update(params: ShiftList): Observable<ApiResponse> {
    return this._http.put<ApiResponse>(
      `${this._url}${params.idTurno}?json=${JSON.stringify(params)}`,
      '',
    );
  }

  delete(params: Partial<ShiftList>): Observable<ApiResponse> {
    return this._http.delete<ApiResponse>(`${this._url}${params.idTurno}`);
  }
}
