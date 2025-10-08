import { Observable } from 'rxjs';
import { ApiResponse } from '@core/models/api-response';

export abstract class InventarioModeloRepository {
  abstract getAll<T>(obj: T): Observable<{ data: any[] }>;
  abstract updateStatus(idModelo: number): Observable<ApiResponse>;
  abstract post<T>(data: T): Observable<ApiResponse>;
  abstract put<T>(id: number, data: T): Observable<ApiResponse>;
}
