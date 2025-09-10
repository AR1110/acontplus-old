import { ListShiftResponse, ShiftList } from '@modules/config/domain/models/shift.models';
import { ShiftRepository } from '@modules/config/domain/repositories/shift.repository';
import { CONFIG_PATHS } from '@modules/config/domain/enums/config.enums';
import { PATHS_API } from '@core/constants/global.constants';
import { ApiResponse } from '@core/models/api-response';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShiftRepositoryImpl implements ShiftRepository {
  // * Paths and HttpClient
  private _url = `${PATHS_API.CONFIG}${CONFIG_PATHS.TIEMPO_CREDITO}`;
  private _http = inject(HttpClient);

  // * Repository Methods
  override list(params: any): Observable<ListShiftResponse> {
    throw new Error('Method not implemented.');
  }
  override create(params: any): Observable<ApiResponse> {
    throw new Error('Method not implemented.');
  }
  override update(params: any): Observable<ApiResponse> {
    throw new Error('Method not implemented.');
  }
  override delete(params: Partial<ShiftList>): Observable<ApiResponse> {
    throw new Error('Method not implemented.');
  }
}
