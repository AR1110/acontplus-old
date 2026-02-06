import { inject, Injectable } from '@angular/core';
import { WarehouseRepository } from '@inventory/domain/repositories/warehouse.repository';
import { PATHS_API } from '@core/constants/global.constants';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ListWarehouseResponse, WarehouseList } from '@inventory/domain/models/warehouse.model';
import { ApiResponse } from '@core/models/api-response';
import { ListWarehouseMapper } from '@inventory/data/warehouse/list-warehouse.mapper';
import { AddUpdateMapper } from '@inventory/data/warehouse/add-update-mapper';

@Injectable({
  providedIn: 'root',
})
export class WarehouseRepositoryImpl implements WarehouseRepository {
  list(obj: any): Observable<ListWarehouseResponse> {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });
    return this._http
      .get<ApiResponse>(`${this._url}?json=${json}`)
      .pipe(map(response => ListWarehouseMapper.fromJson(response)));
  }
  create(obj: WarehouseList) {
    const data = AddUpdateMapper.toJson(obj);
    return this._http.post<ApiResponse>(`${this._url}?json=${JSON.stringify(data)}`, { data });
  }
  update(obj: WarehouseList) {
    const data = AddUpdateMapper.toJson(obj);
    return this._http.put<ApiResponse>(
      `${this._url}/${data.id}?json=${JSON.stringify(data)}`,
      { data },
    );
  }
  delete(data: WarehouseList) {
    return this._http.delete<ApiResponse>(`${this._url}/${data.idBodega}`);
  }
  private _url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.WAREHOUSE}`;
  private _http = inject(HttpClient);
}
