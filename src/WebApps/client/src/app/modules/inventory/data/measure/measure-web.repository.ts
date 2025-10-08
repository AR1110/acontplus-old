import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { map, Observable } from 'rxjs';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { TagRepository } from '@inventory/domain/repositories/tag.repository';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { TagMapper } from '@inventory/data/tag/tag.mapper';
import { BrandRepository } from '@inventory/domain/repositories/brand.repository';
import { MeasureRead } from '@inventory/domain/models/measure.model';

@Injectable({
  providedIn: 'root',
})
export class MeasureWebRepository implements BrandRepository {
  private _url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.MEASURE}`;
  private _http = inject(HttpClient);

  getAll<T>(obj: T): Observable<any> {
    const json = JSON.stringify({
      ...obj,
      tipo: 1,
    });
    return this._http
      .get(`${this._url}?json=${json}`, {
        context: getNoLoader(),
      })
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
