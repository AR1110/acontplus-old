import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map, Observable } from 'rxjs';
import { INVENTORY_PATHS } from '@inventory/inventory.const';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { InventarioModeloRepository } from '@inventory/data/repositories/inventario-modelo.repository';
import { InventarioModeloMapper } from '@inventory/data/mappers/inventario-modelo.mapper';

@Injectable({
  providedIn: 'root',
})
export class InventarioModeloHttp implements InventarioModeloRepository {
  private _url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.MODEL}`;
  private _http = inject(HttpClient);

  getAll<T>(obj: T): Observable<any> {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`, {
        context: getNoLoader(),
      })
      .pipe(
        map((response) => {
          const result = {
            data: [] as any[],
          };
          if (response.code === '1') {
            result.data = InventarioModeloMapper.fromApiGetAll(
              JSON.parse(response.payload as string),
            );
          }
          return result;
        }),
      );
  }

  post<T>(data: T) {
    return this._http.post<ApiResponseLegacy>(
      `${this._url}`,
      { data },
      {
        context: getNoLoader(),
      },
    );
  }

  put<T>(id: number, data: T) {
    return this._http.put<ApiResponseLegacy>(
      `${this._url}${id}`,
      { data },
      {
        context: getNoLoader(),
      },
    );
  }

  updateStatus(id: number) {
    return this._http.delete<ApiResponseLegacy>(`${this._url}${id}`);
  }
}
