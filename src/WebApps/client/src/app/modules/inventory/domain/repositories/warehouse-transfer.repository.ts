import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { GroupedEstab } from '@core/models/estab.model';
import { WarehouseTransferDataFormResult } from '@inventory/domain/models/warehouse-transfer';

export interface WarehouseTransferRepository {
  getAll<T>(obj: T): Observable<{ data: any[]; totalRecords: number }>;
  getDataFilter(): Observable<{ estabs: GroupedEstab[] }>;
  getDataForm(): Observable<WarehouseTransferDataFormResult>;
  post<T>(obj: T): Observable<ApiResponseLegacy>;
  put<T>(id: number, obj: T): Observable<ApiResponseLegacy>;
  updateStatus(id: number): Observable<any>;
  getMassTransferProducts(obj: any): Observable<any>;
  generateSerie(obj: { puntoEmisionId: number }): Observable<any>;
  getById(id: number): Observable<any>;
  viewDetail(id: number): Observable<any>;
}
