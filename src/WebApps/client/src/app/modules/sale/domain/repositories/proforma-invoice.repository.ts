import { Observable } from 'rxjs';
import { ProformaInvoiceListResult } from '@sale/domain/models/proforma-invoice';

export abstract class ProformaInvoiceRepository {
  abstract getFilters(): Observable<any>; // o un tipo más específico
  abstract getAll<T>(params: T): Observable<ProformaInvoiceListResult>;
  abstract viewDetail(id: number): Observable<any>;
  // abstract put<T>(id: number, data: T): Observable<ApiResponse<any>>;
  // abstract delete(id: number): Observable<ApiResponse>;
}
