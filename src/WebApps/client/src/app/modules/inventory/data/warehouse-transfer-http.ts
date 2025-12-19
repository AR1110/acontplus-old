import { inject, Injectable } from '@angular/core';
import { PATHS_API } from '@core/constants/global.constants';
import { HttpClient } from '@angular/common/http';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { map, Observable } from 'rxjs';
import { INVENTORY_PATHS } from '@inventory/domain/enums/inventory.enum';
import { WarehouseTransferRepository } from '@inventory/domain/repositories/warehouse-transfer.repository';
import { TransferenciaBodegaMapper } from '@inventory/data/mappers/warehouse-transfer/warehouse-transfer.mapper';
import { WarehouseTransferDataFormResult } from '@inventory/domain/models/warehouse-transfer';
import { WarehouseTransferDataFormMapper } from '@inventory/data/mappers/warehouse-transfer/warehouse-transfer-data-form.mapper';
import { GetMassTransferProductsMapper } from '@inventory/data/mappers/warehouse-transfer/get-mass-transfer-products.mapper';
import { WarehouseTransferGenerateSerieMapper } from '@inventory/data/mappers/warehouse-transfer/warehouse-transfer-generate-serie.mapper';
import { WarehouseTransferSaveMapper } from '@inventory/data/mappers/warehouse-transfer/warehouse-transfer-save.mapper';
import { WarehouseTransferGetByIdMapper } from '@inventory/data/mappers/warehouse-transfer/warehouse-transfer-get-by-id.mapper';
import { WarehouseTransferDetail } from '@inventory/ui/warehouse-transfer/warehouse-transfer-detail/warehouse-transfer-detail';
import { WarehouseTransferViewDetailMapper } from '@inventory/data/mappers/warehouse-transfer/warehouse-transfer-view-detail.mapper';

@Injectable({
  providedIn: 'root',
})
export class WarehouseTransferHttp implements WarehouseTransferRepository {
  private _url = `${PATHS_API.INVENTORY}${INVENTORY_PATHS.TRANSFERENCIA_BODEGA}`;
  private _http = inject(HttpClient);

  getAll<T>(obj: T): Observable<any> {
    const json = JSON.stringify({
      tipo: 1,
      ...obj,
    });
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => TransferenciaBodegaMapper.fromApiAll(response)));
  }

  getDataFilter() {
    const json = JSON.stringify({
      tipo: 2,
    });
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => TransferenciaBodegaMapper.fromApiFilter(response)));
  }

  getDataForm(): Observable<WarehouseTransferDataFormResult> {
    const json = WarehouseTransferDataFormMapper.toJson();
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => WarehouseTransferDataFormMapper.fromJson(response)));
  }

  post<T>(obj: T) {
    const dto = WarehouseTransferSaveMapper.toJson(obj);
    return this._http.post<ApiResponseLegacy>(`${this._url}`, dto);
  }
  put<T>(id: number, data: T) {
    const dto = WarehouseTransferSaveMapper.toJson(data);

    return this._http.put<ApiResponseLegacy>(`${this._url}/${id}`, dto);
  }

  updateStatus(id: number) {
    return this._http.delete<ApiResponseLegacy>(`${this._url}/${id}`).pipe(
      map((response) => {
        return {
          success: response.code === '1',
          message: response.message,
        };
      }),
    );
  }

  getMassTransferProducts(obj: any) {
    const json = GetMassTransferProductsMapper.toJson(obj);
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => GetMassTransferProductsMapper.fromJson(response)));
  }

  generateSerie(obj: { puntoEmisionId: number }): Observable<any> {
    const json = WarehouseTransferGenerateSerieMapper.toJson(obj);
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => WarehouseTransferGenerateSerieMapper.fromJson(response)));
  }

  getById(id: number): Observable<any> {
    return this._http
      .get(`${this._url}/GetId/${id}`)
      .pipe(map((response) => WarehouseTransferGetByIdMapper.fromJson(response)));
  }

  viewDetail(id: number): Observable<any> {
    const json = WarehouseTransferViewDetailMapper.toJson(id);
    return this._http
      .get(`${this._url}?json=${json}`)
      .pipe(map((response) => WarehouseTransferViewDetailMapper.fromJson(response)));
  }
}
