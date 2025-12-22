import { Observable } from 'rxjs';
import { ApiResponseLegacy } from '@core/models/api-response-legacy';

export interface InventarioModeloRepository {
  getAll<T>(obj: T): Observable<{ data: any[] }>;
  updateStatus(idModelo: number): Observable<ApiResponseLegacy>;
  post<T>(data: T): Observable<ApiResponseLegacy>;
  put<T>(id: number, data: T): Observable<ApiResponseLegacy>;
}
