import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map, Observable } from 'rxjs';
import { INVENTORY_PATHS } from '@inventory/inventory.const';
import { MeasureRepository } from '@inventory/data/repositories/measure.repository';
import { MeasureRead } from '@inventory/data/models/measure.model';

@Injectable({
  providedIn: 'root',
})
export class MeasureHttp implements MeasureRepository {
  private _url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.MEASURE}`;
  private _http = inject(HttpClient);

  getAll<T>(obj: T): Observable<any> {
    const json = JSON.stringify({
      ...obj,
      tipo: 1,
    });
    return this._http
      .get(`${this._url}?json=${json}` )
      .pipe(
        map((response: any) => {
          let results: MeasureRead[] = [];
          if (response !== null && typeof response === 'object') {
            results = response.measures;
          }
          return results;
        }),
      );
  }
  post<T>(data: T) {
    return this._http.post<ApiResponseLegacy>(
      `${this._url}`,
      { data },

    );
  }
  put<T>(id: number, data: T) {
    return this._http.put<ApiResponseLegacy>(
      `${this._url}${id}`,
      { data },

    );
  }

  updateStatus(id: number) {
    return this._http.delete<ApiResponseLegacy>(`${this._url}${id}`);
  }
}
