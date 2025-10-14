import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { map, Observable } from 'rxjs';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { TransferenciaBodegaRepository } from '@inventory/domain/repositories/transferencia-bodega.repository';
import { TransferenciaBodegaMapper } from './transferencia-bodega.mapper';

@Injectable({
  providedIn: 'root',
})
export class TransferenciaBodegaWebRepository implements TransferenciaBodegaRepository {
  private _url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.TRANSFERENCIA_BODEGA}`;
  private _http = inject(HttpClient);

  getAll<T>(obj: T): Observable<any> {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map(response => TransferenciaBodegaMapper.fromApiAll(response)));
  }

  getDataFilter() {
    const json = JSON.stringify({
      tipo: 2,
    });
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map(response => TransferenciaBodegaMapper.fromApiFilter(response)));
  }

  post<T>(data: T) {
    return this._http.post<ApiResponse>(
      `${this._url}`,
      { data },
      {
        context: getNoLoader(),
      },
    );
  }
  put<T>(id: number, data: T) {
    return this._http.put<ApiResponse>(
      `${this._url}${id}`,
      { data },
      {
        context: getNoLoader(),
      },
    );
  }

  updateStatus(id: number) {
    return this._http.delete<ApiResponse>(`${this._url}${id}`);
  }
}
