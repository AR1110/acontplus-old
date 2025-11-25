import { Observable } from 'rxjs';
import { ProformaInvoiceListResult } from '@sale/domain/models/proforma';

export abstract class ProformaRepository {
  abstract getFilters(): Observable<any>; // o un tipo más específico
  abstract getAll<T>(params: T): Observable<ProformaInvoiceListResult>;
  abstract viewDetail(id: number): Observable<any>;
  abstract getFormData(): Observable<any>;
  // abstract put<T>(id: number, data: T): Observable<ApiResponseLegacy<any>>;
  // abstract delete(id: number): Observable<ApiResponseLegacy>;
}
