import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export abstract class InventarioModeloRepository {
  abstract getAll<T>(obj: T): Observable<{ data: any[] }>;
  abstract updateStatus(idModelo: number): Observable<ApiResponseLegacy>;
  abstract post<T>(data: T): Observable<ApiResponseLegacy>;
  abstract put<T>(id: number, data: T): Observable<ApiResponseLegacy>;
}
