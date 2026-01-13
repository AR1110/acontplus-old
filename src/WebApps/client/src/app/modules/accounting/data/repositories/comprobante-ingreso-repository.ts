import { ApiResponseLegacy } from '@core/models/api-response-legacy';
import { Observable } from 'rxjs';

export abstract class ComprobanteIngresoRepository {
  abstract getAll<T>(obj: T): Observable<{ data: any[] }>;
  abstract getDataFilter(): Observable<any>;
  abstract create<T>(data: T): Observable<ApiResponseLegacy>;
  // abstract update<T>(id: number, infrastructure: T): Observable<ApiResponseLegacy>;
  // abstract delete(id: number): Observable<ApiResponseLegacy>;
}
