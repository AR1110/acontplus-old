import { inject, Injectable } from '@angular/core';
import { WarehouseRepository } from '@inventory/domain/repositories/warehouse.repository';
import { PATHS_API } from '@core/constants/global.constants';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ListWarehouseResponse, WarehouseList } from '@inventory/domain/models/warehouse.model';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { ListWarehouseMapper } from '@inventory/data/mappers/list-warehouse.mapper';

@Injectable({
  providedIn: 'root',
})
export class WarehouseHttp implements WarehouseRepository {
  list(obj: any): Observable<ListWarehouseResponse> {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });
    return this._http
      .get<ApiResponseLegacy>(`${this._url}?json=${json}`)
      .pipe(map((response) => ListWarehouseMapper.fromJson(response)));
  }
  create(data: WarehouseList) {
    return this._http.post<ApiResponseLegacy>(`${this._url}?json=${JSON.stringify(data)}`, {
      data,
    });
  }
  update(data: WarehouseList) {
    return this._http.put<ApiResponseLegacy>(
      `${this._url}/${data.idBodega}?json=${JSON.stringify(data)}`,
      { data },
    );
  }
  delete(data: WarehouseList) {
    return this._http.delete<ApiResponseLegacy>(`${this._url}/${data.idBodega}`);
  }
  private _url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.WAREHOUSE}`;
  private _http = inject(HttpClient);
}
