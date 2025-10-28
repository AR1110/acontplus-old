import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';
import { GroupedEstab } from '@core/models/estab.model';
import {WarehouseTransferDataFormResult} from "@inventory/domain/models/warehouse-transfer";

export abstract class WarehouseTransferRepository {
  abstract getAll<T>(obj: T): Observable<{ data: any[]; totalRecords: number }>;
  abstract getDataFilter(): Observable<{ estabs: GroupedEstab[] }>;
  abstract getDataForm(): Observable<WarehouseTransferDataFormResult>;
  abstract post<T>(obj: T): Observable<ApiResponse>;
  abstract put<T>(id: number, obj: T): Observable<ApiResponse>;
  abstract updateStatus(id: number): Observable<ApiResponse>;
  abstract getMassTransferProducts(obj:any): Observable<any>
  abstract generateSerie(obj: { puntoEmisionId: number }): Observable<any>
  abstract getById(id: number): Observable<any>
  abstract viewDetail(id: number): Observable<any>
}
