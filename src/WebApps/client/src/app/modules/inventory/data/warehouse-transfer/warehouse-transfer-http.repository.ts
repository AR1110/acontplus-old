import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/models/api-response';
import { map, Observable } from 'rxjs';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { getNoLoader } from '@core/interceptors/loader.interceptor';
import { WarehouseTransferRepository } from '@inventory/domain/repositories/warehouse-transfer.repository';
import { TransferenciaBodegaMapper } from './warehouse-transfer.mapper';
import {WarehouseTransferDataFormResult} from "@inventory/domain/models/warehouse-transfer";
import {WarehouseTransferDataFormMapper} from "@inventory/data/warehouse-transfer/warehouse-transfer-data-form.mapper";
import {GetMassTransferProductsMapper} from "@inventory/data/warehouse-transfer/get-mass-transfer-products.mapper";
import {
  WarehouseTransferGenerateSerieMapper
} from "@inventory/data/warehouse-transfer/warehouse-transfer-generate-serie.mapper";

@Injectable({
  providedIn: 'root',
})
export class WarehouseTransferHttpRepository implements WarehouseTransferRepository {
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

  getDataForm(): Observable<WarehouseTransferDataFormResult> {
    const json = WarehouseTransferDataFormMapper.toJson();
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map(response => WarehouseTransferDataFormMapper.fromJson(response)));
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

  getMassTransferProducts(obj:any){
    const json = GetMassTransferProductsMapper.toJson(obj);
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map(response => GetMassTransferProductsMapper.fromJson(response)));
  }

   generateSerie(obj: { puntoEmisionId: number }): Observable<any> {
      const json = WarehouseTransferGenerateSerieMapper.toJson(obj);
      return this._http
        .get(`${this._url}?json=${json}`)
        .pipe(map(response => WarehouseTransferGenerateSerieMapper.fromJson(response)));

  }
}
