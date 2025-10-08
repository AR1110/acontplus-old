import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { map, Observable } from 'rxjs';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { TagRepository } from '@inventory/domain/repositories/tag.repository';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { TagMapper } from '@inventory/data/tag/tag.mapper';

@Injectable({
  providedIn: 'root',
})
export class TagWebRepository implements TagRepository {
  private _url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.TAGS}`;
  private _http = inject(HttpClient);

  getAll<T>(obj: T): Observable<any> {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });
    return this._http
      .get<ApiResponse>(`${this._url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map(response => {
          const result = {
            tags: [] as any[],
          };
          if (response.code === '1') {
            const mainData = JSON.parse(response.payload as string);
            result.tags = TagMapper.fromApiGetAll(mainData);
          }
          return result;
        }),
      );
  }
  post<T>(data: T) {
    return this._http.post<ApiResponse>(`${this._url}`, { data });
  }
  put<T>(id: number, data: T) {
    return this._http.put<ApiResponse>(`${this._url}${id}`, { data });
  }
  updateStatus<T>(id: number) {
    return this._http.delete<ApiResponse>(`${this._url}${id}`);
  }
}
